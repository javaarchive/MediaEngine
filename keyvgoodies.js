function applyExtras(db){
  db.has = async function(key){
    if(!(await db.get(key))){
      return false;
    }else{
      return true;
    }
  }
  return db;
}

module.exports = applyExtras;