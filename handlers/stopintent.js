const config = require("../config");
const Alexa = require("ask-sdk-core");
const alexautils = require("../alexautils");
const STATES = require("../states");


module.exports = {
    canHandle(handlerInput) {
        let intent = null;
        if((handlerInput.requestEnvelope) === 'IntentRequest'){
          intent = Alexa.getIntentName(handlerInput.requestEnvelope);
        }
        console.log("Stopintent handling check", Alexa.getRequestType(handlerInput.requestEnvelope), intent);
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest' || Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (intent === 'AMAZON.CancelIntent'
                || intent === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
     //  console.log("Running StopIntent");
        const speakOutput = "Thanks for using " + config.brand + "!";
        if(Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest'){
          return handlerInput.responseBuilder.getResponse();
        }
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};