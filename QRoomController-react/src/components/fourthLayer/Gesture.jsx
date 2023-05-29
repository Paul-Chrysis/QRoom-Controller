import Icon from "../fifthLayer/Icon";
import Command from "../fifthLayer/Command";

const Gesture = ({ type, gType }) => {
  return (
    <div className="PossibleGesture">
      <Icon gType={gType} />
      <Command type={type} gType={gType} />
    </div>
  );
};

export default Gesture;
