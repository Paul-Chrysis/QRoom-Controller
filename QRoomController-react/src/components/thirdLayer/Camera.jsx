import { useEffect, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchDeviceIds,
  selectdevice,
} from "../../features/fetchdeviceids/fetchDeviceIdsSlice";

import { useNavigate } from "react-router-dom";

const Camera = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const deviceIds = useSelector((state) => state.ids.ids);

  useLayoutEffect(() => {
    dispatch(fetchDeviceIds(token));
  }, []);
  useEffect(() => {
    console.log(deviceIds.length !== 0);
    if (deviceIds.length !== 0) {
      let selectedDeviceId;
      const codeReader = new ZXing.BrowserMultiFormatReader();
      codeReader
        .listVideoInputDevices()
        .then((videoInputDevices) => {
          selectedDeviceId = videoInputDevices[0].deviceId;
          codeReader.decodeFromVideoDevice(
            selectedDeviceId,
            "video",
            (result, err) => {
              if (result) {
                console.log(result.text);
                if (deviceIds.includes(result.text)) {
                  console.log("inside");
                  codeReader.reset();
                  dispatch(selectdevice(result.text));
                  navigate("/device");
                }
              }
              if (err && !(err instanceof ZXing.NotFoundException)) {
                console.error(err);
                document.getElementById("result").textContent = err;
              }
            }
          );
          console.log(
            `Started continous decode from camera with id ${selectedDeviceId}`
          );
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [deviceIds]);

  return (
    <>
      <section className="container" id="demo-content">
        <p>
          Scan QR code of the device <br /> you want to control
        </p>

        <div>
          <video id="video" width="300" height="200"></video>
        </div>
      </section>
    </>
  );
};

export default Camera;
