const express = require('express');
const router = express.Router();
const { getDetail, viewAllRecipes, getPriceAnalysis, getNutrientsAnalysis, getTasteAnalysis ,getviewPage, getAutocomplete} = require('../controllers/meal');
const {isLoggedIn} = require('../middleware/auth');

router.get("/search", isLoggedIn, (req,res)=>{
	res.render('search');
});

router.get("/viewall", isLoggedIn, getviewPage);

router.post("/recipes-pagination", isLoggedIn, viewAllRecipes);

router.get("/show/:id", isLoggedIn, getDetail);

router.get("/gettastegraph/:id", isLoggedIn, getTasteAnalysis);

router.get("/getnutrientsgraph/:id", isLoggedIn, getNutrientsAnalysis);

router.get("/getpricegraph/:id", isLoggedIn, getPriceAnalysis);

router.get("/get-autocomplete-suggestions", isLoggedIn, getAutocomplete);

module.exports = router;