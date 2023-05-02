window.addEventListener("load", function () {
  let selectedDeviceId;
  const codeReader = new ZXing.BrowserMultiFormatReader();
  console.log("ZXing code reader initialized");
  codeReader
    .listVideoInputDevices()
    .then((videoInputDevices) => {
      const sourceSelect = document.getElementById("sourceSelect");
      selectedDeviceId = videoInputDevices[0].deviceId;
      codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        "video",
        (result, err) => {
          if (result) {
            console.log(result);
            document.getElementById("result").textContent = result.text;
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
});
