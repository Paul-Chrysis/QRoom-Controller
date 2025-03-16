import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

const initialState = {
  loading: false,
  ids: [],
  selectedDevice: null,
  error: "",
};

const DEVICES_URL = "/api/v1/device/devices";

export const fetchDeviceIds = createAsyncThunk(
  "ids/fetchDeviceIds",
  (token) => {
    return axios
      .get(DEVICES_URL, {
        headers: { Authorization: token },
        withCredentials: true,
      })
      .then((response) => {
        let devices = JSON.stringify(response.data)
          .replaceAll("\\", "")
          .replaceAll("]", "")
          .replaceAll("[", "")
          .replaceAll('"{"_id": {"$oid": ', "")
          .replaceAll('}}"', "")
          .replaceAll('"', "")
          .split(",");
        return devices;
      });
  }
);

const deviceSlice = createSlice({
  name: "ids",
  initialState,
  reducers: {
    selectdevice: (state, action) => {
      state.selectedDevice = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDeviceIds.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchDeviceIds.fulfilled, (state, action) => {
      state.loading = false;
      state.ids = action.payload;
      state.error = "";
    });
    builder.addCase(fetchDeviceIds.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default deviceSlice.reducer;
export const { selectdevice } = deviceSlice.actions;
