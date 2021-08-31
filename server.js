// Main Code Entrypoint
console.log("Loading...");
// not allowed in repl but useful for other environments
require("dotenv").config();

const path = require("path");

const express = require("express");

const morgan = require("morgan");

const app = express();

const rateLimit = require("express-rate-limit");

const { loginCodeManager, Account } = require("./accountsystem");

const frontendMeta = require("./frontend/meta.json");

const alexautils = require("./alexautils");

const CONSTANTS = require("./constants");


app.use(morgan('dev'));

const { ExpressAdapter } = require("ask-sdk-express-adapter");

// one liner for now
const skill = require("./skill").build();
/*app.get('/', (req,res) => {
  res.send("Hello!");
});*/

let api = express.Router()
api.use(rateLimit({
  windowMs: 60 * 1000,
  max: 10
}));

app.get("/streams/:token/:suffix", (req,res) => {
  if(req.params.token && alexautils.peekTransfer(req.params.token) && alexautils.peekTransfer(req.params.token).type === "v1stream"){
    let streamDetails = alexautils.getTransfer(req.params.token);
    res.set("Content-Type", CONSTANTS.mimetypes["." + streamDetails["container"]]);
    streamDetails.stream.pipe(res);
  }else{
    res.sendStatus(404);
    res.send("No stream found");
  }
});


app.get("/streams_v2/:token/:suffix", async (req,res) => {
  if(req.params.token && alexautils.peekTransfer(req.params.token) && alexautils.peekTransfer(req.params.token).type == "v2stream"){
    let actionDetails = alexautils.peekTransfer(req.params.token);
    let item = actionDetails.item;
    let backend = actionDetails.backendInst;
    let userConfig = actionDetails.userConfig;
    let streamDetails;
    if(actionDetails.cachedStreamDetails){
      streamDetails = actionDetails.cachedStreamDetails;
    }else{
      await backend.loadItem(item);
      streamDetails = await backend.createStream(userConfig);
      actionDetails.cachedStreamDetails = streamDetails;
    }
    let stream = streamDetails.stream;
    // console.log(streamDetails);
    res.set("Content-Type", CONSTANTS.mimetypes["." + streamDetails["container"]]);
    stream.pipe(res);
    if(userConfig.preferedMediaForm == "audio"){
      alexautils.getTransfer(req.params.token); // remove
    }
  }else{
    res.sendStatus(404);
    // res.send("No stream found");
  }
})

api.get('/logincode/:code', async (req, res) => {
  if (!req.params.code || !parseInt(req.params.code)) {
    res.json({
      ok: false,
      message: "No code specified"
    });
    return;
  }
  if (await loginCodeManager.hasCode(req.params.code)) {
    res.json({
      ok: true,
      uid: (await loginCodeManager.getUserForCode(req.params.code))
    })
  } else {
    res.json({
      ok: false,
      message: "Code is not valid"
    });
  }
});

app.use('/api', api);

let adapter = new ExpressAdapter(skill, true, true);
// app.post('/',(req,res) => {res.json({})})

app.use(express.static(path.join(__dirname, "frontend/static")));

if(frontendMeta.type == "spa"){
  frontendMeta.paths.forEach(path => {
    app.get(path, (req,res) => {
      res.sendFile("frontend/views/main.html",{root:__dirname});
    });
  })
}

// Debug adapter
/*const { SkillRequestSignatureVerifier, TimestampVerifier } = require('ask-sdk-express-adapter');

app.post('/',async (req,res) => {
    console.log(typeof req.body);
    await new SkillRequestSignatureVerifier().verify(req.body, req.headers);
    await new TimestampVerifier().verify(req.body);
    res.json(skill.invoke(JSON.parse(req.body)));
});*/

app.post('/', adapter.getRequestHandlers());

app.listen(3000); // repl is smart enough to automatically switch to the port the application listens to