const express = require('express');
const router = express.Router();
const { favoritesHandler, getUserFavorites } = require('../controllers/favorites');
const {isLoggedIn} = require('../middleware/auth');

router.get("/handleFavorites", isLoggedIn, favoritesHandler);

router.get("/getUserFavorites", isLoggedIn, getUserFavorites);

module.exports = router;