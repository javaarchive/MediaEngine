const Alexa = require("ask-sdk-core");

console.log("Loaded Error handler");

module.exports = {
  canHandle(handlerInput, error) {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error Occured: ${error.message}`);
    return handlerInput.responseBuilder
      .speak('An error occured: ' + error)
      .getResponse();
  }
};