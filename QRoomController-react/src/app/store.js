import { configureStore } from "@reduxjs/toolkit";
import fetchDeviceReducer from "../features/fetchDevice/fetchDeviceSlice";
import userDetailsReducer from "../features/Userdetails/UserDetailsSlice";
import fetchDeviceIdsReducer from "../features/fetchdeviceids/fetchDeviceIdsSlice";
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
