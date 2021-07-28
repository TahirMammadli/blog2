const express = require("express");
const router = express.Router();
const bookController = require("../controllers/all-book");
const isAuth = require("../middleware/is-auth");

router.get("/", bookController.getIndex);

router.get("/addbooks", bookController.getAddBooks);
router.post("/postAddBooks", bookController.postAddBooks);
router.get("/books/:bookId", bookController.singleBook);
router.get("/rent-form", bookController.rent_form)
router.post("/post-rent-form", bookController.post_rent_form)
router.get("/payment", bookController.payment)

module.exports = router;
