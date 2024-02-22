import logo from "../../assets/logo.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineShoppingCart } from "react-icons/md";
import { ImSearch } from "react-icons/im";

export default function Header() {
  return (
    <header className=" h-36 bg-blue-900 p-8">
      <div className="flex  justify-between">
        <GiHamburgerMenu className="text-zinc-50 text-3xl" />
        <img src={logo} alt="" className="h-7" />
        <MdOutlineShoppingCart className="text-zinc-50 text-3xl" />
      </div>
      <div className="relative ">
        <input
          placeholder="Buscar"
          className="h-8 px-8 w-full border mt-3 bg-zing-50 text-slate-100 font-normal text-xs leading-4 rounded "
        />
        <div className="absolute bottom-2 left-3">
          <ImSearch className="text-zinc-500" />
        </div>
      </div>
    </header>
  );
}
