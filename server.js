// Main Code Entrypoint
console.log("Loading...");

const express = require("express");

const app = express();

const {ExpressAdapter} = require("ask-sdk-express-adapter");

// one liner for now
const skill = require("./skill").build();
app.post('/', (new ExpressAdapter(skill,true,true)).getRequestHandlers());

app.listen(3000); // repl is smart enough to automatically switch to the port the application listens to