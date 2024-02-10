const jwt = require("jsonwebtoken");
const URL = "https://ap-south-1.aws.neurelo.com";
const apiKey = process.env.NEURELO_APIKEY;

const headers = {
  "X-API-KEY": apiKey,
  "X-QUERY-VIZ": "",
  "X-SELECT-STRATEGY": "",
};
const auth = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    res.send({ error: "Unauthorized" });
  }
  const userId = jwt.decode(token, process.env.SECRET)._id["$oid"];
  console.log(userId);

  const baseUrl = `${URL}/rest/User/${userId}`;
  console.log(baseUrl);
  const resp = await fetch(baseUrl, {
    method: "GET",
    headers: headers,
  });
  const data = await resp.json();
  const user = data.data;
  req.user = user;
  console.log(user)
  next();
};

module.exports = auth;
