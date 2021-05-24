const mongoose= require("mongoose");
const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
	email: {type: String, unique: true, trim: true, required: true},
	fullName: {type: String, default: 'anonymous'},
	password: {type: String, minlength: 5, trim: true, default: null},
	google: String,
	favCusine: {type: String, default: null},
	foodAllergies: {type: String, default: null},
	diet: {type: String, default: null},
	notIngredients: {type: String, default: null},
	type: {type: String, default: null},
	option:{type:Boolean,default:false},
	favRecipes: [{type: String}]
},{
    timestamps: true
});


userSchema.methods.comparePassword = async function (plainPassword) {
    const isMatch = await bcrypt.compare(plainPassword, this.password);
	if(!isMatch){
		throw new Error('Invalid email or password!');
	}
    return isMatch;
}

userSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {

        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
});

const User = mongoose.model("User",userSchema); 
module.exports = User;