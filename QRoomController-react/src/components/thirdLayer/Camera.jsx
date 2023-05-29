import { useEffect, useLayoutEffect, useState } from "react";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Camera = () => {
  const [deviceIds, setdeviceIds] = useState([]);
  const navigate = useNavigate();

  const DEVICE_URL = "/api/v1/device/devices";
  const { auth } = useAuth();

  const fetchDevices = async () => {
    const token = "Bearer " + auth.token;
    try {
      const response = await axios.get(DEVICE_URL, {
        headers: { Authorization: token },
        withCredentials: true,
      });
      let devices = JSON.stringify(response.data)
        .replaceAll("\\", "")
        .replaceAll("]", "")
        .replaceAll("[", "")
        .replaceAll('"{"_id": {"$oid": ', "")
        .replaceAll('}}"', "")
        .replaceAll('"', "")
        .split(",");
      setdeviceIds(devices);
      console.log("ton ipies");
    } catch (err) {
      console.log(err);
    }
  };

  useLayoutEffect(() => {
    console.log("start!!!!!!!!!!");
    fetchDevices();
  }, []);

  useEffect(() => {
    let selectedDeviceId;
    const codeReader = new ZXing.BrowserMultiFormatReader();
    console.log("ZXing code reader initialized");
    console.log(deviceIds);
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
              console.log(deviceIds);
              if (deviceIds.includes(result.text)) {
                navigate("/device", { state: result.text });
                return;
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
    return;
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

        <label>Result:</label>
        <pre>
          <code id="result"></code>
        </pre>
      </section>
    </>
  );
};

export default Camera;
