const ytdl = require("ytdl-core");
const config = require("../../config");

const fetch = require("node-fetch");

class YtdlCoreBackend{
  constructor(){
    
  }

  pickInstance(){
    // TODO: Assign each instance a reputation and decrease reputation for bad results and use reputation as weights
    // for now I am just too lazy

    return config.invidiousInstances[Math.floor(Math.random() * config.invidiousInstances.length)]; 
  }

  async loadItem(video){
    // wat
    try{
      this.vid = ytdl.getVideoID(video.id);
    }catch(ex){
      this.vid = video.id;
    }
  }

  async createStream(userConfig){
    const audioonly = userConfig.preferedMediaForm == "audio";
    const resp = await fetch((this.pickInstance() + "/latest_version?id=" + this.vid + "&itag=" + (audioonly?251:22)),{
      headers:{
        "User-Agent": config.apiUserAgent
      }
    });
    

    return {stream:resp.body,container:(audioonly?"m4a":"mp4")};
  }

  async createURL(userConfig){
    const audioonly = userConfig.preferedMediaForm == "audio";
    let generatedURL = (this.pickInstance() + "/latest_version?id=" + this.vid + "&itag=" + (audioonly?251:22));
    console.log("Generated URL",generatedURL);
    return generatedURL;
  }

}

module.exports = YtdlCoreBackend;