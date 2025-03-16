import Logo from "../../thirdLayer/Logo";
import BackButton from "../../thirdLayer/BackButton";
import ExitButton from "../../thirdLayer/exitButton";
import NavMenu from "./NavMenu";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="bg-teal-900 text-azure h-[15%] sticky flex justify-between px-4 items-center">
      <div className="flex items-center gap-8">
        <Link className="nav-link" to={-1}>
          <BackButton className="nav-item" />
        </Link>
        <div className="w-32 sm:w-64">
          <Logo />
        </div>
      </div>
      <div className="flex items-center gap-8">
        <NavMenu />
        <Link className="nav-link" to="/login">
          <ExitButton className="nav-item" />
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
