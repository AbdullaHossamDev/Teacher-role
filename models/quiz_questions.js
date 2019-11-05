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

module.exports = class Quiz_Questions{
    constructor(ans_id,quiz_id, qs_id){
        this.ans_id     = ans_id;
        this.quiz_id    = quiz_id;
        this.qs_id      = qs_id;
    }


    static save(quiz_id, ans_ids,callback){
        const db = openDB();
        
        db.serialize(()=>{
            

            var stmt = db.prepare("insert into answer_question_quiz(quiz_id,qs_id,ans_id) values(?,?,?)");
                if(ans_ids){
                    for( var i =0;i<ans_ids.length;i++){
                        var qs = ans_ids[i].split(',')[0];
                        var ans= ans_ids[i].split(',')[1];
                        stmt.run(quiz_id,qs,ans);        
                    }
                }
            stmt.finalize();
        });
        closeDB(db);
        callback('Done');
    }

    static getQuestionsByQuiz(quiz_id, callback){
        const db = openDB();
        db.serialize(()=>{
            
            db.all("select * from answer_question_quiz where quiz_id= "+quiz_id+" order by qs_id",(err,row) => {
                if(err){
                    console.log(err);
                }
                callback(row);  
            });

        });
        closeDB(db);
        
    }

    static getQsAnsText(quiz_id, callback){
        const db = openDB();
        db.serialize(()=>{
            
            db.all("select qs.text q_text , a.text a_text from answer_question_quiz aqq, question qs, answer a where aqq.qs_id = qs.id and   aqq.ans_id = a.id and  a.qs_id = qs.id and quiz_id= "+quiz_id+" order by aqq.qs_id",(err,row) => {
                if(err){
                    console.log(err);
                }
                callback(row);  
            });

        });
        closeDB(db);
        
    }

    static delete(quiz_id, qs_id,callback){
        const db = openDB();
        db.serialize(()=>{
            var stmt ="delete FROM answer_question_quiz where quiz_id="+quiz_id+" and qs_id="+qs_id;
            db.run(stmt, function(err) {
                if (err) {console.log(err.message);callback('Not done');}
                else{callback('Done');}
            });
        });
        closeDB(db);
    }

    static deleteByQuiz(quiz_id,callback){
        const db = openDB();
        db.serialize(()=>{
            var stmt ="delete FROM answer_question_quiz where quiz_id="+quiz_id;
            db.run(stmt, function(err) {
                if (err) {console.log(err.message);callback('Not done');}
                else{callback('Done');}
            });
        });
        closeDB(db);
    }
}
