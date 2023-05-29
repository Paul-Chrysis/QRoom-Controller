import Gesture from "../fourthLayer/Gesture";

const PossibleGestures = ({ type }) => {
  return type === "on/off" ? (
    <div className="PossibleGestures">
      <Gesture type={"on/off"} gType={"openPalm"} />
      <Gesture type={"on/off"} gType={"closedFist"} />
      <Gesture type={"on/off"} gType={"thumbsUp"} />
      <Gesture type={"on/off"} gType={"thumbsDown"} />
    </div>
  ) : (
    <div className="PossibleGestures">
      <Gesture type={"bar"} gType={"openPalm"} />
      <Gesture type={"bar"} gType={"closedFist"} />
      <Gesture type={"bar"} gType={"thumbsUp"} />
      <Gesture type={"bar"} gType={"thumbsDown"} />
    </div>
  );
};

export default PossibleGestures;
