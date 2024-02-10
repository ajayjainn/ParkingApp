const express = require("express");
const app = express();
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/booking.js");
const parkinglotRouter = require("./routes/parkinglot.js");
const authMiddleware = require("./middleware/auth.js");
app.use(express.json());
app.use(userRouter);
app.use("/parkinglot", parkinglotRouter);
app.use("/booking", authMiddleware, bookingRouter);

app.listen(3007, () => {
  console.log("Server running on Port 3007");
});
