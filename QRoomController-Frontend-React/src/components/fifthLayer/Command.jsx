const Command = ({ type, gType }) => {
  if (type === "on/off") {
    switch (gType) {
      case "Open_Palm":
        return <p>Open</p>;
      case "Closed_Fist":
        return <p>Close</p>;
      default:
        return <p>?</p>;
    }
  } else {
    switch (gType) {
      case "Open_Palm":
        return <p>100%</p>;
      case "Closed_Fist":
        return <p>0%</p>;
      case "Thumb_Up":
        return <p>Increase</p>;
      case "Thumb_Down":
        return <p>Decrease</p>;
      case "Pointing_Up":
        return <p>Change value</p>;
      default:
        return <p>?</p>;
    }
  }
};

export default Command;
