import DeviceName from "../thirdLayer/DeviceName";
import WidgetList from "../thirdLayer/WidgetList";
import axios from "../../api/axios";
import { useLocation } from "react-router-dom";
import { useEffect, useReducer } from "react";
import useAuth from "../../hooks/useAuth";

const INITIAL_STATE = {
  deviceType: "lights",
  adminOnly: false,
  device_isActive: false,
  device_widgets: [
    {
      id: 0,
      widget_isAdminOnly: false,
      widget_label: "intencity",
      widget_state: 50,
      widget_type: "bar",
    },
    {
      id: 1,
      widget_isAdminOnly: false,
      widget_label: "color",
      widget_state: 100,
      widget_type: "bar",
    },
  ],
};

function DeviceBody() {
  // const location = useLocation();
  // const DEVICE_URL = `/api/v1/device/${location.state}`;
  // const { auth } = useAuth();

  // const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // const fetchDevices = async () => {
  //   const token = "Bearer " + auth.token;
  //   try {
  //     const response = await axios.get(DEVICE_URL, {
  //       headers: { Authorization: token },
  //       withCredentials: true,
  //     });
  //     console.log(response);
  //     dispatch("update all", {
  //       deviceType: response.data.deviceType,
  //       adminOnly: response.data.adminOnly,
  //       device_isActive: response.data.device_isActive,
  //       device_widgets: response.data.device_widgets,
  //     });
  //     console.log(state);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // useEffect(() => {
  //   fetchDevices();
  // }, []);
  return (
    <>
      <section className="auth-form">
        <DeviceName name={INITIAL_STATE.deviceType} />
        <WidgetList
          widgets={INITIAL_STATE.device_widgets}
          adminOnly={INITIAL_STATE.adminOnly}
          isActive={INITIAL_STATE.isActive}
        />
      </section>
    </>
  );
}

export default DeviceBody;
