const URL = "https://ap-south-1.aws.neurelo.com";
const apiKey = process.env.NEURELO_APIKEY;
const headers = {
  "Content-Type": "application/json",
  "X-API-KEY": apiKey,
  "X-QUERY-VIZ": "",
};

const status = async (user, parkingLot, from, to) => {
  const ParkingLotGRes = await fetch(`${URL}/rest/ParkingLot/${parkingLot}`, {
    method: "GET",
    headers
  });
  const parkingData = await ParkingLotGRes.json();
  const bookings = parkingData.data.bookings;

  const toKeep = [];
  const minus = 0;

  bookings.map(async (booking) => {
    const request = await fetch(`${URL}/rest/Booking/`, {
      method: "GET",
      headers
    });
    const bookingData = await request.json();

    if (new Date(bookingData.data.to) > Date.now()) {
      toKeep.push(booking);
    }
    if (
      new Date(bookingData.data.to) > new Date(from) &&
      new Date(bookingData.data.from) < new Date(to)
    ) {
      minus++;
    }
  });
  if (parkingData.data.totalSpace - minus <= 0) {
    return { error: "No available space" };
  }
  
  return { message: "Booking Added" };
};

module.exports = status;