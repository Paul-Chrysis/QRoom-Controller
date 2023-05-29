import Logo from "../../thirdLayer/Logo";
import BackButton from "../../thirdLayer/BackButton";
import ExitButton from "../../thirdLayer/exitButton";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="nav">
      <Link className="nav-link" to={-1}>
        <BackButton className="nav-item" />
      </Link>
      <Logo className="nav-item" />
      <Link className="nav-link" to="/login">
        <ExitButton className="nav-item" />
      </Link>
    </div>
  );
}

export default Navbar;
