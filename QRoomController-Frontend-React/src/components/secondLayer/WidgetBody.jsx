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
      <section className="container max-w-2xl my-28 bg-slate-300 w-full h-max shadow-inner p-10 items-center">
        {/* <CurrentWidget /> */}
        <DeviceName name={widgetState.widget_label} />
        <div className="relative">
          <CameraG />
          <div className="w-24 text-2xl p-2 flex flex-col gap-3 m-3 justify-center text-center rounded-lg border-2 border-teal-600 text-teal-600 font-semibold absolute top-0 right-0 z-10">
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
