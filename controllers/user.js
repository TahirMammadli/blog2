const { findByEmail } = require("../models/User");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  findByEmail(email).then((result) => {
    if (result) {
      console.log(result);
      res.redirect("/getSignup");
    }
    return bcrypt.hash(password, 12).then((hashedPassword) => {
      const user = new User(email, hashedPassword);
      user.save();
      res.redirect("/getLogin");
    });
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  findByEmail(email).then((result) => {
    if (result) {
      bcrypt
        .compare(password, result.password)
        .then((doMatch) => {
          if(doMatch){
            req.session.isLoggedIn = true;
            return req.session.save(err => {
              console.log(err)
              res.redirect("/");
            })
          }else{
            res.redirect("/getLogin");
          }          
        })
    }
  });
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
