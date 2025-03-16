import WidgetName from "../fifthLayer/WidgetName";
import WidgetState from "../fifthLayer/WidgetState";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectWidget } from "../../features/widgetState/widgetStateSlice";

const Widget = ({ widgetState }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const device = useSelector((state) => state.device.device);
  const role = useSelector((state) => state.user.role);

  const handleWidgetClick = () => {
    dispatch(
      selectWidget({
        widget: {
          widget_label: widgetState.widget_label,
          widget_isAdminOnly: widgetState.widget_isAdminOnly,
          widget_type: widgetState.widget_type,
          widget_state: widgetState.widget_state,
          widget_range: widgetState.widget_range,
          isDevice: false,
        },
      })
    );
    navigate("/widget");
  };
  const admin =
    role === "ADMIN" || (!widgetState.widget_isAdminOnly && !device.adminOnly);
  return (
    <div
      className={
        admin
          ? "m-2 rounded-2xl border shadow p-3"
          : "m-2 rounded-2xl p-3 cursor-not-allowed opacity-50 bg-black"
      }
      onClick={handleWidgetClick}
    >
      <WidgetName name={widgetState.widget_label} />
      <WidgetState
        state={widgetState.widget_state}
        type={widgetState.widget_type}
      />
    </div>
  );
};

export default Widget;
