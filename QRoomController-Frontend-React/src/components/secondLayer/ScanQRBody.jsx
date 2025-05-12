import Camera from "../thirdLayer/Camera";
import Iframe from "../thirdLayer/Iframe";
import { useLocation } from "react-router-dom";

function ScanQRBody() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <section className="h-full">
      {path === "/gesture" && <Camera />}
      {path === "/ar" && <Iframe />}
    </section>
  );
}

export default ScanQRBody;
