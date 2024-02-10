const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const URL = "https://ap-south-1.aws.neurelo.com";
const apiKey = process.env.NEURELO_APIKEY;
const headers = {
  "X-API-KEY": apiKey,
  "X-QUERY-VIZ": "",
};
function extractCoordinates(parkingLot) {
  const { id, coordinates } = parkingLot;
  const { x, y } = JSON.parse(coordinates);
  return { id, x, y };
}

router.post("/signup", async (req, res) => {
  const url = "https://ap-south-1.aws.neurelo.com" + "/rest/User/__one";
  const { uname, email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 8);
  console.log(hashPassword);
  const requestBody = {
    uname,
    email,
    password: hashPassword,
    balance: 0,
  };
  const resp = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  });
  res.send({ message: resp.statusText });
});

router.get("/nearby", async (req, res) => {
  const headers1 = {
    "X-API-KEY": apiKey,
    "X-QUERY-VIZ": "",
    "X-SELECT-STRATEGY": "",
  };
  const resp = await fetch(`${URL}/rest/ParkingLot`, {
    method: "GET",
    headers: headers1,
  });
  const data = await resp.json();
  const parkingSpots = data.data;
  let newArray = parkingSpots.map((parkingLot) =>
    extractCoordinates(parkingLot)
  );
  console.log(newArray);
  newArray = newArray.concat({ x: 23, y: 78, id: "User" });
  try {
    const url =
      "https://route.arcgis.com/arcgis/rest/services/World/OriginDestinationCostMatrix/NAServer/OriginDestinationCostMatrix_World/solve";

    const requestBody = {
      f: "json",
      token:
        "AAPKcfae0a2aa06142eba3996beda2e801e7AJDhip2daafTRE-PKB-wxdUxpoOAoJ3ymrFwjpx2AHEl3_hynuc-XYsGadlFcdMO",
      origins: JSON.stringify(newArray),
      destinations: JSON.stringify(newArray),
    };
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(requestBody),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const url = "https://ap-south-1.aws.neurelo.com" + "/custom/UserE";
  const queryParams = new URLSearchParams({ email });
  const fullUrl = url + "?" + queryParams.toString();

  const resp = await fetch(fullUrl, {
    headers: headers,
  });
  if (!resp.ok) {
    res.send({ error: "Something went wrong!" });
  }
  const data = await resp.json();
  const user = data.data.cursor.firstBatch[0];
  if (!user) {
    res.send({ error: "Email or Password dosent match" });
  }
  const isValid = await bcrypt.compare(password, user.password);
  if (isValid) {
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    res.send({ user, token });
  }
  res.send({ error: "Email or Password dosent match" });
});

module.exports = router;
