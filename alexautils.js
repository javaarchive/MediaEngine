const {nanoid} = require("nanoid");

let accountTokens = new Map(); // one time tokens that refer to an account on the web interface
let dataTransferBus = new Map();

module.exports = {
  getSession: function (handlerInput){
    return handlerInput.attributesManager.getSessionAttributes();
  },
  saveSession: function (handlerInput, attributes){
    handlerInput.attributesManager.setSessionAttributes(handlerInput,attributes)
  },
  getSlots: function(handlerInput){
    return handlerInput.requestEnvelope.request.intent.slots;
  },
  getSlotValueID: function(slot){
    try{
      return slot.resolutions.resolutionsPerAuthority.filter(resolution => {
        return resolution.status && resolution.status.code && resolution.status.code == "ER_SUCCESS_MATCH";
      })[0]["values"][0]["value"]["id"];
    }catch(ex){
      throw "No successful matches found";
    }
  },
  storeAccount: (acc) => {
    let tok = nanoid();
    while(accountTokens.has(tok)){
      tok = nanoid();
    }
    accountTokens.set(tok,acc);
  },
  retrieveAccount: (tok) => {
    if(accountTokens.has(tok)){
      let acc = accountTokens.get(tok);
      accountTokens.delete(tok);
      return acc;
    }else{
      return null;
    }
  },
  createTransfer: (data) => {
    let tok = nanoid();
    while(dataTransferBus.has(tok)){
      tok = nanoid();
    }
    dataTransferBus.set(tok,data);
    return;
  },

  getTransfer: (tok) => {
   if(dataTransferBus.has(tok)){
      let acc = dataTransferBus.get(tok);
      dataTransferBus.delete(tok);
      return acc;
    }else{
      return null;
    }
  },
  peekTransfer: (tok) => {
   if(dataTransferBus.has(tok)){
      let acc = dataTransferBus.get(tok);
      return acc;
    }else{
      return null;
    }
  }
}