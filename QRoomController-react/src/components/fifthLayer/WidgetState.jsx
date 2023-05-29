import { ToggleButtonGroup } from "react-bootstrap";
import ToggleButton from "react-bootstrap/ToggleButton";
import ProgressBar from "react-bootstrap/ProgressBar";

const WidgetState = ({ state, type }) => {
  return type === "on/off" ? (
    <div className="onOffSwitch">
      <div className="switchWrapper">
        <label class="switch">
          <input type="checkbox"></input>
          <span class="slider round"></span>
        </label>
      </div>
    </div>
  ) : (
    <>
      <div class="progress">
        <div
          class="progress-bar"
          role="progressbar"
          style={{ width: state + "%" }}
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {state ? state + "%" : ""}
        </div>
      </div>
    </>
  );
};

export default WidgetState;

{
  /* // <ToggleButtonGroup type="radio" name="options" defaultValue={state}>
// <ToggleButton id="tbg-radio-1" value={true} disabled={true}>
//   On
// </ToggleButton>
// <ToggleButton id="tbg-radio-2" value={false} disabled={true}>
//   Off
// </ToggleButton>
// </ToggleButtonGroup> */
}
{
  /* <ProgressBar visuallyHidden={true} now={state} label={`${state}%`} /> */
}
