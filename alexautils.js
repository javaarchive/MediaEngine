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
  }
}