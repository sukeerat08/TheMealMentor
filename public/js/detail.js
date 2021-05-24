var parser = new DOMParser();
var doc = parser.parseFromString(summary, 'text/html');
document.getElementById('summary-text').innerHTML = doc.body.innerText;

const taste = document.getElementById('tasteGraph');
const nutrients1 = document.getElementById('nutrientsGraph1');
const nutrients2 = document.getElementById('nutrientsGraph2');
const price = document.getElementById('priceGraph');

// console.log(collaps);

const getNutrientsGraph = async function(){
	const res = await fetch('/getnutrientsgraph/'+id);
	const resData = await res.json();
	// console.log(resData);
	const goodLabels = [], badLabels = [];
	const goodData = [], badData = [];
	for(let it of resData.nutrients.good){
		goodLabels.push(it.title);
		goodData.push(it.percentOfDailyNeeds);
	}
	for(let it of resData.nutrients.bad){
		badLabels.push(it.title);
		badData.push(it.percentOfDailyNeeds);
	}

	const data1 = {
	  labels: badLabels,
	  datasets: [{
		label: 'Limit These (fulfils %age of daily need)',
		data: badData,
		backgroundColor: ['#ef5350'],
		borderColor: ['#c62828'],
		borderWidth: 1,
		hoverBackgroundColor: '#e53935',
		hoverBorderRadius: 5,
		  offset: true
	  }]
	};
	const config1 = {
	  type: 'bar',
	  data: data1,
	  options: {
		indexAxis: 'y',
		maintainAspectRatio: false,
	  },
	};
	new Chart(nutrients1, config1);
	const data2 = {
	  labels: goodLabels,
	  datasets: [{
		label: 'Get Enough of These (fulfils %age of daily need)',
		data: goodData,
		backgroundColor: ['#00acc1'],
		borderColor: ['#0277bd'],
		borderWidth: 1,
		hoverBackgroundColor: '#00897b',
		hoverBorderRadius: 5,
		  offset: true
	  }]
	};
	const config2 = {
	  type: 'bar',
	  data: data2,
	  options: {
		indexAxis: 'y',
		maintainAspectRatio: false,
	  },
	};
	
	new Chart(nutrients2, config2);
	
	const nutriTags = document.getElementById('nutrientsTags');
	const printData = [...resData.nutrients.good.map(it=>({title: it.title, amount: it.amount})), ...resData.nutrients.bad.map(it=>({title: it.title, amount: it.amount}))];
	const htmlData = printData.forEach(it=>{
		nutriTags.insertAdjacentHTML('beforeend', `<div class="chip">
			${it.title} -> ${it.amount}
		</div>`);
	})
}
const getTasteGraph = async function(){
	const res = await fetch('/gettastegraph/'+id);
	const resData = await res.json();
	let labels = [];
	let d = [];
	for(let key in resData.taste){
		labels.push(key);
		d.push(resData.taste[key]);
	}
	
	const data = {
	  labels: labels,
	  datasets: [{
		label: 'Taste Analysis',
		data: d,
		fill: true,
		backgroundColor: '#ffcc80',
		borderColor: '#ffa726',
		pointBackgroundColor: '#fb8c00',
		pointBorderColor: '#ffa726',
		pointHoverBackgroundColor: '#fff',
		pointHoverBorderColor: '#ffa726',
		pointHoverBorderWidth: 2,
		pointHoverRadius: 5
	  }]
	};
	const config = {
	  type: 'radar',
	  data: data,
	  options: {
		elements: {
		  line: {
			borderWidth: 3
		  }
		},
		
	  }
	};
	
	new Chart(taste, config);
}

const getPriceGraph = async function(){
	const res = await fetch('/getpricegraph/'+id);
	const resData = await res.json();
	let labels = [], d=[], colors = [];
	for(let it of resData.price.ingredients){
		labels.push(it.amount.metric.value+' '+it.amount.metric.unit+'  '+it.name);
		d.push(it.price);
		colors.push(random_rgba());
	}
	const data = {
	  labels: labels,
	  datasets: [{
		label: 'Price Breakdown (in $)',
		data: d,
		backgroundColor: colors,
		hoverOffset: 5
	  }]
	};
	
	const config = {
	  type: 'doughnut',
	  data: data,
	  options: {
	    maintainAspectRatio: true
	  }
	};
	new Chart(price, config);
	
	document.querySelector('.totalPrice').innerHTML = `<span class='chip'>Total Cost Per Serving: ${resData.price.totalCostPerServing}$</span> <span class='chip'>Total Cost: ${resData.price.totalCost}$</span>`
}

getPriceGraph();
getTasteGraph();
getNutrientsGraph();

function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}


const favoriteHandler = (id, title, image)=>{
	fetch(`/handleFavorites?id=${id}&title=${title}&image=${image}`).then(res=>res.json())
	.then(data=>{
		if(data.err){
			M.toast({html: `<span> ${data.err} </span>`, classes: 'rounded deep-orange darken-3'})	
		}
		if(data.message){
			if(data.code == 1){
				document.querySelector('.fav-icon').innerText = 'favorite';
				M.toast({html: `<span> ${data.message} </span>`, classes: 'rounded orange darken-4'})
			}else{
				document.querySelector('.fav-icon').innerText = 'favorite_border';
				M.toast({html: `<span> ${data.message} </span>`, classes: 'rounded orange darken-4'})
			}
		}
	}).catch(err=>{
		M.toast({html: `<span> ${err.message} </span>`, classes: 'rounded deep-orange darken-3'})	
	})
}