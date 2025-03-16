import { useSelector } from "react-redux";
import { ToggleSwitch, Progress } from "flowbite-react";
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
      <>
        <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 my-4 h-6">
          <div
            className="bg-gradient-to-r from-teal-400 to-teal-600 h-6 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full flex justify-center items-center"
            style={{ width: `${state}%` }}
          >
            {state}%
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 my-4 h-6">
          <div
            className="bg-gradient-to-r from-teal-400 to-teal-600 h-6 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full flex justify-center items-center"
            style={{
              width:
                ((state + 3 - range.min) / (range.max + 3 - range.min)) * 100 +
                "%",
            }}
          >
            {state + "°"}
          </div>
        </div>
      </>
    );
  }
};

export default WidgetState;
