import Navbar from "../secondLayer/Navbar";
import ScanQRBody from "../secondLayer/ScanQRBody";
import DeviceBody from "../secondLayer/DeviceBody";
import WidgetBody from "../secondLayer/WidgetBody";
import Register from "../Authentication/Register";
import Login from "../Authentication/Login";
import RequireAuth from "../RequireAuth";
import Layout from "./Layout";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      {/* <Navbar className=".navbar navbar-expand-lg bg-body-tertiary"></Navbar> */}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route element={<RequireAuth />}>
            <Route path="/scanQR" element={<ScanQRBody />} />
            <Route path="/device" element={<DeviceBody />} />
            <Route path="/widget" element={<WidgetBody />} />
          </Route>
          {/* <Route path="*" element={<Missing />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
