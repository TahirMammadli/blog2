const express = require("express");
const router = express.Router();
const User = require('../models/User')
const bookController = require("../controllers/book");
const userController = require("../controllers/user");
const isAuth = require("../middleware/is-auth");
const { check, body } = require("express-validator/check");

router.get("/", bookController.getIndex);

// router.get("/share-a-post",  postController.get_share_a_post);
// router.get('/reviews', postController.get_reviews)
// router.post('/post-review', postController.post_share_a_post)
// router.get("/get-single-post/:postId", postController.getSinglePost)
// router.get("/delete-post/:postId",isAuth.isAuth, postController.deletePost)
// router.post("/post-edit-post", postController.postEditPost);
// router.get("/get-edit-post/:postId", postController.getEditPost);

router.get("/addbooks", bookController.getAddBooks);
router.get("/mybooks", bookController.myBooks);

router.post("/postAddBooks", bookController.postAddBooks);

// LOGIN
router.get("/login", bookController.getLogin);
router.post("/login", userController.postLogin);




router.get('/books/:bookId', bookController.singleBook)





// SIGN UP
router.get("/signup", bookController.getSignup);
router.post("/signup", 
            [   
            check("email")
            .isEmail()
            .withMessage('Please enter a valid email')
            .custom((value, {req}) => {
                return User.findOne({ email: value }).then((result) => {
                    if (result) {
                      return Promise.reject(
                          'Email exists already'
                      )
                    }
                  });
            }),
            body('password')
                .isLength({min: 5})
                .withMessage(
                    'Please enter a password with at least 5 characters'
                )
                .isAlphanumeric(),
                body('confirm_password').custom((value, {req}) => {
                    if(value !== req.body.password){
                        throw new Error('Passwords do not match')
                    }
                    return true 
                })
                //.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
             ],
            userController.postSignup);

router.post("/logout", userController.logout);

router.get("/getResetPassword", userController.getResetPassword);
router.post("/postResetPassword", userController.postResetPassword);
router.get("/reset/:token", userController.getNewPassword);
router.post("/post-new-password", userController.postNewPassword);

module.exports = router;
