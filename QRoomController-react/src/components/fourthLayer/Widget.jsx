import WidgetName from "../fifthLayer/WidgetName";
import WidgetState from "../fifthLayer/WidgetState";

import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { selectWidget } from "../../features/widgetState/widgetStateSlice";

const Widget = ({ widgetState }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleWidgetClick = () => {
    dispatch(
      selectWidget({
        widget: {
          widget_label: widgetState.widget_label,
          widget_isAdminOnly: widgetState.widget_isAdminOnly,
          widget_type: widgetState.widget_type,
          widget_state: widgetState.widget_state,
          isDevice: false,
        },
      })
    );
    navigate("/widget");
  };
  return (
    <div className="widget" onClick={handleWidgetClick}>
      <WidgetName name={widgetState.widget_label} />
      <WidgetState
        state={widgetState.widget_state}
        type={widgetState.widget_type}
      />
    </div>
  );
};

export default Widget;
