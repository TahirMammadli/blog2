const Post = require("../models/Post");
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

exports.getAddPost = (req, res, next) => {
  res.render("add-post", {
    showLoginSignup: false,
    // isAuthenticated: req.session.isLoggedIn
  });
};

exports.getIndex = (req, res, next) => {
  // if (req.session.isLoggedIn == undefined) {
  Post.find().then((posts) => {
    res.render("index", {
      posts: posts,
      showLoginSignup: true,
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

  Post.findById(postId)
    .then((post) => { 
      post.title = updatedTitle;
      post.content = updatedContent;
      return post.save();
    })
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
