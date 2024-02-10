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
      query: (x, y) => `nearby?x=${x}&y=${y}`,
    })
  })
})

export const { useGetUserBookingsQuery, useCreateBookingMutation, useFetchNearbyParkingSpotsQuery } = bookingApiSlice