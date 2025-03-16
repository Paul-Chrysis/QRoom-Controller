import WidgetName from "../fifthLayer/WidgetName";
import WidgetState from "../fifthLayer/WidgetState";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectWidget } from "../../features/widgetState/widgetStateSlice";

const OnOffWidget = ({ isActive }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const device = useSelector((state) => state.device.device);
  const role = useSelector((state) => state.user.role);

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
  const admin = role === "ADMIN" || !device.adminOnly;
  return (
    <div
      className={
        admin
          ? "m-2 rounded-2xl border shadow p-3"
          : "m-2 rounded-2xl p-3 cursor-not-allowed opacity-50 bg-black"
      }
      onClick={handleWidgetClick}
    >
      <WidgetName name="running" />
      <WidgetState state={isActive} type="on/off" />
    </div>
  );
};

export default OnOffWidget;
