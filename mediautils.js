let alexautils = require("./alexautils");
let config = require("./config");

module.exports = {
  createPrefixUrlForMediaStream(stream, container){
    return config.selfURL + "/streams/" + alexautils.createTransfer({
      stream: stream,
      container: container
    }) + "/media." + container;
  }
}