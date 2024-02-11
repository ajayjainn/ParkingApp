const express = require("express");
const router = new express.Router();
const status = require("../utils/status");
const URL = "https://ap-south-1.aws.neurelo.com";
const apiKey = process.env.NEURELO_APIKEY;

const headers = {
  "Content-Type": "application/json",
  "X-API-KEY": apiKey,
  "X-QUERY-VIZ": "",
};

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371;

  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function extractIdAndCoordinates(data) {
  const ret = [];
  data.forEach((item) => {
    const coordinates = JSON.parse(item.coordinates);
    ret.push({ id: item.id, x: coordinates.x, y: coordinates.y  , cost : item.basePrice , total_spaces : item.total_spaces});
  });
  return ret;
}


router.get("/nearby", async (req, res) => {

  const headers = {
    "X-API-KEY": apiKey,
    "X-QUERY-VIZ": "",
    "X-SELECT-STRATEGY": "",
  };
  

  const resp = await fetch(`${URL}/rest/ParkingLot`, {
    method: "GET",
    headers: headers,
  });
  const data = await resp.json();
  const parkingSpots = data.data;
  const parkingCoordinates = extractIdAndCoordinates(parkingSpots);

  let newArray = parkingCoordinates.map((parkingLot) => {
    return {
      id: parkingLot.id,
      dist: getDistanceFromLatLonInKm(
        parkingLot.x,
        parkingLot.y,
        req.query.x,
        req.query.y
      ),
      cost : parkingLot.cost ,
      total_spaces : parkingLot.total_spaces
    };
  });
 
  newArray.sort((a, b) => a.dist - b.dist);
  const trimmedArray = newArray.slice(0, 10);

  const promises = trimmedArray.map(async (i) => {
    const available = await status(req.user, i.id, req.query.from, req.query.to);
    if (!available.error) {
      return i;
    }
  });

  const lastArray = await Promise.all(promises);
  console.log(lastArray)
  res.send(lastArray.slice(0, 3));

});

router.get("/nearby/now", async (req, res) => {

  const headers = {
    "X-API-KEY": apiKey,
    "X-QUERY-VIZ": "",
    "X-SELECT-STRATEGY": "",
  };
  

  const resp = await fetch(`${URL}/rest/ParkingLot`, {
    method: "GET",
    headers: headers,
  });
  const data = await resp.json();
  const parkingSpots = data.data;
  const parkingCoordinates = extractIdAndCoordinates(parkingSpots);

  let newArray = parkingCoordinates.map((parkingLot) => {
    return {
      id: parkingLot.id,
      dist: getDistanceFromLatLonInKm(
        parkingLot.x,
        parkingLot.y,
        req.query.x,
        req.query.y
      ),
      cost : parkingLot.cost
    };
  });
 
  newArray.sort((a, b) => a.dist - b.dist);
  const trimmedArray = newArray.slice(0, 10);
  let a  = 0 ;
  const promises = trimmedArray.map(async (i) => {
    a++ ;
    const available = await fetch("http://localhost:5000/car_lot",{
      method:"POST",
      body:{
        curr_time: req.query.from,
        number: a%3 ,
        total_spaces: i.total_spaces,

      }
    })
  });

  const lastArray = await Promise.all(promises);
  console.log(lastArray)
  res.send(lastArray.slice(0, 3));

});
router.get("/", async (req, res) => {

  const queryParams = new URLSearchParams();
  const filter = {
    owner: req.user.id,
  };

  queryParams.append("filter", JSON.stringify(filter));
  const resp = await fetch(`${URL}/rest/Booking?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
      "X-QUERY-VIZ": "",
    },
  });
  const data = await resp.json();
 
  res.send(data.data);

});

router.post('/create',async (req,res)=>{

  const ParkingLotGRes = await fetch(`${URL}/rest/ParkingLot/${req.body.parkingLot}`, {
    method: "GET",
    headers
  });

  const parkingData = await ParkingLotGRes.json();
  
  
  const bookingBody = {
        ...req.body,
        bookingPrice: parkingData.data.basePrice,
        owner: req.user.id
      }
    

  const resp = await fetch(`${URL}/rest/Booking/__one`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(bookingBody),
  });
  const data = await resp.json();
  const booking = data.data;

  const UserPatch = { bookings: req.user.bookings.concat(booking.id) };
  await fetch(`${URL}/rest/User/`, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(UserPatch),
  });

  const ParkingLotPatch = {
    bookings: parkingData.data.bookings.concat(booking.id),
  };
  await fetch(`${URL}/rest/ParkingLot/${parkingData.data.id}`, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(ParkingLotPatch),
  });
  return res.send(data);
})

module.exports = router;