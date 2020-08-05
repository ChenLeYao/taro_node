var express = require('express');
var app = require('../app.js');
var router = express.Router();
var sql = require('../mysql/mysql');

router.get('/', function ( req , res  ) {
    sql.select('select * from user_list' , function ( data ) {
        res.json(data);
    });
});

module.exports = router;
