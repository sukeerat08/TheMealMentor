const fetch = require('node-fetch');
const {getApiKey} = require('../helpers/keys');

const getDetail = async function(req, res){
	const mealid = req.params.id;
	console.log(mealid);
	
	const res1 = await fetch(`https://api.spoonacular.com/recipes/${mealid}/similar?apiKey=${getApiKey()}&number=8`);
	const resData1 = await res1.json();
	let related = resData1.map((r) => ({ id: r.id, title: r.title}));
	
    fetch(`https://api.spoonacular.com/recipes/${mealid}/information?apiKey=${getApiKey()}`)
	.then(res=> res.json())
	.then((resData)=>{
		 return res.render('detail',{
			 data: resData,
			 arr:related
		 });
	});
}

const viewAllRecipes = function (req, res) {
	const url = req.body.url;
	const limit = req.body.limit;
	const offset = req.body.offset;
	const options = req.body.options;
	let params = '';
	options.forEach(opt=>{
		params += '&'+opt.key+'='+opt.value;
	})

	fetch(`https://api.spoonacular.com/${url}?apiKey=${getApiKey()}&number=${limit}&offset=${offset}${params}`)
	.then((res) => res.json())
	.then((data) => {
		let sendData=[];
		if(req.body.custom === true){
			console.log('here: ',url);
			sendData = data.recipes;
		}else{
			sendData = data.results;
		}
		return res.json({ recipes:  sendData});
	})
	.catch((err) => {
		console.log(err);
		return res.json({ err: err.message });
	});
};

const getTasteAnalysis = function(req, res){
	const mealid = req.params.id;
     fetch(`https://api.spoonacular.com/recipes/${mealid}/tasteWidget.json?apiKey=${getApiKey()}`)
	.then(res=> res.json())
	.then((resData)=>{
		res.send({taste: resData});
	});
}

const getNutrientsAnalysis = function(req, res){
	const mealid = req.params.id;
	console.log(mealid);
     fetch(`https://api.spoonacular.com/recipes/${mealid}/nutritionWidget.json?apiKey=${getApiKey()}`)
	.then(res=> res.json())
	.then((resData)=>{
		res.send({nutrients: resData});
	});
}

const getPriceAnalysis = function(req, res){
	const mealid = req.params.id;
     fetch(`https://api.spoonacular.com/recipes/${mealid}/priceBreakdownWidget.json?apiKey=${getApiKey()}`)
	.then(res=> res.json())
	.then((resData)=>{
		res.send({price: resData});
	});
}

const getviewPage = function(req,res){
	const cuisine = req.query.cuisine;
	const diet = req.query.diet;
	const type = req.query.type;
	const excludeIngredients = req.query.excludeIngredients;
	const intolerances = req.query.intolerances;
	const custom=req.query.custom;
	const options = [];
	// console.log(cuisine,diet,type,excludeIngredients,intolerances,custom);
	if(cuisine){
		options.push({key: 'cuisine', value: cuisine});
	}
	if(diet){
		options.push({key:'diet',value:diet});
	}
	if(excludeIngredients){
		options.push({key: 'excludeIngredients', value: excludeIngredients});
	}
	if(type){
		options.push({key: 'type', value: type});
	}
	if(intolerances){
		options.push({key:'intolerances',value:intolerances});
	}
	// console.log("Options of  meals are",options);
	return res.render('viewall',{
		options: options,
		random: custom
	});
}

const getAutocomplete = function(req,res){
	fetch(`https://api.spoonacular.com/recipes/autocomplete?apiKey=${getApiKey()}&number=10&query=${req.query.input}`)
	.then((res) => res.json())
	.then((resData) => {
		if (resData.status == 'failure') {
			console.log(resData.message);
			return res.send({results: [], err: resData.message});
		}
		return res.send({results: resData});
	})
	.catch((err) => {
		console.log(err.message);
		return res.send({results: [], err: err.message});
	});
}

module.exports = { getDetail, viewAllRecipes, getTasteAnalysis, getPriceAnalysis, getNutrientsAnalysis,getviewPage, getAutocomplete };