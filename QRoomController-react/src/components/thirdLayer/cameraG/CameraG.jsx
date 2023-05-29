import {
  GestureRecognizer,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
// import GestureFeedback from "../fourthLayer/GestureFeedback";

function CameraG() {
  const webcamref = useRef(null);
  const canvasref = useRef(null);

  const [gestureRecognizer, setGestureRecognizer] = useState(null);

  var int;
  var run = true;

  const gestureInterval = () => {
    let nowInMs = Date.now();
    const results = gestureRecognizer.recognizeForVideo(
      webcamref.current.video,
      nowInMs
    );

    const canvasCtx = canvasref.current.getContext("2d");
    canvasCtx.save();
    canvasCtx.clearRect(
      0,
      0,
      canvasref.current.width,
      canvasref.current.height
    );

    const videoWidth = webcamref.current.video.videoWidth;
    const videoHeight = webcamref.current.video.videoHeight;

    // Set video width
    webcamref.current.video.width = videoWidth;
    webcamref.current.video.height = videoHeight;

    // Set canvas height and width
    canvasref.current.width = videoWidth;
    canvasref.current.height = videoHeight;

    // Draw the results on the canvas, if any.
    if (results.landmarks) {
      for (const landmarks of results.landmarks) {
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5,
        });

        drawLandmarks(canvasCtx, landmarks, {
          color: "#FF0000",
          lineWidth: 2,
        });
      }
    }
    console.log(
      results.gestures[0][0].score + " " + results.gestures[0][0].categoryName
    );
  };

  useEffect(() => {
    async function loadGestureRecognizer() {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      const recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
        },
        numHands: 1,
        runningMode: "video",
      });
      console.log("recognizer =");
      console.log(recognizer);
      setGestureRecognizer(recognizer);
    }
    loadGestureRecognizer();
  }, []);

  const start = () => {
    console.log(run);
    if (!run) {
      int = setInterval(gestureInterval, 100);
    } else {
      clearInterval(int);
      const canvasCtx = canvasref.current.getContext("2d");
      canvasCtx.save();
      canvasCtx.clearRect(
        0,
        0,
        canvasref.current.width,
        canvasref.current.height
      );
    }
  };

  const startstop = () => {
    console.log(run);
    run = !run;
    start();
  };
  return (
    <section className="camera-sec">
      <div>
        <Webcam
          ref={webcamref}
          style={{
            position: "relative",
            marginRight: "auto",
            marginLeft: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
          }}
        />
        <canvas
          ref={canvasref}
          style={{
            position: "absolute",
            marginRight: "auto",
            marginLeft: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 9,
          }}
        ></canvas>
      </div>
      <button style={{ position: "absolute", top: 0 }} onClick={startstop}>
        {" "}
        start{" "}
      </button>
      {/* <GestureFeedback /> */}
    </section>
  );
}

export default CameraG;
