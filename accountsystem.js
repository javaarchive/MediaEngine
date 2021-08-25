const Keyv = require("keyv");
let db = new Keyv("sqlite://database.sqlite"); // make sure repl hides this in some way
db = require("./keyvgoodies")(db);
let loginCodeDB = new Keyv();
loginCodeDB = require("./keyvgoodies")(loginCodeDB);

class Account{
  // checking out some newer js features instead of just writing all the vars in constructor

  contentProvider = "youtube";
  mode = "node-ytdl";
  isAdmin = false;

  constructor(data){
    if(data.mode){
      this.mode = data.mode;
    }
    if(data.contentProvider){
      this.contentProvider = data.contentProvider;
    }

    if(data.isAdmin){
      this.isAdmin = data.isAdmin;
    }
  }

  static async getFromID(id){
    id = id.toString();
    if(!(await db.has(id))){
      throw "Account does not exist";
    }
    let accData = await db.get(id); 
    return (new Account(accData));
  }

  async nuke(){
    if(process.env.ENVIRONMENT != "PRODUCTION"){
      await db.clear();
    }else{
      throw "Nuking is not allowed in production. ";
    }
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
    if(!(await loginCodeDB.has(code))){
      return false;
    }else{
      let loginDetails = await loginCodeDB.get(code);
      if(loginDetails.expireTime > Date.now()){
        return false;
      }else{
        return true;
      }
    }
  }
}


module.exports = {loginCodeManager, Account}