const secureRand = require("secure-random");

module.exports = {
  genLoginCode: function(){
    let arr = secureRand(2, {type: 'Uint8Array'});
    return (arr[0]%(64)) * 256 + arr[1];
  },
  genRandomBackground: () => {
    return "https://picsum.photos/1920/1080/?blur=2";
  }
}