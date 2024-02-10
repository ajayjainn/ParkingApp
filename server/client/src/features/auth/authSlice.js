import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token")
const user = token ? jwtDecode(token) : null

const initialState = {
  user,
  token
}
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers:{
    login: (state, action) => {
      localStorage.setItem("token", action.payload),
      state.user = jwtDecode(action.payload),
      state.token = action.payload
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

