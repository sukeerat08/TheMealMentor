var favcontainer=$('.fav-cards');

const getCards=async function(){
	const favcards=await fetch('/getUserFavorites');
	let res=await favcards.json();
	if(res.err){
		M.toast({html: `<span> ${res.err} </span>`, classes: 'rounded deep-orange darken-3'})	
	}
	const arr= res.myFavrecipes;
	if(arr.length===0){
		favcontainer.html(`<h5>You don't have any favoutites yet, Start adding them :)</h5>`);
	}else{
			arr.forEach(item=>{
			let card=makeCard(item);
			favcontainer.append(card);
			})
	}
	
}

function makeCard(card){
    return $(`<div id="${card._id}">
    <article class="card card--1">
    <button class="btn-floating pulse cardLike" onclick="favoriteHandler('${card._id}','${card.id}','${card.title}','${card.image}')">
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

getCards();

const favoriteHandler = (_id, id, title, image)=>{
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
				// remove card
				document.getElementById(`${id}`).innerText = 'favorite_border';
				M.toast({html: `<span> ${data.message} </span>`, classes: 'rounded orange darken-4'})
				document.getElementById(`${_id}`).remove();
			}
		}
	}).catch(err=>{
		console.log(err.message);
		M.toast({html: `<span> ${err.message} </span>`, classes: 'rounded deep-orange darken-3'})	
	})
}