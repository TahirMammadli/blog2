const Post = require("../models/Post");
const mongodb = require("mongodb");

exports.postAddPost = (req, res, next) => {
  let title = req.body.title;
  let content = req.body.content;
  const post = new Post(title, content);
  post.save();

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

exports.getAddPost = (req, res, next) => {
  res.render("add-post", {
    showLoginSignup: false,
    isAuthenticated: true

  });
};

exports.getIndex = (req, res, next) => {
  if (req.session.isLoggedIn == undefined) {
    Post.fetchAll().then((posts) => {
      res.render("index", {
        posts: posts,
        isAuthenticated: false,
        showLoginSignup: true
      });
    });
  } else {
    Post.fetchAll().then((posts) => {
      res.render("index", {
        posts: posts,
        isAuthenticated: req.session.isLoggedIn,
        showLoginSignup: false,
        csrfToken: req.csrfToken()
      });
    });
  }
};

exports.postEditPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const postId = req.body.postId;

  Post.update(new mongodb.ObjectId(postId), title, content);
  res.redirect("/");
};

exports.getEditPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId).then((post) => {
    res.render("edit-post", {
      post: post,
    });
    console.log(post.content, "FROM CNTRLR");
  });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.deletePost(postId);
  res.redirect("/");
};

exports.getLogin = (req, res, next) => {
  res.render("login", {
    isAuthenticated: false,

    showLoginSignup: true,

  });
};

exports.getSignup = (req, res, next) => {
  res.render("signup", {
    isAuthenticated: false,
    showLoginSignup: true,

  });
};
