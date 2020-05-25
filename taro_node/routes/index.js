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
var handleBase64 = require('./handleBase64');
var handleVedio = require('./handleVedio');
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
//卡牌列表分类
router.get('/card_list_class',function( req , res ){
    var sq =  'SELECT * from card_list_class';
    sql.select( sq , function ( err, data  ) {
        var result = {};
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
//卡牌详情
router.post('/card_detail',function( req , res ){
    var id = req.body.id;
    var sq = `SELECT *  FROM card_list  where id=${id}`;
    sql.select( sq , function ( err, data  ) {
        var result = {};
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
//卡牌列表
router.get('/card_list',function( req , res ){
    var sq = `SELECT card_list.id ,
            card_list.card_name , 
            card_list.english_name ,
            card_list.image_face 
            from card_list  left join card_list_class on card_list.class_id = card_list_class.id
            `;
    sql.select( sq , function ( err, data  ) {
        var result = {};
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
//添加卡牌
router.post('/card_list_add' , function ( req ,res ) {
    handleBase64( req ,function (  storePath ) {
        var sq = '';
        // if ( storePath ){
        //     res.json({
        //         code : 0 ,
        //         message : err
        //     });
        //     return;
        // }
        if ( req.body.id ){
            //修改
            sq = `update card_list set  title = '${req.body.title}',
                                 tag = '${req.body.tag}',
                                 content = '${req.body.content}' ,
                                 class_id = '${req.body.class_id}',
                                 image_face = '${storePath['image_face'] ? storePath['image_face'] : req.body.image_face }',
                                 image_detail = '${storePath['image_detail'] ? storePath['image_detail'] : req.body.image_detail}',
                                 section_title = '${req.body.section_title}',
                                 card_name = '${req.body.card_name}',
                                 english_name = '${req.body.english_name}'
                                 where id =${req.body.id}`;

        }else {
            //新增
            sq = `insert into card_list ( title , tag , content , class_id , image_face , image_detail  , card_name ,english_name , section_title )
                                    values ( '${req.body.title}',
                                      '${req.body.tag}',
                                      '${req.body.content}',
                                      '${req.body.class_id}',
                                      '${storePath['image_face']}',
                                      '${storePath['image_detail']}',
                                      '${req.body.card_name}',
                                      '${req.body.english_name}',
                                      '${req.body.section_title}')`;

        };

        sql.select( sq , function ( err, data  ) {
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
                    result.message = '操作成功!';
                }
            };
            res.json(result);
        });
    })
});
//卡牌列表
router.get('/intro_list',function( req , res ){
    var sq = `
select intro_list.id , intro_list.title , 
intro_list.tag , intro_list.content , class_name from intro_list ,intro_list_child where intro_list.class_id =intro_list_child.id
`;
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
//卡牌分类
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
//分类详情
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
//添加与修改分类
router.post('/intro_detail_edit', function( req , res ){
    handleBase64( req ,function (storePath ) {
        var sq = '';
      
        if ( req.body.id ){
            //修改
           sq = `update intro_list set  title = '${req.body.title}',
                                 tag = '${req.body.tag}',
                                 content = '${req.body.content}' ,
                                 class_id = '${req.body.class_id}',
                                 image_face = '${storePath['image_face'] ? storePath['image_face'] : req.body.image_face}'
                                 where id =${req.body.id}`;

        }else {
            //新增
            sq = `insert into intro_list ( title , tag , content , class_id , image_face )
                                    values ( '${req.body.title}',
                                      '${req.body.tag}',
                                      '${req.body.content}',
                                      '${req.body.class_id}',
                                      '${storePath}')`;
        };

        sql.select( sq , function ( err, data  ) {
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
    })
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
//视频添加列表
router.post('/taro_video_edit' , function ( req , res ) {
    console.log(123);
    handleBase64( req ,function (  storePath ) {
        var sq = '';
        // if ( err ){
        //     res.json({
        //         code : 0 ,
        //         message : err
        //     });
        //     return;
        // }


        console.log(storePath);
        if ( req.body.id ){
            //修改
            console.log('修改');
            sq = `update taro_video set  title = '${req.body.title}',
                                 tag = '${req.body.tag}',
                                 image_face = '${storePath['image_face'] ? storePath['image_face'] : req.body.image_face}'
                                 where id =${req.body.id}`;
        }else {
            //新增
            console.log('新增');
            sq = `insert into taro_video ( title , tag , image_face )
                                    values ( '${req.body.title}',
                                      '${req.body.tag}',
                                      '${storePath['image_face']}')`;
        };

        sql.select( sq , function ( err, data  ) {
            console.log(err);
            console.log(data);
            console.log('回调');
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
    })
} );
//视频列表
router.get('/taro_video_list' , function ( req , res ){
    var sq = 'select * from taro_video';
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
//视频详情
router.post('/taro_video_detail' , function ( req , res ) {
    var id = req.body.id;
    var sq = `select * from taro_video where id=${id}`;
    sql.select( sq , function ( err, data  ) {
        console.log( err );
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
//牌阵列表
router.get('/card_array_list' , function( req , res ){
    var sq = 'select * from card_array_list';
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
//牌阵分类列表
router.get('/card_array_class' , function( req , res ){
    var sq = 'select * from card_array_class';
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
//牌阵详情
router.post('/card_array_detail' , function ( req, res ){
    var id = req.body.id;
    var sq = `select * from card_array_list where id=${id}`;
    sql.select( sq , function ( err, data  ) {
        console.log( err );
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
//牌阵添加修改
router.post('/card_array_list_edit' , function( req, res){
    handleBase64( req ,function (  storePath ) {
        var sq = '';

        if ( req.body.id ){
            //修改
            sq = `update card_array_list set  title = '${req.body.title}',
                                 tag = '${req.body.tag}',
                                 content = '${req.body.content}' ,
                                 class_id = '${req.body.class_id}',
                                 image_face = '${storePath['image_face'] ? storePath['image_face'] : req.body.image_face}',
                                 para = '${req.body.para}'
                                 where id =${req.body.id}`;

        }else {
            //新增
            sq = `insert into card_array_list ( title , tag , content , class_id , para , image_face    )
                                    values ( '${req.body.title}',
                                      '${req.body.tag}',
                                      '${req.body.content}',
                                      '${req.body.class_id}',
                                      '${req.body.para}',
                                      '${storePath['image_face']}')`;
        };

        sql.select( sq , function ( err, data  ) {
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
                    result.message = '操作成功!';
                }
            };
            res.json(result);
        });
    })
})
//今日塔罗
router.post('/card_day',function (req,res) {
    var id = req.body.id;
    var sq = `select * from card_day where id=${id}`;
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
                result.detail = data[0];
                result.message = '查询成功!';
            }
        };
        res.json(result);
    });
});
//今日塔罗修改
router.post('/card_day_edit',function (req,res) {
    handleBase64( req ,function (  storePath ) {
        var sq = '';
        if ( req.body.id ){
            //修改
            sq = `update card_day  set  title = "${req.body.title}",
                                 calender = "${req.body.calender}",
                                 date_string = "${req.body.date_string}",
                                 image_face ="${storePath['image_face'] ? storePath['image_face'] : req.body.image_face}",
                                 saying = "${req.body.saying}"
                                 where id =${req.body.id}`;
        }else {
            //新增
            sq = `insert into card_day ( title , date_string , calender , image_face , saying )
                                    values ( '${req.body.title}',
                                      '${req.body.date_string}',
                                      '${req.body.calender}',
                                      '${storePath['image_face']}',
                                      '${req.body.saying}')`;
        };

        sql.select( sq , function ( err, data  ) {
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
                    result.message = '操作成功!';
                }
            };
            res.json(result);
        });
    })
});
//塔罗介绍前端列表
router.get('/intro_all_list',function( req,res ){
   // var sq = `SELECT concat( '{id:' , id , '}') from intro_list where class_id = 1`;
    var sq = `select intro_all(id)  as json from intro_list_class group by id`;
    sql.select( sq , function ( err, data  ) {
        // console.log(data);
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
                for ( var attr in data ){
                    console.log(data[attr].json);
                    console.log('---转化为json-------');
                    data[attr] = JSON.parse(data[attr].json);
                    console.log('---转化为json-------');
                    console.log(data[attr]);
                };

                console.log('-----结束-----');
                console.log(data);
                result.list = data;
                result.message = '查询成功!';
            }
        };
        res.json(result);
    });
});
//所有卡牌以及分类
router.get('/card_list_all',function( req,res ){
    var sq = `select card_all(id) as json from card_list_class;`;
    sql.select( sq , function ( err, data  ) {
        // console.log(data);
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
                for ( var attr in data ){
                    console.log(data[attr].json);
                    data[attr] = JSON.parse(data[attr].json);
                };
                console.log('----------');
                result.list = data;
                result.message = '查询成功!';
            }
        };
        res.json(result);
    });
});
//所有牌阵种类
router.get('/card_array_all',function( req,res ){
    var sq = `select card_array_all(id) as json  from card_array_class`;
    sql.select( sq , function ( err, data  ) {
        // console.log(data);
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
                for ( var attr in data ){
                    console.log(data[attr].json);
                    data[attr] = JSON.parse(data[attr].json);
                };
                console.log('----------');
                result.list = data;
                result.message = '查询成功!';
            }
        };
        res.json(result);
    });
});
//占卜所有分类和事件
router.get('/taro_list',function( req,res ){
    var sq = `select taro_all(id)  as json from taro_class group by id`;
    sql.select( sq , function ( err, data  ) {
        // console.log(data);
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
                for ( var attr in data ){
                    console.log(data[attr].json);
                    data[attr] = JSON.parse(data[attr].json);
                };
                console.log('----------');
                result.list = data;
                result.message = '查询成功!';
            }
        };
        res.json(result);
    });
});
module.exports = router ;
