const Keyv = require("keyv");
let db = new Keyv("sqlite://database.sqlite");

console.log(process.argv);

if(process.argv.length > 2){
  let userID = process.argv[2];
  db.get(userID).then(result => {
  console.log(JSON.stringify(result,null,4));
  });
}
