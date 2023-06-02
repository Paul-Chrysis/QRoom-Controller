import Widget from "../fourthLayer/Widget";
import OnOffWidget from "../fourthLayer/OnOffWidget";

const WidgetList = ({ widgets, adminOnly, isActive }) => {
  return widgets.length <= 0 ? (
    <OnOffWidget isActive={isActive} />
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
