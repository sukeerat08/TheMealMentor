exports.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error', 'Please Login!');
		return res.redirect('/signin');
	}
};

