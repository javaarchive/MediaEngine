
const mediautils = require("../mediautils");

class YoutubeContentProvider{
  constructor(config, userSpecificConfig){
    this.config = config;
    this.userConfig = userSpecificConfig;
  }

  loadBackend(name){
    if(!this.config.enabledYouTubeModes.includes(name)){
      console.warn("User using backend that is now disabled, loading default instead");
      return require("./youtube_backends/" + this.config.defaults.ytMode);
    }
    return require("./youtube_backends/" + name);
  }

  loadSearcher(name){
    if(!this.config.enabledYouTubeModes.includes(name)){
      console.warn("User using searcher that is now disabled, loading default instead");
      return require("./youtube_searchers/" + this.config.defaults.ytMode);
    }
    return require("./youtube_searchers/" + name);
  }

  async search(query, opts){
    let Searcher = this.loadSearcher(this.userConfig.ytSearchMode);
    let searcherInst = new Searcher();
    console.log("Querying",query,"with opts",opts);
    return (await searcherInst.search(query, opts));
  }

  async generatePlaybackResponse(handlerInput, item){
    if(item.resultType == "mediaitem"){
      let Backend = this.loadBackend(this.userConfig.ytMode); 
      if(item.type == "video"){
        let backend = new Backend();
        await backend.loadItem(item);
        if(this.userConfig.prefersDirectStreams){
          throw "Not Implemented";
        }else{
          let [generatedStream,container] = await backend.createStream(this.userConfig.prefferedMediaForm == "audio");
          let generatedURL = await mediautils.createPrefixUrlForMediaStream(generatedStream, container);
          return handlerInput.responseBuilder.speak("Playing").addAudioPlayerPlayDirective("REPLACE_ALL",generatedURL,item.id,0);
        }
      }
    }else{
      throw "Unsupported result type"
    }
  }

}

module.exports = YoutubeContentProvider;