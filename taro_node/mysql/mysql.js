var mysql = require('mysql');
//连接数据库

var db = mysql.createConnection({

    host : 'localhost',
    user : 'root',
    // localAddress : '127.0.0.8' ,
    port: 3306,
    password : '776824324' ,
    database : 'taro' ,
    multipleStatements : true //允许执行多条语句
});


function select ( ql , callback ){
    ql = ql || 'select * from card_list';
    db.connect(()=>{
        console.log('数据库连接成功');
    });
     new Promise(function( rel , rej){

        db.query( ql , function ( err , data ) {
        console.log(err );
        console.log(data );
        callback && callback( err , data);
        rel();
     });
     }).then(()=>{
        // closeMysql(db);
     })
    

};


//查询成功后关闭mysql

function closeMysql(connect){
    
   connect.end((err)=>{
     
   if(err){
          
        console.log(`mysql关闭失败:${err}!`);
   
    }else{
          
        console.log('mysql关闭成功!');
  
    }
});

}


module.exports = { select : select  , db : db  ,closeMysql : closeMysql };
