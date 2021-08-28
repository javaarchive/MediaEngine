
const Alexa = require("ask-sdk-core");
const alexautils = require("../alexautils");
const STATES = require("../states");
const lang = require("../lang");

const config = require("../config");
const generators = require("../generators");

let {loginCodeManager} = require("../accountsystem");


module.exports =  {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StartPlaybackSettings';
  },
  async handle(handlerInput) {
    try{
      let session = alexautils.getSession(handlerInput);
      session.state = STATES.CHANGING_SETTINGS;
      alexautils.saveSession(handlerInput, session);


      let resp = handlerInput.responseBuilder.speak("What setting would you like to change?").withSimpleCard().reprompt("Setting to change?");
      console.log(resp);
      return resp.getResponse();

    }catch(ex){
      console.log(ex);
    }
  }
};