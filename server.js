// Main Code Entrypoint
console.log("Loading...");
// not allowed in repl but useful for other environments
require("dotenv").config();

const express = require("express");

const morgan = require("morgan");

const app = express();

const rateLimit = require("express-rate-limit");

app.use(morgan());

const {ExpressAdapter} = require("ask-sdk-express-adapter");

// one liner for now
const skill = require("./skill").build();
app.get('/', (req,res) => {
  res.send("Hello!");
})

let api = express.Router()
api.use


app.get('/api/logincode/:')
let adapter = new ExpressAdapter(skill,true,true);
// app.post('/',(req,res) => {res.json({})})



app.post('/', adapter.getRequestHandlers());

app.listen(3000); // repl is smart enough to automatically switch to the port the application listens to