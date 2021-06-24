const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");
const userController = require("../controllers/user");
const isAuth = require("../middleware/is-auth")


router.get("/", postController.getIndex);
router.get("/get-add-post", isAuth.isAuth, postController.getAddPost);
router.post("/post-add-post",isAuth.isAuth, postController.postAddPost);
router.get("/get-single-post/:postId",isAuth.isAuth, postController.getSinglePost)
router.get("/delete-post/:postId",isAuth.isAuth, postController.deletePost)
router.post("/post-edit-post",isAuth.isAuth, postController.postEditPost);
router.get("/get-edit-post/:postId",isAuth.isAuth, postController.getEditPost);
router.get("/getLogin", postController.getLogin)
router.get("/getSignup", isAuth.isAuth,postController.getSignup)
router.post("/postSignup",isAuth.isAuth, userController.postSignup)
router.post("/postLogin",isAuth.isAuth, userController.postLogin)
router.post("/logout", isAuth.isAuth,userController.logout)



module.exports = router;
