const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/User");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
        if(err){
            console.log("Error");
            return done(err);
        }

        return done(null,user);
    })
})

// Sign in using Email and Password.

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, async (err, user) => {
        if (err) { return done(err); }
        if (!user) {
            return done(null, false, { msg: `Email ${email} not found.` });
        }
        if (!user.password) {
            return done(null, false, { msg: 'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.' });
        }
		try{
        	const isMatch = await user.comparePassword(password);
			if (isMatch===true) return done(null, user);
		} catch(err){
        	return done(null, false, { msg: err.message });
		}
    });
}));

// Sign in with Google.

const googleStrategyConfig = new GoogleStrategy(
	{
		clientID: process.env.GOOGLE_AUTH_API,
		clientSecret: process.env.GOOGLE_AUTH_SECRET,
		callbackURL: '/auth/google/callback',
		passReqToCallback: true,
	}, async (req, accessToken, refreshToken, profile, done) => {
		// console.log('req.user', req.user);
		try{
			const existingUser = await User.findOne({ email: profile.emails[0].value });
			if (existingUser) {
				return done(null, existingUser);
			}
			const user = new User();
			// console.log(profile);
			user.email = profile.emails[0].value;
			user.google = profile.id;
			user.fullName = profile.displayName;
			await user.save();
			done(null, user);
		} catch(err){
			return done(err);
		}
	}
);

// if (req.user) {
//         User.findOne({ google: profile.id }, (err, existingUser) => {
//             if (err) { return done(err); }
//             if (existingUser && (existingUser.id !== req.user.id)) {
//                 done(err);
//             } else {
//                 User.findById(req.user.id, (err, user) => {
//                     if (err) { return done(err); }
//                     user.google = profile.id;
//                     user.name = user.name || profile.displayName;
//                     user.save((err) => {
//                         done(err, user);
//                     });
//                 });
//             }
//         });
//     } else {

passport.use('google', googleStrategyConfig);