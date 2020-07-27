let express = require('express');
let router = express.Router();
let md5 = require('md5');
var sql = require('../mysql/mysql');
router.post('/register',function ( req, res) {
   if ( !req.cookies.sessionId){
        let username = req.body.username ;
        let password = req.body.password;
        let storeSessionId = md5( username + password );
        let sq =  `SELECT username from user where username='${username}'`;
        sql.select( sq , function ( err, data  ) {
            let result = {};
            if ( err ){
                result.error = err ;
                result.code = 0;
                res.json(result);
            }else {
                if ( data.length ){
                    result.code = 0;
                    result.message = '该用户已经注册';
                    res.json(result);
                }else{
                    let sqq = `insert into user ( username , name   , password , sessionId )
                                    values ( '${username}',
                                       '${username}',
                                      '${password}',
                                      '${storeSessionId}')`;
                    sql.select( sqq , function ( err, data  ) {
                        result.code = 1;
                        result.message = '注册成功!';
                        res.cookie('sessionId', storeSessionId , {maxAge:600000,signed:false});
                        res.redirect('/');
                    })
                }
            };

        });
    }else{
       res.redirect('/');
    }
})

router.post('/login',function (req,res) {
    let username = req.body.username ;
    let password = req.body.password;
    let sq =  `SELECT * from user where username='${username}' and password='${password}' `;
    sql.select( sq , function ( err, data  ) {
        let result = {};
        if( err ){
            result.error = err ;
            result.code = 0;
            res.json(result);
        }
        if ( !data.length){
            result.code = 0;
            result.message = '用户名或密码错误!';
            res.json(result);
        }else{
            result.code = 1;
            result.message = '登陆成功!';
            res.cookie('sessionId',data[0].sessionId ,{maxAge:600000,signed:false});
            // res.json(result);
            res.redirect('/');
        }
    })


})

router.post('/loginout',function (req,res) {
    if ( req.cookies.sessionId){
        res.clearCookie('sessionId');
        res.redirect('/');
    }else{
        res.redirect('/');
    }
})

module.exports = router;
