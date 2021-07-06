const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");
const userController = require("../controllers/user");
const isAuth = require("../middleware/is-auth")


router.get("/", postController.getIndex);

router.get("/share-a-post",  postController.get_share_a_post);
router.post("/post-add-post", postController.postAddPost);
router.get("/get-single-post/:postId", postController.getSinglePost)
router.get("/delete-post/:postId",isAuth.isAuth, postController.deletePost)
router.post("/post-edit-post", postController.postEditPost);
router.get("/get-edit-post/:postId", postController.getEditPost);

// LOGIN
router.get("/login", postController.getLogin)
router.post("/login", userController.postLogin)

// SIGN UP
router.get("/signup",postController.getSignup)
router.post("/signup", userController.postSignup)



router.post("/logout",userController.logout)

router.get("/getResetPassword", userController.getResetPassword)
router.post("/postResetPassword", userController.postResetPassword)
router.get("/reset/:token", userController.getNewPassword)
router.post("/post-new-password", userController.postNewPassword)




module.exports = router;
