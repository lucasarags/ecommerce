import logo from "../../assets/logo.png";
import { useState } from "react";
import { MdOutlineShoppingCart } from "react-icons/md";
import { ImSearch } from "react-icons/im";
import Navbar from "../Navbar";

export default function Header() {
  const [showMob, setShowMob] = useState(false);

  return (
    <header className="h-36 bg-blue-900 p-8">
      <div className="flex flex-col justify-between flex-1 md:flex-row justify-between items-center">
        {/* Hambúrguer, logo e ícone do carrinho */}
        <div className="flex items-center">
          {/* Hambúrguer para mostrar o menu mobile */}
          <div className="md:hidden mr-4">
            <button onClick={() => setShowMob(!showMob)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-zinc-50"
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

          {/* Logo */}
          <img src={logo} alt="" className="h-7 mr-4" />

          {/* Ícone do carrinho */}
          <MdOutlineShoppingCart className="md:hidden text-zinc-50 text-3xl" />
        </div>

        {/* Input de busca (centralizado abaixo dos elementos anteriores) */}
        <div className="relative mt-4 md:mt-0">
          <input
            placeholder="Buscar"
            className="h-8 px-8 w-full border bg-zing-50 text-slate-100 font-normal text-xs leading-4 rounded"
          />
          <div className="absolute bottom-2 left-3">
            <ImSearch className="text-zinc-500" />
          </div>
        </div>
      </div>

      {/* Navbar */}
      <Navbar showMob={showMob} setShowMob={setShowMob} />
    </header>
  );
}
