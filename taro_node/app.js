//声明使用模块
var express = require('express');
var app = express();
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes  = require('./routes/index');
var register =   require('./routes/register');
var user  = require('./routes/user');
var options = {
    maxAge : 36000000000 ,
    // etag : true,
    dotfiles: 'allow'
};

var ServerConf = {
ApiHost: "",
ServicePort: 80
};
process.env.PORT=ServerConf.ServicePort;

//设置模板引擎路径
app.set('views' , path.join( __dirname , 'views'));
//设置使用哪个模板引擎
app.set('view engine' , 'ejs' );
app.set('port' , process.env.PORT );
app.use( bodyParser.json());
app.use( bodyParser.urlencoded( {  limit : '50mb',extended : true }));
app.use( cookieParser());
app.use( favicon(__dirname + '/static/favicon.png'));
app.use( express.static( path.join(__dirname , 'static') , options ));
var expiryDate = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard',
    name: 'sessionId',
    keys: ['key1', 'key2'],
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true,
        httpOnly: true,
        domain: 'http://localhost',
        path: '/',
        expires: expiryDate}
}))

app.use('/static/resourse/image',express.static( path.join( __dirname, 'static/resourse/image/') , options ));
app.use('/img',express.static( path.join( __dirname, 'static/resourse/taro_show/img'),options ));
app.use('/main',express.static( path.join( __dirname, 'static/resourse/taro_show/index.html'),options));
app.use('/manage',express.static( path.join( __dirname, 'static/resourse/taro_manage/index.html'),options));
app.use('/css',express.static( path.join( __dirname, 'static/resourse/taro_show/css/'),options));
app.use('/js',express.static( path.join( __dirname, 'static/resourse/taro_show/js/'),options));
app.use('/static/resourse/video',express.static( path.join( __dirname, 'static/resourse/video/'),options));
app.use('/static/register',express.static( path.join( __dirname, 'static/register.html'),options));
app.use('/static/login',express.static( path.join( __dirname, 'static/login.html'),options));
app.use('/static/loginout',express.static( path.join( __dirname, 'static/loginout.html'),options));
//设置跨域访问
app.all('*', function ( req ,res , next ) {
   res.header("Access-Control-Allow-Origin" , "*");
   res.header("Access-Control-Allow-Headers" , "X-Requested-With");
   res.header("Access-Control-Allow-Methods" , "PUT,POST,GET,DELETE,OPTIONS");
   res.header("X-Powered-By" , "3.2.1");
   res.header("Content-Type" , "application/json;charset=utf-8");
   next();
});

app.use( '/' , routes );
app.use('/users' , user );
app.use('/main' , register );

var server = app.listen( app.get('port') , function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log(server.address());
    console.log('Express server listening on port ' + app.get('port'));
});

app.use(function ( req ,res , next ) {
    var err = new Error('404 Not Found');
    err.status = 404 ;
    next(err);
});
//开发环境
if ( app.get('env') === 'development'){
    app.use(function ( err ,req ,res ,next ) {
        res.status( err.status || 500);
        console.log(err.message);
        // res.render('error' , {
        //     message : err.message ,
        //     error : err
        // })
    })
}
//生产环境
app.use(function ( err ,req ,res , next ) {
    res.status( err.status || 500);
    res.render('error' , {
        message : err.message ,
        error : {}
    })
});

module.exports = app ;
