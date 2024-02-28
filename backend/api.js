import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "./db/db.mjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware para analisar o corpo da requisição como JSON
app.use(express.json());

// Rota para listar produtos com paginação
app.get("/produtos", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Página atual, padrão é 1
    const limit = parseInt(req.query.limit) || 10; // Número de itens por página, padrão é 10
    const offset = (page - 1) * limit; // Offset para a consulta SQL

    // Consulta SQL para recuperar produtos com limit e offset para paginação
    const queryResult = await pool.query(
      "SELECT * FROM Produto LIMIT $1 OFFSET $2",
      [limit, offset]
    );

    const produtos = queryResult.rows;
    res.json(produtos);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
});

// Rota para filtrar produtos
app.get("/produtos/filtrar", async (req, res) => {
  try {
    const { categoria, preco_min, preco_max } = req.query;

    let filterQuery = "SELECT * FROM Produto WHERE 1 = 1";
    const queryParams = [];

    let paramIndex = 1; // Índice para os parâmetros

    if (categoria) {
      filterQuery += ` AND categoria_id = $${paramIndex}`;
      queryParams.push(parseInt(categoria));
      paramIndex++;
    }

    if (preco_min) {
      filterQuery += ` AND preco >= $${paramIndex}`;
      queryParams.push(parseFloat(preco_min)); // Convertendo para número
      paramIndex++;
    }

    if (preco_max) {
      filterQuery += ` AND preco <= $${paramIndex}`;
      queryParams.push(parseFloat(preco_max)); // Convertendo para número
      paramIndex++;
    }
    // console.log("Consulta SQL:", filterQuery);
    // console.log("Parâmetros:", queryParams);

    const filteredProducts = await pool.query(filterQuery, queryParams);
    res.json(filteredProducts.rows);
  } catch (error) {
    console.error("Erro ao filtrar produtos:", error);
    res.status(500).json({ error: "Erro ao filtrar produtos." });
  }
});

// Rota para cadastro de usuário
app.post("/cadastro", async (req, res) => {
  const { nome, email, senha } = req.body;

  // Verificar se todos os campos obrigatórios estão presentes
  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  // Validar formato do email (opcional)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Formato de email inválido." });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Verificar se o usuário já existe com o mesmo email
    const userExists = await client.query(
      "SELECT * FROM Usuario WHERE email = $1",
      [email]
    );
    if (userExists.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Este email já está em uso." });
    }

    // Criptografar a senha antes de armazenar no banco de dados
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Inserir novo usuário no banco de dados
    const newUser = await client.query(
      "INSERT INTO Usuario (nome, email, senha) VALUES ($1, $2, $3) RETURNING *",
      [nome, email, hashedPassword]
    );

    await client.query("COMMIT");
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Erro ao cadastrar usuário:", err);
    res.status(500).json({ error: "Erro ao cadastrar usuário." });
  } finally {
    client.release();
  }
});

// Rota para login de usuário
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  // Validar campos
  if (!email || !senha) {
    return res
      .status(400)
      .json({ error: "Por favor, forneça um email e senha válidos." });
  }

  try {
    // Verificar se o usuário existe com o mesmo email
    const user = await pool.query("SELECT * FROM Usuario WHERE email = $1", [
      email,
    ]);

    // Verificar se o usuário está cadastrado
    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Email incorretos." });
    }

    // Verificar se a senha está correta
    const passwordMatch = await bcrypt.compare(senha, user.rows[0].senha);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Senha incorretos." });
    }

    // Gerar token de autenticação
    const tokenPayload = {
      userId: user.rows[0].id,
      nome: user.rows[0].nome,
      email: user.rows[0].email,
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    res.json({ token });
  } catch (err) {
    console.error("Erro ao realizar login:", err);
    res.status(500).json({ error: "Erro ao realizar login." });
  }
});

// Rota para pegar todas as vendas e seus produtos de um usuário específico
app.get("/vendas", async (req, res) => {
  try {
    // Verificar se o token de autenticação foi fornecido no cabeçalho da solicitação
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; // ID do usuário autenticado

    // Consultar o banco de dados para obter todas as vendas e seus produtos do usuário específico
    const vendas = await pool.query(
      "SELECT * FROM Pedido WHERE usuario_id = $1",
      [userId]
    );

    // Estruturar os dados das vendas e seus produtos de forma organizada
    const vendasComProdutos = [];
    for (const venda of vendas.rows) {
      const produtosDaVenda = await pool.query(
        "SELECT p.nome, p.descricao, p.preco, ip.quantidade FROM Produto p INNER JOIN Item_do_Pedido ip ON p.id = ip.produto_id WHERE ip.pedido_id = $1",
        [venda.id]
      );
      vendasComProdutos.push({
        venda: venda,
        produtos: produtosDaVenda.rows,
      });
    }

    // Retornar os dados das vendas e seus produtos em uma resposta JSON
    res.json(vendasComProdutos);
  } catch (error) {
    console.error("Erro ao buscar vendas do usuário:", error);
    res.status(500).json({ error: "Erro ao buscar vendas do usuário." });
  }
});

// Rota para visualizar todos os usuários
app.get("/usuarios", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM Usuario");
    res.json(users.rows);
  } catch (err) {
    console.error("Erro ao consultar usuários:", err);
    res.status(500).json({ error: "Erro ao consultar usuários." });
  }
});

// Rota para cadastrar uma venda
app.post("/vendas", async (req, res) => {
  const { usuarioId, carrinho } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Criar um novo pedido
    const novoPedido = await client.query(
      "INSERT INTO Pedido (usuario_id, estado) VALUES ($1, 'em processo') RETURNING id",
      [usuarioId]
    );

    const pedidoId = novoPedido.rows[0].id;

    // Adicionar os itens do carrinho ao item_do_pedido
    for (const item of carrinho) {
      const { produto_id, quantidade, preco_unitario } = item;

      // Verificar se há produtos suficientes em estoque
      const produto = await client.query(
        "SELECT qtd_estq FROM Produto WHERE id = $1",
        [produto_id]
      );

      if (produto.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ error: "Produto não encontrado." });
      }

      if (produto.rows[0].qtd_estq < quantidade) {
        await client.query("ROLLBACK");
        return res.status(400).json({
          error: `Quantidade insuficiente em estoque para o produto ID ${produto_id}.`,
        });
      }

      // Inserir o item do pedido
      await client.query(
        "INSERT INTO Item_do_Pedido (pedido_id, produto_id, quantidade, preco_unitario) VALUES ($1, $2, $3, $4)",
        [pedidoId, produto_id, quantidade, preco_unitario]
      );

      // Atualizar o estoque do produto
      await client.query(
        "UPDATE Produto SET qtd_estq = qtd_estq - $1 WHERE id = $2",
        [quantidade, produto_id]
      );
    }

    await client.query("COMMIT");
    res.status(200).json({ message: "Pedido finalizado com sucesso." });
  } catch (error) {
    console.error("Erro ao finalizar pedido:", error);
    await client.query("ROLLBACK");
    res.status(500).json({ error: "Erro ao finalizar pedido." });
  } finally {
    client.release();
  }
});

// Inicie o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
