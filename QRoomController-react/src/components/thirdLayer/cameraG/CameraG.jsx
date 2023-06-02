import {
  GestureRecognizer,
  FilesetResolver,
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision";
import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import axios from "../../../api/axios";
import store from "../../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { updateLastGesure } from "../../../features/widgetState/widgetStateSlice";
import { changeWidgetState } from "../../../features/widgetState/widgetStateSlice";
import {
  changeDeviceState,
  changeState,
} from "../../../features/fetchDevice/fetchDeviceSlice";

function CameraG() {
  const deviceId = useSelector((state) => state.device.device.id);
  const token = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const webcamref = useRef(null);
  const URL = `/api/v1/device/${deviceId}`;
  const [gestureRecognizer, setGestureRecognizer] = useState(null);

  const VALID_GESTURES = {
    onoff: ["Open_Palm", "Closed_Fist"],
    bar: ["Open_Palm", "Closed_Fist", "Thumb_Up", "Thumb_Down", "Pointing_Up"],
  };
  var int;
  var run = true;

  const putWidget = async (selectedWidget, newState) => {
    console.log(newState);
    console.log(
      JSON.stringify({
        widget_label: selectedWidget.widget_label,
        widget_isAdminOnly: selectedWidget.widget_isAdminOnly,
        widget_type: selectedWidget.widget_type,
        widget_state: newState,
      })
    );
    try {
      const response = await axios
        .put(
          URL,
          JSON.stringify({
            widget_label: selectedWidget.widget_label,
            widget_isAdminOnly: selectedWidget.widget_isAdminOnly,
            widget_type: selectedWidget.widget_type,
            widget_state: newState,
          }),
          {
            headers: {
              Authorization: token,
              "content-type": "application/json",
            },
            withCredentials: true,
          }
        )
        .then(() => {
          dispatch(
            changeWidgetState({
              state: newState,
            })
          );
          dispatch(
            changeState({
              label: selectedWidget.widget_label,
              state: newState,
            })
          );
        });
    } catch (err) {
      console.log(err);
      if (!err?.response) {
        console.log("No Server Response");
      } else if (err.response?.status === 400) {
        console.log("Missing username or password");
      } else if (err.response?.status === 403) {
        console.log("Account does not exist");
      } else if (err.response?.status === 401) {
        console.log("Anauthorized");
      } else {
        console.log("Login Failed");
      }
    }
  };

  const gestureInterval = async () => {
    const selectedWidget = store.getState().widget.selectedWidget;
    let nowInMs = Date.now();
    const results = gestureRecognizer.recognizeForVideo(
      webcamref.current.video,
      nowInMs
    );
    if (results.gestures.length !== 0) {
      // check if this is a valid gesture
      if (selectedWidget.widget_type === "on/off") {
        if (
          VALID_GESTURES.onoff.includes(results.gestures[0][0].categoryName)
        ) {
          if (
            (results.gestures[0][0].categoryName === "Open_Palm" &&
              !selectedWidget.widget_state) ||
            (results.gestures[0][0].categoryName === "Closed_Fist" &&
              selectedWidget.widget_state)
          ) {
            if (selectedWidget.isDevice) {
              console.log("sending");
              try {
                const response = await axios
                  .put(
                    URL,
                    {},
                    {
                      headers: {
                        Authorization: token,
                        "content-type": "application/json",
                      },
                      withCredentials: true,
                    }
                  )
                  .then(() => {
                    console.log(!selectedWidget.widget_state);
                    dispatch(changeWidgetState(!selectedWidget.widget_state));
                    dispatch(changeDeviceState());
                  });
                console.log(response);
              } catch (err) {
                console.log(err);
                if (!err?.response) {
                  console.log("No Server Response");
                } else if (err.response?.status === 400) {
                  console.log("Missing username or password");
                } else if (err.response?.status === 403) {
                  console.log("Account does not exist");
                } else if (err.response?.status === 401) {
                  console.log("Anauthorized");
                } else {
                  console.log("Login Failed");
                }
              }
            } else {
              //if widget is onoff type but not the device
              putWidget(selectedWidget, !selectedWidget.widget_state);
            }
          }
        }
      } else {
        if (VALID_GESTURES.bar.includes(results.gestures[0][0].categoryName)) {
          switch (results.gestures[0][0].categoryName) {
            case "Open_Palm":
              putWidget(selectedWidget, 100);
              break;
            case "Closed_Fist":
              putWidget(selectedWidget, 0);
              break;
            case "Thumb_Up": {
              if (selectedWidget.widget_state === 100) {
                return;
              }
              putWidget(selectedWidget, selectedWidget.widget_state + 5);
              break;
            }
            case "Thumb_Down": {
              if (selectedWidget.widget_state === 0) {
                return;
              }
              putWidget(selectedWidget, selectedWidget.widget_state - 5);
              break;
            }
            default:
              break;
          }
        }
      }

      dispatch(
        updateLastGesure({
          gesture: {
            gesture: results.gestures[0][0].categoryName,
            confidence: results.gestures[0][0].score.toPrecision(2),
          },
        })
      );

      // send put request to server
      // what format do i need to send the data?
      // if server responds with OK update widget
      // how to update the store
    }
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
      int = setInterval(gestureInterval, 1000);
    } else {
      clearInterval(int);
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
      </div>
      <button
        style={{ position: "absolute", top: 0, zIndex: 10 }}
        onClick={startstop}
      >
        {" "}
        start{" "}
      </button>
      {/* <GestureFeedback /> */}
    </section>
  );
}

export default CameraG;
