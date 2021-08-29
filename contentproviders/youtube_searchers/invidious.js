const config = require("../../config");
const fetch = require("node-fetch");

const mediaTypesToInvidiousTerminology = {
  "any": "all",
  "mediaitem": "video",
  "collection": "all" // both playlist and channel equate to a collection so "all" is used and then filtered
}

class InvidiousSearch{
  pickInstance(){
    // TODO: Assign each instance a reputation and decrease reputation for bad results and use reputation as weights
    // for now I am just too lazy

    return config.invidiousInstances[Math.floor(Math.random() * config.invidiousInstances.length)]; 
  }
  async search(query,opts){
    let instanceBaseURL = this.pickInstance();
    let searchResp = await fetch(instanceBaseURL + "/api/v1/search?q=" + encodeURIComponent(query) + "&type=" + mediaTypesToInvidiousTerminology[opts.type || "any"],{
      "User-Agent": config.apiUserAgent
    });
    if(!resp.ok){
      throw instanceBaseURL + " gave us a " + res.status + " while searching";
    }
    let results = await searchResp.json();
    if(opts.type == "collection"){
      results = results.filter(item => {
        return item.type == "playlist" || item.type == "channel";
      });
    }
    results = results.map(item => {
      // Standardlize the item,
      if(item.type == "channel"){
        item.title = item.author+"'s channel" // add title
      }
      if(item.type == "channel" || item.type == "playlist"){
        item.resultType = "collection"
      }else if(item.type == "video"){
        item.resultType = "mediaitem";
      }
    });
    return results;
  }
}

module.exports = InvidiousSearch