const Book = require("../models/Book");
const User = require("../models/User");
const Favorite = require("../models/Favorite");
const Rent_Info = require("../models/Rent_Info")

const mongodb = require("mongodb");
const { post } = require("../routes/book");

exports.getIndex = (req, res, next) => {
  // if (req.session.isLoggedIn == undefined) {
  Book.find().then((books) => {
    res.render("index", {
      books: books,

      // showLoginSignup: true,
    });
    // });
    // } else {
    // Post.fetchAll().then((posts) => {
    //   res.render("index", {
    //     posts: posts,
    //     showLoginSignup: false,
    //   });
    // });
  });
};

exports.favorites = (req, res, next) => {
  Book.find({ user_id: req.session.user._id }).then((books) => {
    res.render("favorites", {
      books: books,
    });
  });
};

exports.getAddBooks = (req, res, next) => {
  res.render("add_books");
};

exports.postAddBooks = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const img_url = req.body.img_url;
  const book = new Book({
    title: title,
    content: content,
    img_url: img_url,
    user_id: req.user,
  });
  book
    .save()
    .then((result) => {
      console.log("Successfully added!");
      res.redirect("./mybooks");
    })
    .catch((err) => console.log(err));
};

exports.singleBook = (req, res, next) => {
  const bookId = req.body.bookId;
  Book.findById({ _id: bookId }).then((book) => {
    res.render("single-book", {});
  });
};

exports.rent_form = (req, res, next) => {
  res.render("rent-form");
};

exports.post_rent_form = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone_number = req.body.phone_number;
  const street = req.body.street;
  const apt = req.body.apt;
  const zip_code = req.body.zip_code

  const rent_info = new Rent_Info({
    name: name,
    email: email,
    phone_number: phone_number,
    street: street,
    apt: apt,
    zip_code: zip_code
  })

  rent_info.save().then(result => {
    res.redirect('/payment')
  })
  .catch(err => console.log(err))
};

exports.payment = (req,res,next) => {
  res.render('payment')
}
