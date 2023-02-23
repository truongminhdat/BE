const express = require("express");
const app = express();
const port = 8001;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const setAssociation = require("./models/association");
const authRouter = require("./Router/auth.router");
// const hotelRouter = require("./Router/hotel.router");
const userRouter = require("./Router/user.router");
// const roomRouter = require("./Router/room.router");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const { roleRouter } = require("./Router/role.router");
const categoriesRouter = require("./Router/categories.router");
const roomRouter = require("./Router/room.router");
const { orderRouter } = require("./Router/order.router");
const { adminRouter } = require("./Router/admin.router");
const {paymentRouter} = require('./Router/payment.router')
setAssociation();
require("dotenv").config();

// app.use(cors({ credentials: true, origin: true }));
app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", process.env.URL_REACT);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

//  app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb" }));

app.use(cookieParser());
app.use(cors());
app.use(fileUpload());
app.use(express.static("public"));

// app.use("/email/service", sendMailRouter);
app.use("/auth", authRouter);
// app.use("/hotel", hotelRouter);
app.use("/role", roleRouter);

app.use("/user", userRouter);
app.use("/categories", categoriesRouter);
app.use("/order", orderRouter)

app.use("/room", roomRouter);
app.use("/admin", adminRouter)
app.use("/payment", paymentRouter)
app.get("/setcookie", (req, res) => {
  res.cookie(`Cookie token name`, `encrypted cookie string Value`);
  res.send("Cookie have been saved successfully");
});
// app.use("/user/", userRouter);

app.listen(port, () => {
  console.log(`Save running server ${port}`);
});
