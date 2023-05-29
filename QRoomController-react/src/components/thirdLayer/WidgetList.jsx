import Widget from "../fourthLayer/Widget";
import OnOffWidget from "../fourthLayer/OnOffWidget";

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

const WidgetList = ({ widgets, adminOnly, isActive }) => {
  return widgets.length <= 1 ? (
    <div>No Widget to see</div>
  ) : (
    <>
      <OnOffWidget isActive={isActive} />
      {widgets.map((widget) => (
        <Widget key={widget.widget_label} widgetState={widget} />
      ))}
    </>
  );
};

export default WidgetList;
