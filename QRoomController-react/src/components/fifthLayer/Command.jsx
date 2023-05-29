const Command = ({ type, gType }) => {
  if (type === "on/off") {
    switch (gType) {
      case "openPalm":
        return <p>Open</p>;
      case "closedFist":
        return <p>Close</p>;
      case "thumbsUp":
        return <p>Ok</p>;
      case "thumbsDown":
        return <p>Discart</p>;
      default:
        return <p>?</p>;
    }
  } else {
    switch (gType) {
      case "openPalm":
        return <p>Open</p>;
      case "closedFist":
        return <p>Close</p>;
      case "thumbsUp":
        return <p>Ok</p>;
      case "thumbsDown":
        return <p>Discart</p>;
      default:
        return <p>?</p>;
    }
  }
};

export default Command;
