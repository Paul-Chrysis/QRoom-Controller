const Command = ({ type, gType }) => {
  if (type === "on/off") {
    switch (gType) {
      case "Open_Palm":
        return <p>Open</p>;
      case "Closed_Fist":
        return <p>Close</p>;
      case "Thumb_Up":
        return <p>Ok</p>;
      case "Thumb_Down":
        return <p>Discart</p>;
      default:
        return <p>?</p>;
    }
  } else {
    switch (gType) {
      case "Open_Palm":
        return <p>Open</p>;
      case "Closed_Fist":
        return <p>Close</p>;
      case "Thumb_Up":
        return <p>Ok</p>;
      case "Thumb_Down":
        return <p>Discart</p>;
      default:
        return <p>?</p>;
    }
  }
};

export default Command;
