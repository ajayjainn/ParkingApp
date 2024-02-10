const express = require("express");
const app = express();
const userRouter = require("./routes/user.js");
const bookingRouter = require("./routes/booking.js");
const authMiddleware = require("./middleware/auth.js");
const cors = require('cors')
app.use(cors({
  credentials:true,
  origin:"*"
}))
app.use(express.json());
app.use('/auth',userRouter);
app.use("/booking", authMiddleware, bookingRouter);

app.listen(3007, () => {
  console.log("Server running on Port 3007");
});
