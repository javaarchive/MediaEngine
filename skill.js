const Alexa = require("ask-sdk-core");
const fs = require("fs");
const path = require("path");

let curSkill = null;
let handlersList = fs.readdirSync(path.join(__dirname,"handlers")).map(filename => {
  return "./handlers/" + filename.slice(0, filename.length - 3); // trim the ".js"
});
console.log("Loading handlers",handlersList.join(","));
handlersList = handlersList.map(require).map(handler => {
  // patch handler to support error catching
  // because errorhandler doesn't always work

  let origHandle = handler.handle;
  handler.handle = async (handlerInput) => {
    console.log("Invoke handle");
    try{
      return (await origHandle(handlerInput));
    }catch(ex){
      console.log("Handling error",ex);
      return handlerInput.responseBuilder.speak("An Error Occured").getResponse();
    }
  }

  let origCanHandle = handler.canHandle;
  handler.canHandle = (handlerInput) => {
    console.log("Invoke canHandle");
    return origCanHandle(handlerInput);
  };

  // console.log("Handler Keys", Object.keys(handler));
  return handler;
});

function build(){
  if(!curSkill){
    // Construct
    curSkill = Alexa.SkillBuilders.custom().addRequestHandlers(...handlersList).addErrorHandler(require("./errorhandler")).create();
    console.log("Created skill",curSkill);
    return curSkill;
  }
  return curSkill;
}

let handler = async function (event, ctx){
  console.log(req,event);
  if(!curSkill){
    // Construct
    build();
  }
  const resp = await skill.invoke(event, context);
  console.log("Resp",resp);

  return response;
}

module.exports = {skill: curSkill, handler: handler, build: build};