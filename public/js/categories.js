var dessertContainer = $('.dessert');
var snacksContainer = $('.snacks');
var drinksContainer = $('.drinks');
var saladContainer = $('.salads');
var mainContainer = $('.main-course');

const getData = async function(){
	
    const main_course=await fetch('/getmaincourse');
	const resData2=await main_course.json();
    console.log("main array is",resData2);
	const a2=resData2.arr.map((r) => ({ title: r.title, image: r.image, id: r.id}));

    a2.forEach(c=>{
        let card=makeCard(c);
        mainContainer.append(card);
	})
	
	const dessert=await fetch('/getdessert');
	const resData1=await dessert.json();
    console.log("dessert is",resData1);
	const a1=resData1.arr.map((r) => ({ title: r.title, image: r.image, id: r.id }));
	
	a1.forEach(c=>{
        let card=makeCard(c);
        dessertContainer.append(card);
    })
	
    const salad=await fetch('/getsalad');
	const resData3=await salad.json();
	const a3=resData3.arr.map((r) => ({ title: r.title, image: r.image, id: r.id}));

    a3.forEach(c=>{
        let card=makeCard(c);
        saladContainer.append(card);
	})
	
    const snacks=await fetch('/getsnacks');
	const resData4=await snacks.json();
	const a4=resData4.arr.map((r) => ({ title: r.title, image: r.image, id: r.id }));
    
	a4.forEach(c=>{
        let card=makeCard(c);
        snacksContainer.append(card);
	})
	
	const beverages = await fetch('/getbeverage');
	const resData5 = await beverages.json();
	const a5 = resData5.arr.map((r) => ({ title: r.title, image: r.image, id: r.id }));

	a5.forEach(c=>{
        let card=makeCard(c);
        drinksContainer.append(card);
	})
}

function makeCard(card){

    return $(`<div>
    <article class="card card--1">
    <button class="btn-floating pulse cardLike" onclick="favoriteHandler('${card.id}','${card.title}','${card.image}')">
		<i class="material-icons fav-icon" id="${card.id}">${favRecipes.includes(card.id.toString()) ?  'favorite' : 'favorite_border' }</i>
	</button>
	<a href="/show/${card.id}" class="card_link">
    <div class="card__img" style="background-image: url('${card.image}');"> </div>
        <div class="card__img--hover" style="background-image: url('${card.image}');"> </div> 
        <div class="card__info">
        	<p class="card__title">${card.title}</p>
        </div>
	</a>
    </article>
    </div>
`)

}

getData();

const favoriteHandler = (id, title, image)=>{
	if(!id || !title || !image) return;
	fetch(`/handleFavorites?id=${id}&title=${title}&image=${image}`).then(res=>res.json())
	.then(data=>{
		if(data.err){
			M.toast({html: `<span> ${data.err} </span>`, classes: 'rounded deep-orange darken-3'})	
		}
		if(data.message){
			if(data.code == 1){
				document.getElementById(`${id}`).innerText = 'favorite';
				M.toast({html: `<span> ${data.message} </span>`, classes: 'rounded orange darken-4'})
			}else{
				document.getElementById(`${id}`).innerText = 'favorite_border';
				M.toast({html: `<span> ${data.message} </span>`, classes: 'rounded orange darken-4'})
			}
		}
	}).catch(err=>{
		console.log(err.message);
		M.toast({html: `<span> ${err.message} </span>`, classes: 'rounded deep-orange darken-3'})	
	})
}