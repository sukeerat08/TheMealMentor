const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require("../middleware/auth");
const {register, login, logout, getUserDashboard, editUserInfo, editUserInterest,slider} = require('../controllers/user');

router.get("/signin",(req,res)=>{
	if(req.user){
		return res.redirect('/');
	}
	res.render('login');
})

router.get('/Signup-last-step',slider);

router.post("/register", register);

router.post('/login', login);

router.get("/logout", isLoggedIn, logout);

router.get('/auth/google', passport.authenticate('google',{ scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google',{ failureRedirect:'/signin'}),
	function (req, res){
		console.log('hii i am there!');
		if(req.user.option===true){
			return res.redirect("/");
		}else{
			return res.redirect("/Signup-last-step");
		}
  		
	});

router.get('/user/me', isLoggedIn, getUserDashboard);

router.post('/user/edituserinfo', isLoggedIn, editUserInfo);

router.post('/user/edituserinterest', isLoggedIn, editUserInterest);

module.exports = router;