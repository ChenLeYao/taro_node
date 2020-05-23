var formidable = require('formidable');
var path = require('path');
let fs = require('fs');

function handleBase64 ( req , callback){
    var params = [];
    var action = [];
    let imageRegRxp = /^data:image\/(\w+);base64,/;
    let videoRegRxp = /^data:video\/(\w+);base64,/;
    var type = '';
    for ( var prop in req.body ){
         var value = req.body[prop];
         var regExp;
         if (imageRegRxp.test(value) ){
             type = 'image';
             regExp = imageRegRxp ;
         }else if ( videoRegRxp.test(value)){
             type = 'video';
             regExp = videoRegRxp ;
         }else{
             continue;
         }
         params.push(
            {
                key : prop ,
                value : req.body[prop] ,
                regExp : regExp ,
                localPath : `../static/resourse/${type}/` ,//存储本地路径
                hostPath : `http://zhihuihuo.top/static/resourse/${type}/`//存储数据库
            }
         )
    }

    params.forEach((item)=>{
        action.push(new Promise(function ( resolve , reject ) {
            var base64Date = item.value.replace( item.regExp , '');
            base64Date = base64Date.replace(/\s/g , '+');
            var dataBuffer = Buffer.from( base64Date , 'base64' );
            var timeStamp = Date.now() + parseInt(999*Math.random());
            var suffix = item.value.match(item.regExp);
            var newPath =  timeStamp + '.' + suffix[1] ;
            var storePath =  item.hostPath + newPath;
            newPath =  path.resolve(__dirname , item.localPath + newPath );
            fs.writeFile(newPath , dataBuffer, { encoding : 'base64' } ,function(err) {
                resolve( {
                    name : item.key ,
                    storePath : storePath
                } );
            });
        }))
    });
    Promise.all( action ).then( (data)=>{
        let result = {};
        data.forEach(function (item) {
            result[ item.name ] = item['storePath'];
        });
        callback && callback( result );
    });
}

module.exports = handleBase64 ;

