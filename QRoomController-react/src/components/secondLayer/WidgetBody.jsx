// import CurrentWidget from "../thirdLayer/CurrentWidget";
// import CurrentWidgetState from "../thirdLayer/CurrentWidget";
import CameraG from "../thirdLayer/cameraG/CameraG.jsx";
import PossibleGestures from "../thirdLayer/PossibleGestures";
import DeviceName from "../thirdLayer/DeviceName.jsx";
import WidgetName from "../fifthLayer/WidgetName";
import WidgetState from "../fifthLayer/WidgetState.jsx";
import GestureFeedback from "../fourthLayer/GestureFeedback.jsx";
const widget = {
  widget_isAdminOnly: false,
  widget_label: "intencity",
  widget_state: 50,
  widget_type: "bar",
};

function WidgetBody() {
  return (
    <>
      <section className="auth-form">
        {/* <CurrentWidget /> */}
        <DeviceName name={widget.widget_label} />
        <div className="cameraContainer">
          <CameraG />
          <div className="gestureFeedback">
            <GestureFeedback gesture="openPalm" confidence="75%" />
          </div>
        </div>
        <PossibleGestures type={widget.widget_type} />
        <WidgetState state={widget.widget_state} type={widget.widget_type} />
      </section>
    </>
  );
}

export default WidgetBody;
