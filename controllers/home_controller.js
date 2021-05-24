const User=require('../models/User');
const fetch=require('node-fetch');
const {getApiKey} = require('../helpers/keys');

module.exports.home=async function(req,res){
    try{
		let user=await User.findById(req.user);
    var arr = [];
    let url=`https://api.spoonacular.com/recipes/complexSearch?apiKey=${getApiKey()}&instructionsRequired=true&number=8`;
    let randomurl=`https://api.spoonacular.com/recipes/random?&apiKey=${getApiKey()}&number=8&instructionsRequired=true`;

	let a=false;	
    if(user.favCusine==null && user.foodAllergies==null && user.diet==null && user.type==null && user.notIngredients==null){

        const res = await fetch(randomurl);
        const resData = await res.json();
		a=true;
		if(resData.status && resData.status == 'failure') {
			throw new Error('Something Went Wrong !');
		}
        arr = resData.recipes.map((r) => ({ id: r.id, title: r.title, image: r.image }));

    }else{
        if(user.favCusine!=null){
            url+="&cuisine="+user.favCusine;
        }
        if(user.diet!=null){
            url+="&diet="+user.diet;
        }
        if(user.foodAllergies!=null){
            url+="&intolerances="+user.foodAllergies;
        }
        if(user.type!=null){
            url+="&type="+user.type;
        }
        if(user.notIngredients!=null){
            url+="&excludeIngredients="+user.notIngredients;
        }

        const res = await fetch(url);
        const resData = await res.json();
    	if(resData.status && resData.status == 'failure') {
			throw new Error('Something Went Wrong !');
		}
        if (resData.results && resData.results.length < 4) {
			a=true;
            console.log("Empty array");
            const res = await fetch(randomurl);
            const resData = await res.json();
            arr = resData.recipes.map((r) => ({ id:r.id, title: r.title, image: r.image }));
        }
        else{
			console.log('else ',resData);
            arr = resData.results.map((r) => ({ id:r.id, title: r.title, image: r.image }));
        }
    }

    return res.render('home',{
        title: "Home",
        arr: arr,
		c:user.favCusine,
		d:user.diet,
		t:user.type,
		i:user.foodAllergies,
		e:user.notIngredients,
		check:a
    });
	}catch(err){
		console.log(err.message);
		return res.render('home',{
			title: "Home",
			arr: [],
			check:a
		});
	}
}

module.exports.save = async function(req,res){

    let user=await User.findById(req.user._id);
	
    if (Object.keys(req.body).length === 0) {
        console.log("No options are selected");
        user.favCusine=null;
        user.foodAllergies=null;
        user.diet=null;
        user.type=null;
        user.notIngredients=null;
        await user.save();
        console.log("User is",user);
    }
    else{

        if(req.body.cuisine!=undefined){
            user.favCusine=req.body.cuisine;
        }else{
			 user.favCusine=null;
		}

        if(req.body.allergies!=undefined){
            user.foodAllergies=req.body.allergies;
        }else{
			user.foodAllergies=null;
		}

        if(req.body.diet!=undefined){
            user.diet=req.body.diet;
        }else{
			user.diet=null;
		}
        
        if(req.body.type!=undefined){
            user.type=req.body.type;
        }else{
			 user.type=null;
		}
        
	
        var noin="";
        
        for(let item in req.body){
            if(item=="ex1" || item=="ex2" ||item=="ex3" || item=="ex4" || item=="ex5" || item=="ex6"){
                noin+=req.body[item]+",";
            }
        }
        if(noin.length>0){
            noin=noin.slice(0,-1);
        }

        if(noin!=""){
            user.notIngredients = noin;
        }else{
			user.notIngredients=null;
		}
		
		user.option=true;
        await user.save();
        // console.log("user is",user);           
    }

    res.redirect('/'); 
}


module.exports.dessert=async function(req,res){
	fetch(`https://api.spoonacular.com/recipes/complexSearch?type=dessert&number=6&apiKey=${getApiKey()}&instructionsRequired=true`)
	.then(res=>res.json())
	.then(resData=>{
		if(!resData.results) return res.send({arr: []});
		const arr = resData.results.map((r) => ({ title: r.title, image: r.image, id: r.id}));
		return res.send({arr: arr })
	}).catch(err=>{
		console.log(err.message);
		return res.send({err: err.message })
	})	
}

module.exports.maincourse=async function(req,res){

	fetch(`https://api.spoonacular.com/recipes/complexSearch?type=maincourse&number=6&apiKey=${getApiKey()}&instructionsRequired=true`)
    .then(res=>res.json())
	.then(resData=>{
		if(!resData.results) return res.send({arr: []});
        const arr=resData.results.map((r) => ({ title: r.title, image: r.image, id: r.id }));
	    return res.send({arr: arr})
    }).catch(err=>{
		console.log(err.message);
		return res.send({err: err.message })
	})
}

module.exports.getSalad = async function(req,res){
	fetch(`https://api.spoonacular.com/recipes/complexSearch?type=salad&number=6&apiKey=${getApiKey()}&instructionsRequired=true`)
	.then(res=>res.json())
	.then(resData=>{
		if(!resData.results) return res.send({arr: []});
        const arr=resData.results.map((r) => ({ title: r.title, image: r.image, id: r.id }));
	    return res.send({arr: arr})
    }).catch(err=>{
		console.log(err.message);
		return res.send({err: err.message })
	})	
}

module.exports.getSnacks = async function(req, res){
	fetch(`https://api.spoonacular.com/recipes/complexSearch?type=snack&number=6&apiKey=${getApiKey()}&instructionsRequired=true`)
	.then(res=>res.json())
	.then(resData=>{
		if(!resData.results) return res.send({arr: []});
        const arr=resData.results.map((r) => ({ title: r.title, image: r.image, id: r.id }));
	    return res.send({arr: arr})
    }).catch(err=>{
		console.log(err.message);
		return res.send({err: err.message })
	})	
}

module.exports.getBeverage = async function(req,res){
	fetch(`https://api.spoonacular.com/recipes/complexSearch?type=drink&offset=3&number=6&apiKey=${getApiKey()}&instructionsRequired=true`)
	.then(res=>res.json())
	.then(resData=>{
		if(!resData.results) return res.send({arr: []});
        const arr=resData.results.map((r) => ({ title: r.title, image: r.image, id: r.id}));
	    return res.send({arr: arr})
    }).catch(err=>{
		console.log(err.message);
		return res.send({err: err.message })
	})
}