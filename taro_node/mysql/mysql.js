var mysql = require('mysql');
//连接数据库

var db = mysql.createConnection({
    // host : '127.0.0.8' ,
    host : 'localhost',
    user : 'root' ,
    // localAddress : '127.0.0.8' ,
    port: 3306,
    password : '776824324' ,
    database : 'taro' ,
    multipleStatements : true //允许执行多条语句
});

function upDate (){

};

function deleteData (){

};
function select ( ql , callback ){
    ql = ql || 'select * from card_list';
    db.connect(()=>{
        console.log('数据库连接成功');
    });
    db.query( ql , function ( err , data ) {
        callback && callback( err , data);
    });

};

module.exports = { select : select  , db : db };
