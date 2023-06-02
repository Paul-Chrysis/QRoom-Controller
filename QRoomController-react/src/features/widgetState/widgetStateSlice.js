import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedWidget: {
    widget_label: "",
    widget_isAdminOnly: false,
    widget_type: "",
    widget_state: null,
    isDevice: false,
  },
  gesture: {
    gesture: "none",
    confidence: 0,
  },
};

const widgetStateSlice = createSlice({
  name: "widget",
  initialState,
  reducers: {
    selectWidget: (state, action) => {
      state.selectedWidget = action.payload.widget;
    },
    changeWidgetState: (state, action) => {
      state.selectedWidget.widget_state = action.payload.state;
    },
    updateLastGesure: (state, action) => {
      state.gesture = action.payload.gesture;
    },
  },
});

export default widgetStateSlice.reducer;
export const { selectWidget, changeWidgetState, updateLastGesure } =
  widgetStateSlice.actions;
