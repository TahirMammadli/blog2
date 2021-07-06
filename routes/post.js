const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");
const userController = require("../controllers/user");
const isAuth = require("../middleware/is-auth")


router.get("/", postController.getIndex);
router.get("/get-add-post",  postController.getAddPost);
router.post("/post-add-post", postController.postAddPost);
router.get("/get-single-post/:postId", postController.getSinglePost)
router.get("/delete-post/:postId",isAuth.isAuth, postController.deletePost)
router.post("/post-edit-post", postController.postEditPost);
router.get("/get-edit-post/:postId", postController.getEditPost);
router.get("/getLogin", postController.getLogin)
router.get("/getSignup",postController.getSignup)
router.post("/postSignup", userController.postSignup)
router.post("/postLogin", userController.postLogin)
router.post("/logout",userController.logout)
router.get("/getResetPassword", userController.getResetPassword)
router.post("/postResetPassword", userController.postResetPassword)
router.get("/reset/:token", userController.getNewPassword)
router.post("/post-new-password", userController.postNewPassword)




module.exports = router;
