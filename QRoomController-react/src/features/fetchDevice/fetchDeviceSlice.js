import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

const initialState = {
  loading: false,
  device: {
    id: "",
    deviceType: "",
    adminOnly: false,
    device_isActive: false,
    device_widgets: [],
  },
  error: "",
};

export const fetchDevice = createAsyncThunk("device/fetchDevice", (payload) => {
  const DEVICE_URL = `/api/v1/device/${payload.id}`;
  return axios
    .get(DEVICE_URL, {
      headers: { Authorization: payload.token },
      withCredentials: true,
    })
    .then((response) => {
      console.log(response.data.deviceType);
      return response.data;
    });
});

const fetchDeviceSlice = createSlice({
  name: "device",
  initialState,
  reducers: {
    changeDeviceState: (state) => {
      state.device.device_isActive = !state.device.device_isActive;
    },
    changeState: (state, action) => {
      const widgetToUpdate = state.device.device_widgets.findIndex(
        (widget) => widget.widget_label === action.payload.label
      );
      state.device.device_widgets[widgetToUpdate].widget_state =
        action.payload.state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDevice.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDevice.fulfilled, (state, action) => {
      state.loading = false;
      state.device.id = action.payload.objectId;
      state.device.deviceType = action.payload.deviceType;
      state.device.adminOnly = action.payload.state.adminOnly;
      state.device.device_isActive = action.payload.state.device_isActive;
      state.device.device_widgets = action.payload.state.device_widgets;
      console.log(action);
      state.error = "";
    });
    builder.addCase(fetchDevice.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default fetchDeviceSlice.reducer;
export const { changeDeviceState, changeState } = fetchDeviceSlice.actions;
