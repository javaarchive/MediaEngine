
const Alexa = require("ask-sdk-core");
const config = require("../config");

module.exports =  {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak("Welcome to " + config.brand + ". To get information on how to use the skill, say help.")
      .reprompt("What would you like to do?")
      .withSimpleCard('Welcome to Media Engine. ', config.brand + " has already created an account for you to store preferences. ")
      .getResponse();
  }
};