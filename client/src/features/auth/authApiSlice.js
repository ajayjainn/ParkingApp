import { baseApiSlice } from "../api/baseApiSlice";

export const authApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (build)=>({
    registerUser: build.mutation({
      query: userData => ({
        url: 'auth/signup',
        method: 'POST',
        body: userData
      })
    }),
    loginUser: build.mutation({
      query: userData => ({
        url: 'auth/login',
        method: 'POST',
        body: userData
      })
    }),
  }),
})

export const {useLoginUserMutation,useRegisterUserMutation} = authApiSlice