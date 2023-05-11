import CurrentWidget from "../thirdLayer/CurrentWidget";
import Camera from "../thirdLayer/Camera";
import PossibleGestures from "../thirdLayer/PossibleGestures";
import CurrentWidgetState from "../thirdLayer/CurrentWidgetState";

function WidgetBody() {
  return (
    <>
      <CurrentWidget />
      <Camera />
      <PossibleGestures />
      <CurrentWidgetState />
    </>
  );
}

export default WidgetBody;
