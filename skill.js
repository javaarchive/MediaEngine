const Alexa = require("ask-sdk-core");
const fs = require("fs");
const path = require("path");

let curSkill = null;
let handlersList = fs.readdirSync(path.join(__dirname,"handlers")).map(filename => {
  return "./handlers/" + filename.slice(0, filename.length - 3); // trim the ".js"
}).map(require);

function build(){
  if(!curSkill){
    // Construct
    curSkill = Alexa.SkillBuilders.custom().addRequestHandlers(...handlersList).addErrorHandler(require("./errorhandler")).create();
    return curSkill;
  }
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