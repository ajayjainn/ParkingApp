import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token")
const user = JSON.parse(localStorage.getItem("user"))

const initialState = {
  user,
  token
}
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers:{
    login: (state, action) => {
      localStorage.setItem("token", action.payload.token),
      localStorage.setItem("user", JSON.stringify(action.payload.user)),
      state.user = action.payload.user
      state.token = action.payload.token
    },
    logout: (state) => {
      localStorage.removeItem("token"),
      state.user = null
      state.token = null
    }
  }
})


export default authSlice.reducer
export const {login, logout} = authSlice.actions

