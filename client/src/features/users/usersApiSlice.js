import { baseApiSlice } from "../api/baseApiSlice";

export const usersApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (build)=>({
  }),
})

export const {useGetUserProfileQuery} = usersApiSlice