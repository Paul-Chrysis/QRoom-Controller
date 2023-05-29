import WidgetName from "../fifthLayer/WidgetName";
import WidgetState from "../fifthLayer/WidgetState";

// const INITIAL_STATE = {
//   deviceType: "lights",
//   adminOnly: false,
//   device_isActive: false,
//   device_widgets: [
//     {
//       widget_isAdminOnly: false,
//       widget_label: "intencity",
//       widget_state: 50,
//       widget_type: "bar",
//     },
//     {
//       widget_isAdminOnly: false,
//       widget_label: "color",
//       widget_state: 0,
//       widget_type: "bar",
//     },
//   ],
// };

const OnOffWidget = ({ isActive }) => {
  // admin only for later
  return (
    <div className="widget">
      <WidgetName name="running" />
      <WidgetState state={isActive} type="on/off" />
    </div>
  );
};

export default OnOffWidget;
