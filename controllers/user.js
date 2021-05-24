const User = require('../models/User');
const passport = require('passport');

const register = async (req, res, next) => {
    try {
		console.log(req.body);
		const user = new User(req.body);
		await user.save();
		passport.authenticate("local", (err, user, info) => {
			if (err) {
				return next(err);
			}
			if (!user) {
				req.flash('error', info.msg);
				return res.redirect('back');
				// return res.json({ msg: info });
			}

			req.logIn(user, function (err) {
				if (err) {
					req.flash('error', err.message);
					return next(err);
				}
				req.flash('success', 'Last Step tp your login!');
				return res.redirect("/Signup-last-step");
			});
		})(req, res, next);
    } catch (err) {
		console.log(err);
		req.flash('error', err.message);
		res.redirect('back');
    }
}

const login = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            console.log('no user', info);
			req.flash('error', info.msg);
			return res.redirect('back');
            // return res.json({ msg: info });
        }

        req.logIn(user, function (err) {
            if (err) {
				req.flash('error', err.message);
				return next(err);
			}
	
			if(user.option===true){
				req.flash('success','Login Successfully!');
				return res.redirect("/");
			}else{
				req.flash('success','Customize your recipes')
				return res.redirect("/Signup-last-step");
			}
            
        });
    })(req, res, next);
}

const logout = (req, res) => {
    req.logout();
    res.redirect("/signin");
}

const getUserDashboard = async (req,res)=>{
	const user = await User.findById(req.user._id);
	const signinGoogle = user.google && !user.password ? true : false;
	delete user._doc['password'];
	delete user._doc['google'];
	res.render('profile', {userData: user._doc, signinGoogle,user:user});
}

const editUserInfo = async (req,res)=>{
	try{
		const user = await User.findById(req.user._id);
		const newName = req.body.fullName || null;
		const password = req.body.password || null;
		const newPassword = req.body.newPassword || null;
		
		user.fullName = newName || user.fullName;
		if(password && newPassword){
			const isMatch = await user.comparePassword(password)
			if (isMatch) {
				user.password = newPassword
			}
		} else if(user.google && newPassword && !password){
			user.password = newPassword;
		}
		
		await user.save();
		console.log('completed');
		req.flash('success', 'Your Information has been updated successfully!');
		return res.redirect('back');
		
	} catch(err){
		console.log('catched error: ',err.message);
		if(err.message === 'Invalid email or password!'){
			req.flash('error', 'Invalid Current Password! So we are not updating your information.');
		}else{
			req.flash('error', err.message);
		}
		return res.redirect('back');
	}
}

const editUserInterest = async (req, res)=>{
	try{
		const user = await User.findById(req.user._id);
		
		const favCusine = req.body.favCusine;
		const foodAllergies = req.body.foodAllergies;
		const diet = req.body.diet;
		const notIngredients = req.body.notIngredients;
		const mustIngredients = req.body.mustIngredients;
		
		user.favCusine = favCusine || user.favCusine;
		user.foodAllergies = foodAllergies || user.foodAllergies;
		user.diet = diet || user.diet;
		user.notIngredients = notIngredients || user.notIngredients;
		user.mustIngredients = mustIngredients || user.mustIngredients;
		
		await user.save();
		
		req.flash('success', 'Your Interests has been updated successfully!');
		res.redirect('/user/me');
	} catch(err){
		req.flash('error', err.message);
		return res.redirect('back');
	}
}

const slider=async function(req,res){
   
    return res.render('slider',{
        title:"Slider",
    });
}

module.exports = {
	login,
	register,
	logout,
	getUserDashboard,
	editUserInfo,
	editUserInterest,
	slider
};