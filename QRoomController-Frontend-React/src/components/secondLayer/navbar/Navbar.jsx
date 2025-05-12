import Logo from "../../thirdLayer/Logo";
import BackButton from "../../thirdLayer/BackButton";
import ExitButton from "../../thirdLayer/ExitButton";
import NavMenu from "./NavMenu";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-primary-800 to-primary-900 text-white h-[15%] sticky top-0 z-50 shadow-md flex justify-between px-6 items-center">
      <div className="flex items-center gap-8">
        <Link 
          className="nav-link transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full p-1" 
          to={-1}
        >
          <BackButton className="nav-item" />
        </Link>
        <div className="w-32 sm:w-64 transition-opacity duration-200 hover:opacity-90">
          <Logo />
        </div>
      </div>
      <div className="flex items-center gap-8">
        <NavMenu />
        <Link 
          className="nav-link transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-full p-1" 
          to="/login"
        >
          <ExitButton className="nav-item" />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
