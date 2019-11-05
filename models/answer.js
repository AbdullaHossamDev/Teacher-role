const sqlite3 = require('sqlite3').verbose();

function openDB(){
    //return new sqlite3.Database('../database/crm_ass.db',(err) => {
    return new sqlite3.Database('./crm_ass.db',(err) => {
        if (err) {
            console.error('0 ',err.message);
        }
      });

}

function closeDB(db){
    db.close((err) => {
        if (err) {
           console.error(err.message);
        }
      });
}

module.exports = class Answer{
    constructor(text, qs_id, type, id = -1){
        this.text       = text;
        this.qs_id      = qs_id;
        this.type       = type;
        this.id         = id;
    }

    save(callback){
        const db = openDB();
        var id = -1;
        db.serialize(()=>{
            var stmt ="insert into answer(text,qs_id,type) values('"+this.text+"','"+this.qs_id+"', '"+this.type+"')";
            db.run(stmt, function(err) {
                if (err) {console.log(err.message);callback(-1);}
                else{
                    id = this.lastID;
                    callback(id);
                }
            });
        });
        closeDB(db);
    }

    static saveAll(answers,callback){
        const db = openDB();
        
        db.serialize(()=>{

            var stmt = db.prepare("insert into answer(text,qs_id,type) values(?,?,?)");
                for (let a of answers){
                    stmt.run(a.text, a.qs_id, a.type);
                }
                stmt.finalize();


        });
        closeDB(db);
        callback('Done');
    }

    static getAnswer(id, callback){
        const db = openDB();
        db.serialize(()=>{
            
            db.get("select * from answer where id= "+id,(err,row) => {
                if(err){
                    console.log('1 ',err);
                }
                callback(row);
            });
        });
        closeDB(db);
    }

    static getAnswerByQs(qs_id, callback){
        const db = openDB();
        db.serialize(()=>{
            
            db.all("select * from answer where qs_id= "+qs_id+" order by type",(err,row) => {
                if(err){
                    console.log('1 ',err);
                }
                callback(row);
            });
        });
        closeDB(db);
    }

    update(callback){
        const db = openDB();
        db.serialize(()=>{
            var stmt ="update answer set text='"+this.text+"',type ="+this.type+" where id="+this.id;
            db.run(stmt, function(err) {
                if (err) {console.log(err.message);callback('Not done');}
                else{callback('Done');}
            });  
        });
        closeDB(db);
    }; 

    static updateAll(ids,texts,types,callback){
        const db = openDB();
        
        db.serialize(()=>{

            var stmt = db.prepare("update answer set text=? ,type=? where id=?");
                for (var i=0;i<ids.length;i++){
                    stmt.run(texts[i], types[i].toUpperCase(), ids[i]);
                }
                stmt.finalize();
        });
        closeDB(db);
        callback('Done');
    }

    static delete(id, callback){
        const db = openDB();
        db.serialize(()=>{
            var stmt ="delete FROM answer where id="+id;
            db.run(stmt, function(err) {
                if (err) {console.log(err.message);callback('Not done');}
                else{callback('Done');}
            }); 
        });
        closeDB(db);
    }
    static deleteByQs(qs_id, callback){
        const db = openDB();
        db.serialize(()=>{
            var stmt ="delete FROM answer where qs_id="+qs_id;
            db.run(stmt, function(err) {
                if (err) {console.log(err.message);callback('Not done');}
                else{callback('Done');}
            }); 
        });
        closeDB(db);
    }
}
