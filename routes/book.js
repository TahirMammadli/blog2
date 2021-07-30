const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book");
const {isAuth, isAdmin} = require("../middleware/is-auth");


router.get("/", bookController.getIndex);

router.get("/addbooks", isAuth, isAdmin, bookController.getAddBooks);
router.get('/editBooks/:book_id', isAuth, isAdmin, bookController.edit_book)
router.get('/adminBooks', isAuth, isAdmin, bookController.admin_books)
router.post('/delete/:book_id', bookController.delete_book)
router.post("/postAddBooks", bookController.postAddBooks);
router.get("/books/:bookId", bookController.singleBook);
router.get("/rent-form/:book_id", bookController.rent_form)
router.post("/post-rent-form", bookController.post_rent_form)
router.get("/payment", bookController.payment)

module.exports = router;
