const secureRand = require("secure-random");

module.exports = {
  genLoginCode: function(){
    let arr = secureRand(2, {type: 'Uint8Array'});
    return arr[0] * 256 + arr[1];
  }
}