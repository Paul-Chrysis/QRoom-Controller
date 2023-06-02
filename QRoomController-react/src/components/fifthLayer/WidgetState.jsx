const WidgetState = ({ state, type }) => {
  return type === "on/off" ? (
    <div className="onOffSwitch">
      <div className="switchWrapper">
        <label className="switch">
          <input type="checkbox" checked={state} readOnly></input>
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  ) : (
    <>
      <div className="progress">
        <div
          className="progress-bar"
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
