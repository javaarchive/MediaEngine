const Keyv = require("keyv");
let db = new Keyv("sqlite://database.sqlite"); // make sure repl hides this in some way
db = require("./keyvgoodies")(db);
let loginCodeDB = new Keyv();
loginCodeDB = require("./keyvgoodies")(loginCodeDB);

const alexaSlotIDtoProp = {
  "preffered_mediatype": "prefferedMediaForm",
  "content_provider": "contentProvider",
  "search_backend": "ytSearchMode",
  "youtube_module": "ytMode"
};


class Account{
  // checking out some newer js features instead of just writing all the vars in constructor

  contentProvider = "youtube";
  ytMode = "node-ytdl";
  ytSearchMode = "invidious";
  isAdmin = false;

  prefferedMediaForm = "audio";

  constructor(data,uid){
    if(!data || !uid){
      throw "user id and data fields are required to initalize Account";
    }

    if(data.mode){
      this.mode = data.mode;
    }
    if(data.contentProvider){
      this.contentProvider = data.contentProvider;
    }

    if(data.isAdmin){
      this.isAdmin = data.isAdmin;
    }

    this.uid = uid;
  }

  static async getFromID(id, autocreate = true){
    id = id.toString();
    if(!(await db.has(id))){
      if(autocreate){
        await (new Account({},id)).save();
      }else{
        throw "Account does not exist";
      }
    }
    let accData = await db.get(id); 
    return (new Account(accData, id));
  }

  async nuke(){
    if(process.env.ENVIRONMENT != "PRODUCTION"){
      await db.clear();
    }else{
      throw "Nuking is not allowed in production. ";
    }
  }

  async setPropFromSlots(settingID, value){
    if(settingID in alexaSlotIDtoProp){
      let prop = alexaSlotIDtoProp[settingID];
      this[prop] = value;
    }
    await this.save();
  }

  async save(){
    await db.set(this.uid, {
      mode: this.mode,
      isAdmin: this.isAdmin,
      contentProvider: this.contentProvider,
      lastSaved: Date.now(),
      prefferedMediaForm: this.prefferedMediaForm
    })
  }
}

let loginCodeManager = {
  storeLoginCode: async function(code, userID) {
    await loginCodeDB.set(code, {
      uid:userID,
      expiry: Date.now() + 1000*60*10
    });
  },
  hasCode: async function(code) {
    console.log("Check has ",code);
    if(!(await loginCodeDB.has(code))){
      return false;
    }else{
      console.log("Fetching ",code);
      let loginDetails = await loginCodeDB.get(code);
      if(loginDetails.expireTime > Date.now()){
        return false;
      }else{
        return true;
      }
    }
  },
  async getUserForCode(code){
    return (await loginCodeDB.get(code)).uid;
  }
}


module.exports = {loginCodeManager, Account}