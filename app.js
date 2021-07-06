const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const postRoutes = require("./routes/post");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const mongoose = require("mongoose")
const path = require("path")

app.use(express.static(path.join(__dirname, 'public')))

const store = new MongoDBStore({
  uri: "mongodb+srv://m001-student:m001-mongodb-basics@sandbox.2pcwm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
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

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(postRoutes);

mongoose.connect('mongodb+srv://m001-student:m001-mongodb-basics@sandbox.2pcwm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
.then(result => {
  console.log('connected!')
  app.listen(3000)
})
.catch(err => console.log(err))