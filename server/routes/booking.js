const express = require("express");
const router = new express.Router();
const mongoose = require("mongoose");
const URL = "https://ap-south-1.aws.neurelo.com";
const apiKey = process.env.NEURELO_APIKEY;
const headers = {
  "Content-Type": "application/json",
  "X-API-KEY": apiKey,
  "X-QUERY-VIZ": "",
};
router.get("/", async (req, res) => {
  const queryParams = new URLSearchParams();
  const filter = {
    owner: req.user.id,
  };
  queryParams.append("filter", JSON.stringify(filter));
  const resp = await fetch(`${URL}/rest/Booking?${queryParams.toString()}`, {
    method: "GET",
    headers: headers,
  });
  const data = await resp.json();
  console.log(data);
  res.send(data);
});
router.post("/create", async (req, res) => {
  const requestBody1 = { ...req.body, owner: req.user.id };
  console.log(requestBody1);
  const resp = await fetch(`${URL}/rest/Booking/__one`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody1),
  });
  const data = await resp.json();
  const booking = data.data;
  console.log(data);
  const requestBody2 = { bookings: req.user.bookings.concat(booking.id) };
  const resp2 = await fetch(`${URL}/rest/User/`, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(requestBody2),
  });
  console.log(resp, resp2);
  //res.send(req.user);
});

module.exports = router;
