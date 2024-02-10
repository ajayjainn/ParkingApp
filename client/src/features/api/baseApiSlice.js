import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3007/',
    creadentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
      if (token) {
        console.log(token, 'ddd')
        headers.set('authorization', `Bearer ${token}`)
      }
      console.log(headers)
      return headers
    },
  }),
  endpoints: () => ({}),
})



