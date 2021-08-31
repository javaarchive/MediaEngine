
const Alexa = require("ask-sdk-core");
const alexautils = require("../alexautils");
const STATES = require("../states");
const lang = require("../lang");

const config = require("../config");
const generators = require("../generators");

let {loginCodeManager, Account} = require("../accountsystem");


module.exports =  {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlaySingleMediaItemIntent';
  },
  handle: async (handlerInput) => {
    try{
      let session = alexautils.getSession(handlerInput);
      session.state = STATES.MENU;
      alexautils.saveSession(handlerInput, session);

      let acc = await Account.getFromID(Alexa.getUserId(handlerInput.requestEnvelope));
      let provider = await acc.getContentProvider();
      // console.log(provider);
      let searchResults = await provider.search(alexautils.getSlots(handlerInput).name.value, {type: "mediaitem"});
      console.log("Got", searchResults.length, "results");
      let mediaItem = searchResults[0];
      let playbackResponse = await provider.generatePlaybackResponse(handlerInput, mediaItem);
      console.log("pr",playbackResponse);
      return playbackResponse.getResponse();
    }catch(ex){
      console.log(ex);
    }
  }
};