const translations = require("./translations.json");
const Alexa = require("ask-sdk-core");

module.exports = {
  createLanguageInstance: function(handerInput){
    return {
      "__": function(key){
        return  translations["en"][key] || key;
      }
    }
  }
}