const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const authJwt = require("./Controller/jwt");
const expressJwt = require("express-jwt-token");
const jwt = require("jsonwebtoken");
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const verifyJWT = require("./Controller/verifyJWT");
// const io = require("socket.io")(8000);

require("dotenv/config");

app.use(cors());
app.options("*", cors());

//middleware
//checking everything going to the server before it gets executed
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));

// app.use(authJwt);

app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json({ message: "error in the server" });
  }
});

//Routes
const productsRoutes = require("./Routes/products");
const categoriesRoute = require("./Routes/categories");
const exportersRoute = require("./Routes/exporters");
const importersRoute = require("./Routes/importers");
const messagesRoute = require("./Routes/messages");
const chatroomRoute = require("./Routes/chatrooms");

const api = process.env.API_URL;

app.use(`${api}/exporters`, exportersRoute);
app.use(`${api}/importers`, importersRoute);
// app.use(verifyJWT);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/categories`, categoriesRoute);
app.use(`${api}/messages`, messagesRoute);
app.use(`${api}/chatrooms`, chatroomRoute);

//Database
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "project-database",
  })
  .then(() => {
    console.log("DB connection is ready");
  })
  .catch((err) => {
    console.log(err);
  });

//Server
app.listen(8000, () => {
  console.log("server is running");
});
