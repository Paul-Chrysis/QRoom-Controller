import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: "",
  role: "",
};

const userDetailsSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

export default userDetailsSlice.reducer;
export const { updateToken } = userDetailsSlice.actions;
