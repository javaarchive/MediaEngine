
const Alexa = require("ask-sdk-core");
const alexautils = require("../alexautils");
const STATES = require("../states");
const config = require("../config");
const generators = require("../generators");

let {loginCodeManager} = require("../accountsystem");


module.exports =  {
  canHandle(handlerInput) {
    let session = alexautils.getSession(handlerInput);
    return session.state == STATES.MENU && Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GenerateLoginCode';
  },
  async handle(handlerInput) {
    try{
      let newLoginCode = null;
      let newLoginCodeIsGood = false;
      while(!newLoginCodeIsGood){
        newLoginCode = generators.genLoginCode();
        newLoginCodeIsGood = !(await loginCodeManager.hasCode(newLoginCode));
      }
      await loginCodeManager.storeLoginCode(newLoginCode,Alexa.getUserId(handlerInput.requestEnvelope));

      return handlerInput.responseBuilder
        .speak("Your code is " + newLoginCode + ". Go to https://bit.ly/mediaskill to access the web interface. This login code will expire in a few minutes. Again your code is " + newLoginCode)
        .withSimpleCard('Login Code Generated ', "Someone has generated a code to login to the web interface. Code is " + newLoginCode)
        .getResponse();
    }catch(ex){
      console.log(ex);
    }
  }
};