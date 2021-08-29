


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
    let Searcher = loadSearcher(this.userConfig.ytSearchMode);
    let searcherInst = new Searcher();
    await searcherInst.search(query, opts);
  }

  async generatePlaybackResponse(handlerInput, item){
    if(item.resultType == "mediaitem"){
      let backend = 
      if(item.type == "video"){
        if(userSpecificConfig.prefersDirectStreams){
          
        }else{

        }
      }
    }else{
      throw "Unsupported result type"
    }
  }

}

module.exports = YoutubeContentProvider;