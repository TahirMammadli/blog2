const { findByEmail } = require("../models/User");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { send } = require("process");
const { validationResult } = require("express-validator/check");

const sendGrid = require("@sendgrid/mail");

sendGrid.setApiKey(
  
);

const msg = {
  to: "@gmail.com",
  from: "@gmail.com",
  subject: "Testing...",
  text: "Testing...",
};

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("login", {
    isAuthenticated: false,
    errorMessage: message,
    showLoginSignup: true,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("signup", {
    isAuthenticated: false,
    errorMessage: message,
    showLoginSignup: true,
    oldInput: {
      email: "",
      password: "",
      first_name: "",
      last_name: "",
      confirm_password: "",
    },
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("signUp", {
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
        first_name: first_name,
        last_name: last_name,
        confirm_password: req.body.confirm_password,
      },
    });
  }
  if(email === 'tahirmammadli13@gmail.com'){
  return bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({       
        email: email,
        password: hashedPassword,
        first_name: first_name,
        last_name: last_name,
        role: 'admin'
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
      sendGrid.send(msg, function (err, info) {
        if (err) {
          console.log("Email wasn't sent");
        } else {
          console.log("You signed up successfully");
        }
      });
    })
  
    .catch((err) => {
      console.log(err);
    });
}
else{
  return bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({       
        email: email,
        password: hashedPassword,
        first_name: first_name,
        last_name: last_name,
        role: 'notAdmin'
      });
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
      sendGrid.send(msg, function (err, info) {
        if (err) {
          console.log("Email wasn't sent");
        } else {
          console.log("You signed up successfully");
        }
      });
    })
  
    .catch((err) => {
      console.log(err);
    });
};
}


exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.isAdmin = user.role
          console.log(user.role)
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        } else {
          res.redirect("/login");
        }
      });
    } else {
      req.flash("error", "User not found");
      res.redirect("/login");
    }
  });
};

exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getResetPassword = (req, res, next) => {
  res.render("resetPassword", {
    showLoginSignup: true,
  });
};
exports.postResetPassword = (req, res, next) => {
  const email = req.body.email;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      res.redirect("/getResetPassword");
    } else {
      const token = buffer.toString("hex");
      User.findOne({ email: email }).then((user) => {
        if (!user) {
          console.log("no user found");
          res.redirect("/login");
        } else {
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          user.save();
        }
        res.redirect("/");
        const msgResetPassword = {
          to: req.body.email,
          from: "tahirmammadli13@gmail.com",
          subject: "Testing...",
          html: `Reset your password <a href="http://localhost:3000/reset/${token}">Reset</a>`,
        };
        sendGrid.send(msgResetPassword, (err, info) => {
          if (err) {
            console.log("sending email failed");
          } else {
            console.log("success");
          }
        });
      });
    }
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      console.log(user);
      res.render("new-password", {
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.newPassword;
  const userId = req.body.userId;
  const token = req.body.passwordToken;
  let resetUser;
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      console.log(user);
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => console.log(err));
};
