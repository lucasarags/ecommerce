import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [showMob, setShowMob] = useState(false);

  return (
    <nav>
      <ul
        className={`w-screen gap-10 justify-center hidden md:flex max-w-[1440px] py-3`}
      >
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/produtos">Produtos</Link>
        </li>
        <li>
          <Link to="/categorias">Categorias</Link>
        </li>
        <li>
          <Link to="/meus-pedidos">Meus Pedidos</Link>
        </li>
      </ul>

      {/* Hambúrguer para mostrar o menu mobile */}
      <div className="md:hidden flex justify-end">
        <button onClick={() => setShowMob(!showMob)} className="mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Menu mobile */}
      <div
        className={` ${
          showMob ? "flex" : "hidden"
        } w-screen peer-focus:hidden fixed top-0 left-0 z-50`}
        onClick={() => setShowMob(false)}
      >
        <div className="w-full h-screen bg-black opacity-40"></div>
        <div className="h-screen md:hidden w-full max-w-[264px] p-6 bg-white opacity-100 flex flex-col ">
          <h1 className="text-black font-semibold pb-4">Páginas</h1>
          <ul className="flex-1 flex flex-col">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/produtos">Produtos</Link>
            </li>
            <li>
              <Link to="/categorias">Categorias</Link>
            </li>
            <li>
              <Link to="/meus-pedidos">Meus Pedidos</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
