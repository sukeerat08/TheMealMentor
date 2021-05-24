const generateOtp = ()=>{
	var str = '0123456789'; 
    let OTP = ''; 
    var len = str.length; 
    for (let i = 0; i < 5; i++ ) { 
        OTP += str[Math.floor(Math.random() * len)]; 
    } 
    return OTP; 
}

module.exports = {
	generateOtp
}