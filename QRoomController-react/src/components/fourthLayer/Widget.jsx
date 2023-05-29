import WidgetName from "../fifthLayer/WidgetName";
import WidgetState from "../fifthLayer/WidgetState";

const Widget = ({ widgetState }) => {
  return (
    <div className="widget">
      <WidgetName name={widgetState.widget_label} />
      <WidgetState
        state={widgetState.widget_state}
        type={widgetState.widget_type}
      />
    </div>
  );
};

export default Widget;
