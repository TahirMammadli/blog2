const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bookRoutes = require("./routes/book");
const authRoutes = require("./routes/auth");
const favoritesRoutes = require("./routes/favorites");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const mongoose = require("mongoose");
const path = require("path");
const flash = require("connect-flash");
const { MONGODB_URI, stripe_api_key } = require("./config");
const stripe = require("stripe")(stripe_api_key);
const User = require("./models/User");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf();
app.set("view engine", "ejs");
app.set("views", "views");

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
  res.locals.isAdmin = req.session.isAdmin;
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

app.use(authRoutes);
app.use(bookRoutes);
app.use(favoritesRoutes);

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("connected!");
    app.listen(3000);
  })
  .catch((err) => console.log(err));

