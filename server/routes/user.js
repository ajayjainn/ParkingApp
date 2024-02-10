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


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const url = "https://ap-south-1.aws.neurelo.com" + "/custom/UserE";
  const queryParams = new URLSearchParams({ email });
  const fullUrl = url + "?" + queryParams.toString();

  const resp = await fetch(fullUrl, {
    headers: headers,
  });
  if (!resp.ok) {
    return res.send({ error: "Something went wrong!" });
  }
  const data = await resp.json();
  const user = data.data.cursor.firstBatch[0];
  if (!user) {
    return res.send({ error: "Email or Password dosent match" });
  }
  const isValid = await bcrypt.compare(password, user.password);
  
  delete user.password
  
  if (isValid) {
    const token = jwt.sign({ _id: user._id }, process.env.SECRET);
    return res.send({ user, token });
  }
  res.send({ error: "Email or Password dosent match" });
});

module.exports = router;
