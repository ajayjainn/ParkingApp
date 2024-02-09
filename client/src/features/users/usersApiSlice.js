import { baseApiSlice } from "../api/baseApiSlice";

export const usersApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (build)=>({
    getUserProfile: build.query({
      query: () => `/users/profile`,
    }),
  }),
})

export const {useGetUserProfileQuery} = usersApiSlice