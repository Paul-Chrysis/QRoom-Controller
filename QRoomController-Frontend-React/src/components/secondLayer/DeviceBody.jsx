import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchDevice } from "../../features/fetchDevice/fetchDeviceSlice";

import DeviceName from "../thirdLayer/DeviceName";
import WidgetList from "../thirdLayer/WidgetList";
import Card from "../ui/Card";

function DeviceBody() {
  const currentDeviceState = useSelector((state) => state.device.device);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.token);
  const id = useSelector((state) => state.ids.selectedDevice);

  useEffect(() => {
    dispatch(fetchDevice({ token, id }));
  }, []);

  return (
    <>
      <section className="bg-slate-300 w-full h-full shadow-inner p-10 items-center">
        <div className="mx-auto">
          <Card className="max-w-sm mx-auto">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              <DeviceName name={currentDeviceState.deviceType} />
            </h5>
            <WidgetList
              widgets={currentDeviceState.device_widgets}
              adminOnly={currentDeviceState.adminOnly}
              isActive={currentDeviceState.device_isActive}
            />
          </Card>
        </div>
      </section>
    </>
  );
}

export default DeviceBody;
