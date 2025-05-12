import { useSelector } from "react-redux";
import ToggleSwitch from "../ui/ToggleSwitch";
import Progress from "../ui/Progress";
const WidgetState = ({ state, type }) => {
  const range = useSelector(
    (state) => state.widget.selectedWidget.widget_range
  );
  if (type === "on/off") {
    return (
      <div className="p-3 gap-2 flex justify-center flex-col">
        <div className="flex flex-row justify-center content-center">
          <ToggleSwitch sizing="md" color="teal" checked={state} readOnly />
        </div>
      </div>
    );
  } else if (type === "bar") {
    return (
      <div className="p-4">
        <Progress 
          progress={state} 
          color="teal" 
          size="md" 
          label={true} 
          labelPosition="inside"
          className="my-2"
        />
      </div>
    );
  } else {
    const progressPercentage = ((state + 3 - range.min) / (range.max + 3 - range.min)) * 100;
    
    return (
      <div className="p-4">
        <Progress 
          progress={progressPercentage} 
          color="teal" 
          size="md" 
          label={true} 
          labelPosition="inside"
          labelText={`${state}°`}
          className="my-2"
        />
      </div>
    );
  }
};

export default WidgetState;
