import {
  faQuestion,
  faThumbsUp,
  faThumbsDown,
  faHandPeace,
  faHand,
  faHandPointUp,
  faHandFist,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Icon = ({ gType }) => {
  switch (gType) {
    case "Open_Palm":
      return <FontAwesomeIcon icon={faHand} />;
    case "Closed_Fist":
      return <FontAwesomeIcon icon={faHandFist} />;
    case "Thumb_Up":
      return <FontAwesomeIcon icon={faThumbsUp} />;
    case "Thumb_Down":
      return <FontAwesomeIcon icon={faThumbsDown} />;
    case "Victory":
      return <FontAwesomeIcon icon={faHandPeace} />;
    case "Pointing_Up":
      return <FontAwesomeIcon icon={faHandPointUp} />;
    default:
      return <FontAwesomeIcon icon={faQuestion} />;
  }
};

export default Icon;
