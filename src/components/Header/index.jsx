import logo from "../../assets/logo.png"
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IconContext } from "react-icons";


export default function Header() {
    return (
        <header className=" h-36 bg-blue-900 p-8">
            <div className="flex  justify-between">
                <GiHamburgerMenu className="text-zinc-50 text-2xl"/>
                <img src={logo} alt="" className="h-6" />
                <MdOutlineShoppingCart className="text-zinc-50 text-2xl" />
            </div>
            <input placeholder="Buscar" className="w-full border bg-zing-50 text-slate-100"/>
        </header>
    )
}