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

module.exports = class Course{
    constructor(name, tchr_id = -1, id = -1){
        this.name       = name;
        this.tchr_id    = tchr_id;
        this.id         = id;
    }

    save(callback){
        const db = openDB();
        var id = -1;
        db.serialize(()=>{
            var stmt ="insert into course(name,tchr_id) values('"+this.name+"','"+this.tchr_id+"')";
            
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

    static getCourse(name, callback, tchr_id = -1){
        const db = openDB();
        db.serialize(()=>{
            if (tchr_id != -1){
                db.get("select * from course where name= '"+name+"' and tchr_id= "+tchr_id,(err,row) => {
                    if(!err){callback(row);}
                    else{console.log(err)}   
                });
            }
            else{
                db.get("select * from course where name= '"+name+"'",(err,row) => {
                    if(err){
                        console.log(err);
                    }
                    callback(row);
                });
            }
        });
        closeDB(db);
    }

    static getCourseByTchr(tchr_id,callback ){
        const db = openDB();
        db.serialize(()=>{
            db.all("select * from course where tchr_id= "+tchr_id,(err,row) => {
                if(err){
                    console.log(err);
                }
                callback(row);   
            });
        });
        closeDB(db);
    }

    static getAll(callback){
        const db = openDB();
        db.serialize(()=>{
            db.all("select * from course",(err,row) => {
                if(err){
                    console.log(err);
                }
                callback(row);   
            });
        });
        closeDB(db);
    }

    update(callback){
        const db = openDB();
        db.serialize(()=>{
            var stmt ="update course set name='"+this.name+"',tchr_id ="+this.tchr_id+" where id="+this.id;
            db.run(stmt, function(err) {
                if (err) {console.log(err.message);callback('Not done');}
                else{callback('Done');}
            }); 
        });
        closeDB(db);
    };

    static delete(id, callback){
        const db = openDB();
        db.serialize(()=>{
            var stmt ="delete FROM course where id="+id;
            db.run(stmt, function(err) {
                if (err) {console.log(err.message);callback('Not done');}
                else{callback('Done');}
            }); 
        });
        closeDB(db);
    }
}
