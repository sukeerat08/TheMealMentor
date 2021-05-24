var options={
  type: 'slider',
    perView: 4,
    breakpoints:{
      1000:{
        perView:3
      },
      450:{
        perView:2,
		    gap:2
      }
    }
}
var cuisine=new Glide('.cuisine',options);
var allergies=new Glide('.allergies',options);
var diet=new Glide('.diet',options);
var type=new Glide('.type',options);
var exclude=new Glide('.exclude',options);

cuisine.mount();
allergies.mount();
diet.mount();
type.mount();
exclude.mount();
