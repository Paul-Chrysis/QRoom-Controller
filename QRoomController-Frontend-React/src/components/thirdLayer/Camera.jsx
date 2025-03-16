import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchDeviceIds,
  selectdevice,
} from "../../features/fetchDeviceIds/fetchDeviceIdsSlice";

import { useNavigate } from "react-router-dom";
import { Spinner } from "flowbite-react";

const Camera = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const deviceIds = useSelector((state) => state.ids.ids);
  const [loader, setloader] = useState(true);
  useLayoutEffect(() => {
    dispatch(fetchDeviceIds(token));
  }, []);
  useEffect(() => {
    if (deviceIds.length !== 0) {
      let selectedDeviceId;
      const codeReader = new ZXing.BrowserMultiFormatReader();
      codeReader
        .listVideoInputDevices()
        .then((videoInputDevices) => {
          setloader(false);
          selectedDeviceId = videoInputDevices[0].deviceId;
          codeReader.decodeFromVideoDevice(
            selectedDeviceId,
            "video",
            (result, err) => {
              if (result) {
                if (deviceIds.includes(result.text)) {
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
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [deviceIds]);

  return (
    <>
      <section
        className="container mx-auto flex flex-col justify-center items-center "
        id="demo-content"
      >
        <h1 className="text-3xl font-bold text-center">
          Scan QR code of the device you want to control
        </h1>

        <div className="w-full mx-auto">
          <video
            id="video"
            className="w-auto h-auto justify-center items-center"
          >
            {loader ? "" : <Spinner></Spinner>}
          </video>
        </div>
      </section>
    </>
  );
};

export default Camera;
