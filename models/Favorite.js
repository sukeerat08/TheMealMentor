const mongoose= require("mongoose");

var favoriteSchema = new mongoose.Schema({
	id: {type: String, trim: true, required: true},
	title: {type: String, trim: true, required: true},
	image: {type: String, trim: true, required: true},
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model("Favorite",favoriteSchema); 