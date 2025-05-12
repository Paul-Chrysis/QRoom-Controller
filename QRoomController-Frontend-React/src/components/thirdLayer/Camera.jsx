import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchDeviceIds,
  selectdevice,
} from "../../features/fetchDeviceIds/fetchDeviceIdsSlice";
import { useNavigate } from "react-router-dom";
import Spinner from "../ui/Spinner";
import Card from "../ui/Card";

const Camera = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const deviceIds = useSelector((state) => state.ids.ids);
  const [loader, setloader] = useState(true);
  const [scanningStatus, setScanningStatus] = useState("Initializing camera...");
  
  useLayoutEffect(() => {
    dispatch(fetchDeviceIds(token));
  }, []);
  
  useEffect(() => {
    if (deviceIds.length !== 0) {
      let selectedDeviceId;
      const codeReader = new ZXing.BrowserMultiFormatReader();
      
      setScanningStatus("Accessing camera...");
      
      codeReader
        .listVideoInputDevices()
        .then((videoInputDevices) => {
          setloader(false);
          setScanningStatus("Camera ready. Point at a QR code.");
          
          selectedDeviceId = videoInputDevices[1].deviceId;
          codeReader.decodeFromVideoDevice(
            selectedDeviceId,
            "video",
            (result, err) => {
              if (result) {
                if (deviceIds.includes(result.text)) {
                  setScanningStatus("QR code detected! Connecting to device...");
                  codeReader.reset();
                  dispatch(selectdevice(result.text));
                  navigate("/device");
                } else {
                  setScanningStatus("Unknown QR code. Please try a valid device code.");
                }
              }
              if (err && !(err instanceof ZXing.NotFoundException)) {
                console.error(err);
                setScanningStatus("Error: " + err);
                document.getElementById("result").textContent = err;
              }
            }
          );
        })
        .catch((err) => {
          console.error(err);
          setScanningStatus("Error accessing camera: " + err);
        });
    }
  }, [deviceIds]);

  return (
    <Card className="max-w-3xl mx-auto shadow-soft">
      <Card.Header>
        <h1 className="text-3xl font-bold text-center text-primary-800">
          Scan Device QR Code
        </h1>
        <p className="text-gray-600 text-center mt-2">
          Point your camera at the QR code on your smart device
        </p>
      </Card.Header>
      
      <Card.Body className="py-6">
        <div className="relative rounded-lg overflow-hidden border-4 border-primary-100 shadow-inner bg-black">
          <video
            id="video"
            className="w-full h-auto max-h-[60vh] mx-auto"
          ></video>
          
          {loader && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
              <Spinner size="lg" color="primary" className="mb-4" />
              <p className="text-white text-lg">{scanningStatus}</p>
            </div>
          )}
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full border-4 border-primary-400 border-opacity-50 rounded-lg"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-primary-500 rounded-lg"></div>
          </div>
        </div>
        
        <div className="mt-4 text-center text-gray-700">
          <p className="text-sm">{scanningStatus}</p>
          <p id="result" className="text-red-500 text-sm mt-2"></p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Camera;
