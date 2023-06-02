import { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { fetchDevice } from "../../features/fetchDevice/fetchDeviceSlice";

import DeviceName from "../thirdLayer/DeviceName";
import WidgetList from "../thirdLayer/WidgetList";

function DeviceBody() {
  const currentDeviceState = useSelector((state) => state.device.device);
  console.log(currentDeviceState);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const id = useSelector((state) => state.ids.selectedDevice);
  console.log(id);

  useEffect(() => {
    dispatch(fetchDevice({ token, id }));
  }, []);

  return (
    <>
      <section className="auth-form">
        <DeviceName name={currentDeviceState.deviceType} />
        <WidgetList
          widgets={currentDeviceState.device_widgets}
          adminOnly={currentDeviceState.adminOnly}
          isActive={currentDeviceState.isActive}
        />
      </section>
    </>
  );
}

export default DeviceBody;
