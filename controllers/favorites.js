const User = require('../models/User');
const Favorite = require('../models/Favorite');

exports.favoritesHandler = async (req,res)=>{
	try{
		const mealId = req.query.id;
		const mealTitle = req.query.title;
		const mealImage = req.query.image;
		const isFav = req.user.favRecipes.find(fav => fav === mealId);
		if(!isFav){
			const newFav = new Favorite({id: mealId, title: mealTitle, image: mealImage, user: req.user._id}) 
			req.user.favRecipes.push(mealId);
			await newFav.save();
			await req.user.save();
			return res.send({code: 1, message: 'Recipe added to favorites!'});
		}else{
			req.user.favRecipes.pull(mealId);
			const prevFav = await Favorite.findOne({id: mealId, user: req.user._id});
			await prevFav.remove();
			await req.user.save();
			return res.send({code: -1, message: 'Recipe removed to favorites!'});
		}
	} catch(err){
		console.log(err.message);
		res.send({err: err.message});
	}
}

exports.getUserFavorites = async (req,res)=>{
	try{
		const myFavrecipes = await Favorite.find({user: req.user._id});
		res.send({myFavrecipes: myFavrecipes});
	}catch(err){
		console.log(err.message);
		res.send({err: err.message});
	}
}