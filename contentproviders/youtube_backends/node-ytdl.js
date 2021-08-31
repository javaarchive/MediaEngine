const ytdl = require("ytdl-core");

class YtdlCoreBackend{
  constructor(){
    
  }

  async loadItem(video){
    let videoID = video.id;
    // supports both urls and ids
    if(!(videoID.includes("youtube"))){
      videoID = "http://www.youtube.com/watch?v=" + videoID; 
    }
    this.vidinfo = await ytdl.getInfo(videoID);
  }

  createStream(userConfig){
    const audioonly = userConfig.preferedMediaForm == "audio";
    return {stream:ytdl.downloadFromInfo(this.vidinfo, {
      quality: audioonly?"highestaudio":"highest"
    }), container:ytdl.chooseFormat(this.vidinfo.formats, {quality: audioonly?"highestaudio":"highest"}).container};
  }

}

module.exports = YtdlCoreBackend;