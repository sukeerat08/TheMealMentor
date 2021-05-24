require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
// const session = require("express-session");
const passport = require('passport');
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const flash = require("connect-flash");
const sassMiddleware=require('node-sass-middleware');

require('./config/passport');

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_ACCOUNT}@cluster0.4fzaa.mongodb.net/mealmentor?retryWrites=true&w=majority`;

const apiKey = process.env.API_KEY;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieSession({
    keys: [process.env.COOKIE_KEYS]
}));
// app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(cookieParser());
app.use(flash());

app.use(sassMiddleware({
    src: path.join(__dirname,'public','sass'),
    dest: path.join(__dirname,'public', 'css'),
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true
}).then(res => {
        console.log("Connected to DB");
}).catch(err=>{
	console.log(err.message);
})

app.use(passport.initialize());
app.use(passport.session());

app.use(async function(req, res, next){
	if(req.user){
		res.locals.currUser = {name: req.user.fullName, id: req.user._id, email: req.user.email, favRecipes: req.user.favRecipes};
	}
   	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
   	next();
});


app.use(require('./routes/home'));
app.use(require('./routes/user'));
app.use(require('./routes/meals'));
app.use(require('./routes/favorites'));


app.listen(process.env.PORT || 8080, () => {
	console.log("Server has started!") 
});