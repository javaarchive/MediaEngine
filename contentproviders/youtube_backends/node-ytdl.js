const ytdl = require("ytdl-core");

class YtdlCoreBackend{
  constructor(){
    
  }

  async loadItem(videoID){
    // supports both urls and ids
    if(!(videoID.includes("youtube"))){
      videoID = "http://www.youtube.com/watch?v=" + videoID; 
    }
    this.vidinfo = await ytdl.getInfo(videoID);
  }

  createStream(audioonly = false){
    return [ytdl.downloadFromInfo(this.vidinfo, {
      quality: "highestaudio"
    }), ytdl.chooseFormat(this.vidinfo.formats, {quality: "highestaudio"}).container];
  }

}

module.exports = YtdlCoreBackend;