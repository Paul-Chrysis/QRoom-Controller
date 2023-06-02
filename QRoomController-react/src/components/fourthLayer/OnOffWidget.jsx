import WidgetName from "../fifthLayer/WidgetName";
import WidgetState from "../fifthLayer/WidgetState";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectWidget } from "../../features/widgetState/widgetStateSlice";

const OnOffWidget = ({ isActive }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const device = useSelector((state) => state.device.device);
  console.log("Widget State: ");
  console.log(device);

  const handleWidgetClick = () => {
    dispatch(
      selectWidget({
        widget: {
          widget_label: device.deviceType,
          widget_isAdminOnly: device.adminOnly,
          widget_type: "on/off",
          widget_state: device.device_isActive,
          isDevice: true,
        },
      })
    );
    navigate("/widget");
  };
  return (
    <div className="widget" onClick={handleWidgetClick}>
      <WidgetName name="running" />
      <WidgetState state={isActive} type="on/off" />
    </div>
  );
};

export default OnOffWidget;
