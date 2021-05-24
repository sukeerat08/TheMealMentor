const container = document.querySelector(".page-content");

let limit = 9;
let pageCount = 0;

console.log(currOptions, random, favRecipes);

const getPost = async () => {
    const res = await fetch('/recipes-pagination',{
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			url: random ? 'recipes/random' : 'recipes/complexSearch',
			limit: limit,
			offset: pageCount,
			custom: random,
			options: currOptions
		})
	});
    const data = await res.json();
	console.log(data);
    data.recipes.map((card,index)=>{
        const htmlData = `
        	<div> 
			<article class="card card--1">
			<button onclick="favoriteHandler('${card.id}','${card.title}','${card.image}')" class="btn-floating pulse cardLike">
				<i class="material-icons fav-icon" id="${card.id}"> ${favRecipes.includes(card.id.toString()) ?  'favorite' : 'favorite_border' } </i>
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
        `;

        container.insertAdjacentHTML("beforeend", htmlData);
    })
}
getPost();
const showData = ()=>{
    setTimeout(()=>{
        pageCount = pageCount+limit;
        getPost();
    },500);
}

window.addEventListener('scroll', ()=>{
    const {scrollHeight, scrollTop , clientHeight} = document.documentElement;

    if((scrollTop + clientHeight)+1 > scrollHeight)
    {
        console.log("new page fired");
        showData();
    }
})

const favoriteHandler = (id, title, image)=>{
	// console.log(id, title, image);
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