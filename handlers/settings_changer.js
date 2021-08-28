
const Alexa = require("ask-sdk-core");
const alexautils = require("../alexautils");
const STATES = require("../states");

const config = require("../config");
const generators = require("../generators");

let {loginCodeManager, Account} = require("../accountsystem");


module.exports =  {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChangeSettingIntent';
  },
  async handle(handlerInput) {
    try{
      console.log(alexautils.getSlots(handlerInput));
      //console.log(JSON.stringify(handlerInput.requestEnvelope.request.intent.slots, null, 4));

      let slots = alexautils.getSlots(handlerInput);
      let settingID = alexautils.getSlotValueID(slots.setting);
      let acc = await Account.getFromID(Alexa.getUserId(handlerInput.requestEnvelope));
      


      let session = alexautils.getSession(handlerInput);
      session.state = STATES.MENU;
      alexautils.saveSession(handlerInput, session);


      let resp = handlerInput.responseBuilder.speak("Setting Change Applied.").withSimpleCard("Setting Change applied","You just changed the value of \"" + slots.setting.value + "\" to " + slots.value.value).reprompt("Next Command?");
      console.log(resp);
      return resp.getResponse();

    }catch(ex){
      console.log(ex);
    }
  }
};