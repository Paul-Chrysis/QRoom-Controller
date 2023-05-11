import Logo from "../thirdLayer/Logo";
import BackButton from "../thirdLayer/BackButton";

function Navbar() {
  return (
    <div className="container-fluid">
      <Logo className="nav-item" />
      <BackButton className="nav-item" />
    </div>
  );
}

export default Navbar;
