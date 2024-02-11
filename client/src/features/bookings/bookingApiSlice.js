import { baseApiSlice } from "../api/baseApiSlice"

const bookingApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (build) => ({
    getUserBookings: build.query({
      query: () => "booking/",
    }),
    createBooking: build.mutation({
      query: (booking) => ({
        url: "bookings",
        method: "POST",
        body: booking,
      })
    }),
    fetchNearbyParkingSpots: build.query({
      query: ({x, y,from,to}) => `booking/nearby?x=${x}&y=${y}&from=${from}&to=${to}`,
    }),
    fetchCurrentNearbyParkingSpots: build.query({
      query: ({x, y,from,to}) => `booking/nearby/now?x=${x}&y=${y}&from=${from}&to=${to}`
    })
  })
})

export const { useGetUserBookingsQuery, useCreateBookingMutation, useFetchNearbyParkingSpotsQuery ,useFetchCurrentNearbyParkingSpotsQuery} = bookingApiSlice