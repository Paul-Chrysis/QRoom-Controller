import RecognisedGesture from "../fifthLayer/RecognisedGesture";
import Confidence from "../fifthLayer/Confidence";

const GestureFeedback = ({ gesture, confidence }) => {
  return (
    <>
      <RecognisedGesture gesture={gesture} />
      <Confidence confidence={confidence} />
    </>
  );
};

export default GestureFeedback;
