const Book = require("../models/Book");
const mongodb = require("mongodb");
const { post } = require("../routes/post");

exports.postAddPost = (req, res, next) => {
  let title = req.body.title;
  let content = req.body.content;
  const post = new Post({ title: title, content: content });
  post
    .save()
    .then((result) => {
      console.log("ADDED TO DB");
      res.redirect("/");
    })
    .catch((err) => console.log(err));

  res.redirect("/");
};

exports.getSinglePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId).then((post) => {
    res.render("single-post", {
      post: post,
    });
  });
};

exports.get_reviews = (req, res, next) => {
  Review.find().then((reviews) => {
    res.render("reviews", {
      reviews: reviews,
    });
  });
};

exports.get_share_a_post = (req, res, next) => {
  res.render("share-post", {
    showLoginSignup: false,
    // isAuthenticated: req.session.isLoggedIn
  });
};

exports.post_share_a_post = (req, res, next) => {
  const title = req.body.title;
  const body = req.body.body;
  const img_url = req.body.img_url;
  const post = new Post({ title: title, body: body, img_url: img_url });
  post
    .save()
    .then((result) => {
      console.log("Your shared a post!");
      res.redirect("/");
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  // if (req.session.isLoggedIn == undefined) {
  Book.find().then((books) => {
    res.render("index", {
      books: books,
      user: req.session.user,
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

exports.postEditPost = (req, res, next) => {
  const postId = req.body.postId;
  const updatedTitle = req.body.title;
  const updatedContent = req.body.content;

  Post.findById(postId).then((post) => {
    post.title = updatedTitle;
    post.content = updatedContent;
    return post.save();
  });
  res.redirect("/");
};

exports.getEditPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId).then((post) => {
    res.render("edit-post", {
      post: post,
    });
  });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.deletePost(postId);
  res.redirect("/");
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

exports.myBooks = (req, res, next) => {
  Book.find({ user_id: req.session.user._id }).then((books) => {
    res.render("my_books", {
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



exports.singleBook = (req,res,next) => {
  const bookId = req.body.bookId
  Book.findById({_id: bookId}).then(book => {
    res.render('single-book', {
      
    })
  })
  
  
}