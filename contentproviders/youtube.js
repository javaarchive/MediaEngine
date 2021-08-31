
const mediautils = require("../mediautils");
const alexautils = require("../alexautils");
const generators = require("../generators");

const config = require("../config");


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
        if(this.userConfig.prefersDirectStreams){
          let backend = new Backend();
          await backend.loadItem(item);
          let generatedURL = await backend.createURL(this.userConfig);
          if(this.userConfig.preferedMediaForm == "audio"){
            return handlerInput.responseBuilder.speak("Playing").addAudioPlayerPlayDirective("REPLACE_ALL",generatedURL,item.id,0,null,{
              title: item.title || "Unknown Item",
              subtitle: item.producer || config.brand,
              art:{
                sources:[
                  {
                    url:generators.genBackground()
                  }
                ]
              },
              backgroundImage:{
                sources:[
                  {
                    url: item.thumbnail || generators.genAlbumFallback()
                  }
                ]
              }
            });
          }else if(this.userConfig.preferedMediaForm == "video"){
            return handlerInput.responseBuilder.speak("Playing").addVideoAppLaunchDirective(generatedURL,item.title || "Unknown Item",config.brand || item.producer);
          }
        }else{
          console.log("Generating url");
          let generatedURL = await mediautils.createIndirectStreamURL(item, Backend, this.userConfig);
          console.log("uconfig",this.userConfig);
          if(this.userConfig.preferedMediaForm == "audio"){
            return handlerInput.responseBuilder.speak("Playing").addAudioPlayerPlayDirective("REPLACE_ALL",generatedURL,item.id,0,null,{
              title: item.title || "Unknown Item",
              subtitle: item.producer || config.brand,
              art:{
                sources:[
                  {
                    url:generators.genBackground()
                  }
                ]
              },
              backgroundImage:{
                sources:[
                  {
                    url: item.thumbnail || generators.genAlbumFallback()
                  }
                ]
              }
            });
          }else if(this.userConfig.preferedMediaForm == "video"){
            return handlerInput.responseBuilder.speak("Playing").addVideoAppLaunchDirective(generatedURL,item.title || "Unknown Item",config.brand || item.producer);
          }
        }
      }
    }else{
      throw "Unsupported result type"
    }
  }

}

module.exports = YoutubeContentProvider;