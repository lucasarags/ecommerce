import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db/db.mjs";

const app = express();

// Middleware para analisar o corpo da requisição como JSON
app.use(express.json());

app.get("/produtos", async (req, res) => {
  try {
    const produtos = await pool.query("SELECT * FROM Produto");
    res.json(produtos.rows);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ error: "Erro ao buscar produtos." });
  }
});

// Rota para cadastro de usuário
app.post("/signup", async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    await client.query("BEGIN");

    // Verificar se o usuário já existe com o mesmo email
    const userExists = await pool.query(
      "SELECT * FROM Usuario WHERE email = $1",
      [email]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: "Este email já está em uso." });
    }

    // Criptografar a senha antes de armazenar no banco de dados
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Inserir novo usuário no banco de dados
    const newUser = await pool.query(
      "INSERT INTO Usuario (nome, email, senha) VALUES ($1, $2, $3) RETURNING *",
      [nome, email, hashedPassword]
    );
    await client.query("COMMIT");
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error("Erro ao cadastrar usuário:", err);
    res.status(500).json({ error: "Erro ao cadastrar usuário." });
  } finally {
    client.release();
  }
});

// Rota para login de usuário
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verificar se o usuário existe com o mesmo email
    const user = await pool.query("SELECT * FROM Usuario WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "Email ou senha incorretos." });
    }

    // Verificar se a senha está correta
    const passwordMatch = await bcrypt.compare(senha, user.rows[0].senha);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Email ou senha incorretos." });
    }

    // Gerar token de autenticação
    const tokenPayload = {
      userId: user.rows[0].id,
      nome: user.rows[0].nome,
      email: user.rows[0].email,
    };
    const token = jwt.sign(tokenPayload, "secreto", {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (err) {
    console.error("Erro ao realizar login:", err);
    res.status(500).json({ error: "Erro ao realizar login." });
  }
});

// Rota para visualizar todos os usuários
app.get("/users", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM Usuario");
    res.json(users.rows);
  } catch (err) {
    console.error("Erro ao consultar usuários:", err);
    res.status(500).json({ error: "Erro ao consultar usuários." });
  }
});

// Rota para finalizar compra (Checkout)
app.post("/checkout", async (req, res) => {
  const { usuarioId, carrinho } = req.body;

  try {
    await client.query("BEGIN");
    // Verificar se há produtos suficientes em estoque
    for (const item of carrinho) {
      const { produto_id, quantidade } = item;

      const produto = await pool.query(
        "SELECT qtd_estq FROM Produto WHERE id = $1",
        [produto_id]
      );

      if (produto.rows.length === 0) {
        return res.status(404).json({ error: "Produto não encontrado." });
      }

      if (produto.rows[0].qtd_estq < quantidade) {
        return res.status(400).json({
          error: `Quantidade insuficiente em estoque para o produto ID ${produto_id}.`,
        });
      }
    }

    // Criar um novo pedido
    const novoPedido = await pool.query(
      "INSERT INTO Pedido (usuario_id, estado) VALUES ($1, 'em processo') RETURNING id",
      [usuarioId]
    );

    const pedidoId = novoPedido.rows[0].id;

    // Adicionar os itens do carrinho ao item_do_pedido
    for (const item of carrinho) {
      const { produto_id, quantidade } = item;

      await pool.query(
        "INSERT INTO Item_do_Pedido (pedido_id, produto_id, quantidade) VALUES ($1, $2, $3)",
        [pedidoId, produto_id, quantidade]
      );

      // Atualizar o estoque do produto
      await pool.query(
        "UPDATE Produto SET qtd_estq = qtd_estq - $1 WHERE id = $2",
        [quantidade, produto_id]
      );
    }
    await client.query("COMMIT");
    res.status(200).json({ message: "Pedido finalizado com sucesso." });
  } catch (error) {
    console.error("Erro ao finalizar pedido:", error);
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
