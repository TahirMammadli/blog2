const Book = require("../models/Book");
const User = require("../models/User");
const Favorite = require("../models/Favorite");
const Rent_Info = require("../models/Rent_Info");

const mongodb = require("mongodb");
const { post } = require("../routes/book");

exports.getIndex = (req, res, next) => {
  Book.find().then((books) => {
    res.render("index", {
      books: books,
    });
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
  res.render("admin/add&edit_books", {
    editMode: false,
  });
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
      res.redirect("/favorites");
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
  const book_id = req.params.book_id;
  req.session.book_id = book_id;
  res.render("rent-form");
};

exports.post_rent_form = (req, res, next) => {
  const book_id = req.params.book_id;
  const name = req.body.name;
  const email = req.body.email;
  const phone_number = req.body.phone_number;
  const street = req.body.street;
  const apt = req.body.apt;
  const zip_code = req.body.zip_code;

  const rent_info = new Rent_Info({
    name: name,
    email: email,
    phone_number: phone_number,
    street: street,
    apt: apt,
    zip_code: zip_code,
  });

  rent_info
    .save()
    .then((result) => {
      res.redirect("/payment");
    })
    .catch((err) => console.log(err));
};

exports.payment = (req, res, next) => {
  let books;
  let total = 0;
  console.log(req.session.book_id);
  Book.findById(req.session.book_id).then((book) => {
    return stripe.checkout.session
      .create({
        payment_method_types: ["card"],
        line_items: books.map(),
      })
      .then((session) => {
        res.render("payment", {
          book: book,
          session_id: session.id,
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.admin_books = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.render("admin", {
        books: books,
      });
    })
    .catch((err) => console.log(err));
};

exports.delete_book = (req, res, next) => {
  const book_id = req.params.book_id;
  Book.findByIdAndRemove(book_id)
    .then((result) => {
      res.redirect("/adminBooks");
    })
    .catch((err) => console.log(err));
};

exports.edit_book = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }
  res.render("add&edit_books", {
    editMode: editMode,
  });
};
