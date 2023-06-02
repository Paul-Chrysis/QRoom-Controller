import Gesture from "../fourthLayer/Gesture";

const PossibleGestures = ({ type }) => {
  return type === "on/off" ? (
    <div className="PossibleGestures">
      <Gesture type={"on/off"} gType={"Open_Palm"} />
      <Gesture type={"on/off"} gType={"Closed_Fist"} />
      <Gesture type={"on/off"} gType={"Thumb_Up"} />
      <Gesture type={"on/off"} gType={"Thumb_Down"} />
    </div>
  ) : (
    <div className="PossibleGestures">
      <Gesture type={"bar"} gType={"Open_Palm"} />
      <Gesture type={"bar"} gType={"Closed_Fist"} />
      <Gesture type={"bar"} gType={"Thumb_Up"} />
      <Gesture type={"bar"} gType={"Thumb_Down"} />
    </div>
  );
};

export default PossibleGestures;
