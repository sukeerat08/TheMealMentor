const express=require('express');
const router=express.Router();
const homeController=require('../controllers/home_controller');
const {isLoggedIn} = require('../middleware/auth');

router.get('/', isLoggedIn, homeController.home);
router.post('/save-options', isLoggedIn, homeController.save);

router.get('/getdessert', isLoggedIn, homeController.dessert);
router.get('/getmaincourse', isLoggedIn, homeController.maincourse);
router.get('/getsalad', isLoggedIn, homeController.getSalad);
router.get('/getsnacks', isLoggedIn, homeController.getSnacks);
router.get('/getbeverage', isLoggedIn, homeController.getBeverage);

module.exports=router;
