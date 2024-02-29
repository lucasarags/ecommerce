import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar({ showMob, setShowMob }) {
  return (
    <nav>
      <ul
        className={`w-full gap-10 justify-center hidden md:flex py-6 text-base font-semibold text-zinc-50`}
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
