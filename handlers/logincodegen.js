
const Alexa = require("ask-sdk-core");
const config = require("../config");
const generators = require("../generators");

let {loginCodeManager} = require("../accountsystem");


module.exports =  {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GenerateLoginCode';
  },
  async handle(handlerInput) {
    let newLoginCode = null;
    let newLoginCodeIsGood = false;
    while(!newLoginCodeIsGood){
      newLoginCode = generators.genLoginCode();
      newLoginCodeIsGood = !(await loginCodeManager.hasCode(newLoginCode));
    }
    await loginCodeManager.storeLoginCode(newLoginCode,Alexa.getUserId(handlerInput));

    return handlerInput.responseBuilder
      .speak("Your code is " + newLoginCode + ". Go to https://bit.ly/mediaskill to access the web interface. This login code will expire in a few minutes. ")
      .withSimpleCard('Login Code Generated ', "Someone has generated a code to login to the web interface. Code is " + newLoginCode)
      .getResponse();
  }
};