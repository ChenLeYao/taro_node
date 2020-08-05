var express = require('express');
var router = express.Router();
var sql = require('../mysql/mysql');
var app = require('../app.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var formidable = require('formidable');
var path = require('path');
let fs = require('fs');
var upLoad = require('./upLoad');
//router.use(cookieParser());
router.get('/',function( req , res ){
    // res.render('index', {
    //     title : 'express'
    // });
    res.send('welcome!');
});
//注册
router.get('/register', jsonParser , function( req , res ){
    sql.select( 'select * from card_list' , function ( err, data  ) {
        res.json(data);
    });
});
//卡牌列表
router.get('/card_list',function( req , res ){
    sql.select( 'SELECT id , card_name , english_name , image_face  FROM card_list' , function ( err, data  ) {

        let result = {};
        if ( err ){
            result.error = err ;
            result.code = 0;
        }else {
            if ( !data.length ){
                result.code = 0;
                result.message = '暂无数据';
            }else{
                result.code = 1;
                result.list = data;
                result.message = '查询成功!';
            }
        };
        res.json(result);
    });
});
//卡牌介绍列表
router.get('/intro_list',function( req , res ){
    var sq = `select * from intro_list l,  intro_list_child c
    where l.class_id = c.id `;
    sql.select( sq , function ( err, data  ) {
        let result = {};
        if ( err ){
            result.error = err ;
            result.code = 0;
        }else {
            if ( !data.length ){
                result.code = 0;
                result.message = '暂无数据';
            }else{
                result.code = 1;
                result.list = data;
                result.message = '查询成功!';
            }
        };
        res.json(result);
    });
});
//分类
router.get('/intro_list_child' , function(req,res){
    var sq = `select * from intro_list_child`;
    sql.select( sq , function ( err, data  ) {
        let result = {};
        if ( err ){
            result.error = err ;
            result.code = 0;
        }else {
            if ( !data.length ){
                result.code = 0;
                result.message = '暂无数据';
            }else{
                result.code = 1;
                result.list = data;
                result.message = '查询成功!';
            }
        };
        res.json(result);
    });
});
//分类介绍，添加与修改
router.post('/intro_detail',function( req , res ){
    var id = req.body.id ;
    var sq = `select * from intro_list where id =${id}`;

    sql.select( sq , function ( err, data  ) {
        console.log( err );
        console.log( '我是分割线' );
        console.log( data );
        let result = {};
        if ( err ){
            result.error = err ;
            result.code = 0;
        }else {
            if ( !data.length ){
                result.code = 0;
                result.message = '暂无数据';
            }else{
                result.code = 1;
                result.detail = data[0];
                result.message = '查询成功!';
            }
        };
        res.json(result);
    });
});
//修改分类
router.post('/intro_detail_edit', function( req , res ){
    upLoad( req ,function ( err , fields , files , paths  ) {
        if ( fields.id ){
            //修改
            var sq = `update intro_list set  title = '${fields.title}',
                                 tag = '${fields.tag}',
                                 content = '${fields.content}' ,
                                 class_id = '${fields.class_id}',
                                 image_face = '${fields.image_face}' ,
                                 where id =${fields.id}`;
        }else {
            //新增
            var sq = `insert into intro_list ( title , tag , content , class_id , image_face )
                                    values ( '${fields.title}',
                                      '${fields.tag}',
                                      '${fields.content}',
                                      '${fields.class_id}',
                                      '${paths[0].path}')`;
        };
        sql.select( sq , function ( err, data  ) {
            console.log( err );
            console.log( data );
            let result = {};
            if ( err ){
                result.error = err ;
                result.code = 0;
            }else {
                if ( data.serverStatus !==2 ){
                    result.code = 0;
                    result.message = '操作失败!';
                }else{
                    result.code = 1;
                    result.detail = data[0];
                    result.message = '操作成功!';
                }
            };
            res.json(result);
        });
    });
});
//删除分类
router.post('/intro_list_delete', function( req , res ){
    var id = req.body.id ;
    console.log( req.body );
    if ( id ){
        //修改
        var sq = `delete from intro_list where id =${id}`;
    }
    sql.select( sq , function ( err, data  ) {
        console.log( err );
        console.log( data );
        let result = {};
        if ( err ){
            result.error = err ;
            result.code = 0;
        }else {
            if ( data.serverStatus !==2 ){
                result.code = 0;
                result.message = '操作失败!';
            }else{
                result.code = 1;
                result.detail = data[0];
                result.message = '操作成功!';
            }
        };
        res.json(result);
    });
});
//卡牌删除列表
module.exports = router ;
