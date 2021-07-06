const { findByEmail } = require("../models/User");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sendGrid = require("@sendgrid/mail");
const crypto = require("crypto");
const { send } = require("process");
const configjs = require("../config")

sendGrid.setApiKey(configjs.apiKey);

const msg = {
  to: "tahirmammadli13@gmail.com",
  from: "forsendgrid1@gmail.com",
  subject: "Testing...",
  text: "Testing...",
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email}).then((result) => {
    if (result) {
      console.log(result);
      res.redirect("/signup");
    }
  });
  return bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({email: email, password: hashedPassword});
      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
      sendGrid.send(msg, function (err, info) {
        if (err) {
          console.log("Email wasnt sent");
        } else {
          console.log("success");
        }
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({email: email}).then((result) => {
    if (result) {
      bcrypt.compare(password, result.password).then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          return req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        } else {
          res.redirect("/login");
        }
      });
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
      User.findOne({email: email}).then((user) => {
        if (!user) {
          console.log("no user found");
          res.redirect("/login");
        } else {          
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          user.save();
        }
        res.redirect('/')
          const msgResetPassword = {
            to: req.body.email,
            from: "forsendgrid1@gmail.com",
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


exports.getNewPassword = (req,res,next) => {
  const token = req.params.token
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
  .then(user => {
    console.log(user)
    res.render('new-password', {
      userId: user._id.toString(),
      passwordToken: token
    })
  })
.catch(err => {
  console.log(err)
})
}

exports.postNewPassword = (req,res,next) => {
  const newPassword = req.body.newPassword
  const userId = req.body.userId
  const token = req.body.passwordToken
  let resetUser
  User.findOne({
    resetToken: token,
    resetTokenExpiration: {$gt: Date.now()},
    _id: userId
  })  
  .then(user => {
    console.log(user)
    resetUser = user
    return bcrypt.hash(newPassword, 12)
  }).then(hashedPassword => {
    resetUser.password = hashedPassword
    resetUser.resetToken = undefined
    resetUser.resetTokenExpiration = undefined
    return resetUser.save()
  })
  .then(result => {
    res.redirect('/login')
  })
  .catch(err => console.log(err))
}
