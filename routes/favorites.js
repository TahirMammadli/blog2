const express = require('express')
const router = express.Router()
const favoritesController = require('../controllers/favorites')

router.post("/addToFavorites/:book_id", favoritesController.add_to_favorites);
router.get("/favorites", favoritesController.get_favorites)
router.post("/deleteFromFavorites/:book_id", favoritesController.delete_from_favorites)

module.exports = router
