import { configureStore } from "@reduxjs/toolkit";
import fetchDeviceReducer from "../features/fetchDevice/fetchDeviceSlice";
import userDetailsReducer from "../features/Userdetails/userDetailsSlice";
import fetchDeviceIdsReducer from "../features/fetchDeviceIds/fetchDeviceIdsSlice";
import widgetStateReducer from "../features/widgetState/widgetStateSlice";
const store = configureStore({
  reducer: {
    user: userDetailsReducer,
    ids: fetchDeviceIdsReducer,
    device: fetchDeviceReducer,
    widget: widgetStateReducer,
  },
});

export default store;
