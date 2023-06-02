import CameraG from "../thirdLayer/cameraG/CameraG.jsx";
import PossibleGestures from "../thirdLayer/PossibleGestures";
import DeviceName from "../thirdLayer/DeviceName.jsx";
import WidgetState from "../fifthLayer/WidgetState.jsx";
import GestureFeedback from "../fourthLayer/GestureFeedback.jsx";
import { useSelector } from "react-redux";

function WidgetBody() {
  const widgetState = useSelector((state) => state.widget.selectedWidget);
  const lastGesture = useSelector((state) => state.widget.gesture);
  return (
    <>
      <section className="auth-form">
        {/* <CurrentWidget /> */}
        <DeviceName name={widgetState.widget_label} />
        <div className="cameraContainer">
          <CameraG />
          <div className="gestureFeedback">
            <GestureFeedback
              gesture={lastGesture.gesture}
              confidence={lastGesture.confidence}
            />
          </div>
        </div>
        <PossibleGestures type={widgetState.widget_type} />
        <WidgetState
          state={widgetState.widget_state}
          type={widgetState.widget_type}
        />
      </section>
    </>
  );
}

export default WidgetBody;
