import logo from "../../assets/logo.png";
import { useState } from "react";
import { MdOutlineShoppingCart } from "react-icons/md";
import { ImSearch } from "react-icons/im";
import Navbar from "../Navbar";

export default function Header() {
  const [showMob, setShowMob] = useState(false);

  return (
    <header className="h-36 w-full bg-blue-900 p-8 flex-row">
      <div className="flex justify-between items-center w-full md:w-auto">
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
        <img src={logo} alt="" className="h-7 mr-4 order-0" />
        <div className="relative mt-4 hidden  md:flex order-1">
        <input
          placeholder="Buscar"
          className="h-8 px-8   w-[40vw] border bg-zing-50 text-slate-100 font-normal text-xs leading-4 rounded"
        />
        <div className="absolute bottom-2 left-3">
          <ImSearch className="text-zinc-500" />
        </div>
        <p className="text-base font-semibold text-zinc-50">Cadastre-se</p>
        <button className="bg-orange-600 h-10 w-[128px] drop-shadow-lg border-[1px] border-black text-base font-semibold text-zinc-50 rounded-lg">
        Entrar
      </button>
      </div>
        <MdOutlineShoppingCart className="text-zinc-50 text-3xl md:order-2" />
      </div>
      <div className="relative mt-4 md:hidden w-full order-1">
        <input
          placeholder="Buscar"
          className="h-8 px-8 w-full md:w-auto border bg-zing-50 text-slate-100 font-normal text-xs leading-4 rounded"
        />
        <div className="absolute bottom-2 left-3">
          <ImSearch className="text-zinc-500" />
        </div>
      </div>
      <Navbar showMob={showMob} setShowMob={setShowMob} />
    </header>
  );
}
