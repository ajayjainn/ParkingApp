const express = require("express");
const router = new express.Router();

const URL = "https://ap-south-1.aws.neurelo.com";
const apiKey = process.env.NEURELO_APIKEY;
const headers = {
  "Content-Type": "application/json",
  "X-API-KEY": apiKey,
  "X-QUERY-VIZ": "",
};

router.get("/create", async (req, res) => {
  const resp = await fetch(`${URL}/rest/ParkingLot`, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(req.body),
  });
  console.log(resp);
  res.send({ message: resp.statusText });
});

module.exports = router;
