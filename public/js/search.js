const container = document.querySelector(".recipe");
const st = document.querySelector('.searchTags');

let limit = 9;
let pageCount = 0;
let searchQuery = '';
let opts = [];

const searchHandler = async ()=>{
	const value = document.getElementById('autocomplete-input').value;
	searchQuery = value;
	if(!searchQuery) return;
	opts = opts.filter(opt=>opt.key!=='query');
	opts.push({key: 'query', value: searchQuery});
	container.innerHTML = '';
	getPost();
}

const getPost = async () => {
	if(!searchQuery) return;
	console.log('trigger request', opts);
    const res = await fetch('/recipes-pagination',{
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			url: 'recipes/complexSearch',
			limit: limit,
			offset: pageCount,
			options: opts
		})
	});
    const data = await res.json();
	console.log(data);
	console.log(!data.recipes || data.recipes.length===0);
	if(!data.recipes || data.recipes.length===0){
		M.toast({html: '<span><i class="material-icons">error</i> Sorry No Result Found. </span>', classes: 'rounded  teal darken-1'})
		return;
	}
    data.recipes.forEach(card=>{
        const htmlData = `<div>
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
			</div>`;

        container.insertAdjacentHTML("beforeend", htmlData);
    })
}

const sf = document.querySelectorAll('.switch-filter');
sf.forEach(f=>{
	f.addEventListener('change',(e)=>{
		// console.log(e);
		if(e.target.checked){
			opts.push({key: e.target.name, value: e.target.defaultValue})
			st.insertAdjacentHTML("beforeend", `<div class="chip" id="${e.target.value}"> ${e.target.name} - ${e.target.value} * </div>`);
		}else{
			opts = opts.filter((opt=>opt.value !== e.target.value));
			document.getElementById(e.target.value).remove();
		}
	})
})
const rf = document.querySelectorAll('.range-filter');
rf.forEach(f=>{
	f.addEventListener('change',(e)=>{
		// console.log(e);
		let ind = opts.findIndex(opt=>opt.key === e.target.name);
		if(ind>=0){
			opts[ind].value = e.target.value;
			document.getElementById(e.target.name).remove();
			st.insertAdjacentHTML("beforeend", `<div class="chip" id="${e.target.name}"> ${e.target.name} - ${e.target.value} * </div>`);
		}else{
			opts.push({key: e.target.name, value: e.target.value})
			st.insertAdjacentHTML("beforeend", `<div class="chip" id="${e.target.name}"> ${e.target.name} - ${e.target.value} * </div>`);
		}
	})
})

const showData = ()=>{
    pageCount = pageCount+limit;
    getPost();
}

window.addEventListener('scroll', ()=>{
    const {scrollHeight, scrollTop , clientHeight} = document.documentElement;

    if((scrollTop + clientHeight)+1 > scrollHeight){
        // console.log("new page fired");
        showData();
    }
})

acInput.addEventListener('input', function (e) {
	e.preventDefault();
	let input = e.target.value;
	if (input === '') return;
	if (timer) clearTimeout(timer);
	timer = setTimeout(() => {
		fetch('/get-autocomplete-suggestions?input=' + input)
		.then((res) => res.json())
		.then((resData) => {
			if (resData.err) {
				console.log(resData.err);
				return;
			}
			let newData = {};
			resData.results.forEach((it) => {
				newData[it.title] = null;
			});
			console.log(newData);
			acInstance.updateData(newData);
			acInstance.open();
		})
		.catch((err) => {
			console.log(err.message);
		});
	}, 800);
});


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