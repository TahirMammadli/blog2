const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const postRoutes = require("./routes/post");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const mongoose = require("mongoose");
const path = require("path");
const sendGrid = require("@sendgrid/mail");
sendGrid.setApiKey(apikey);
const flash = require("connect-flash");

const User = require("./models/User");

app.use(express.static(path.join(__dirname, "public")));

const store = new MongoDBStore({
  uri: configjs.MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();
app.set("view engine", "ejs");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

const msg = {
  to: "tahirmammadli13@gmail.com",
  from: "forsendgrid1@gmail.com",
  subject: "Testing...",
  text: "Testing...",
};

app.use("/sendemail", (req, res, next) => {
  sendGrid
    .send(msg)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
});

app.use(postRoutes);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.log("connected!");
    app.listen(3000);
  })
  .catch((err) => console.log(err));
