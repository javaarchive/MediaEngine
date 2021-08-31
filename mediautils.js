let alexautils = require("./alexautils");
let config = require("./config");

let mediautils = {
  createPrefixUrlForMediaStream: (stream, container) => {
    return config.selfURL + "/streams/" + alexautils.createTransfer({
      stream: stream,
      container: container,
      type: "v1stream"
    }) + "/media." + container;
  },
  createIndirectStreamURL(item,Backend,userConfig){
    let backendInst = new Backend();
    let token = alexautils.createTransfer({
      backendInst,
      item,
      type: "v2stream",
      userConfig: userConfig
    });
    return config.selfURL + "/streams_v2/" + token + "/media.mp4"; // extension tricks the player
  }
}
module.exports = mediautils;