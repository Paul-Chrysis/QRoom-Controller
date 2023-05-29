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
    case "openPalm":
      return <FontAwesomeIcon icon={faHand} />;
    case "closedFist":
      return <FontAwesomeIcon icon={faHandFist} />;
    case "thumbsUp":
      return <FontAwesomeIcon icon={faThumbsUp} />;
    case "thumbsDown":
      return <FontAwesomeIcon icon={faThumbsDown} />;
    case "peace":
      return <FontAwesomeIcon icon={faHandPeace} />;
    case "pointUp":
      return <FontAwesomeIcon icon={faHandPointUp} />;
    default:
      return <FontAwesomeIcon icon={faQuestion} />;
  }
};

export default Icon;
