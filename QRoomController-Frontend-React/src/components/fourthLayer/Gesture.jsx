import Icon from "../fifthLayer/Icon";
import Command from "../fifthLayer/Command";

const Gesture = ({ type, gType }) => {
  return (
    <div className="flex flex-1 p-1 text-teal-500 flex-col justify-center rounded-md border-2 text-center border-teal-500 bg-slate-50">
      <Icon gType={gType} />
      <Command type={type} gType={gType} />
    </div>
  );
};

export default Gesture;
