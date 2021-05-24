exports.getApiKey = function (){
	const keyArr = process.env.API_KEYS.toString().split(',');
	const ind = Math.floor(Math.random()*keyArr.length);
	const key = keyArr[ind];
	return key;
}