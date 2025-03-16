import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  token: "",
  role: "",
};

const userDetailsSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
    updateUserName: (state, action) => {
      state.name = action.payload;
    },
  },
});

export default userDetailsSlice.reducer;
export const { updateUser, updateUserName } = userDetailsSlice.actions;
