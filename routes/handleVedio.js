var formidable = require('formidable');
var path = require('path');
let fs = require('fs');
var fileDir =  path.resolve(__dirname , '../static/resourse/video/');
var form = formidable({ multiples: false , uploadDir: fileDir ,  keepExtensions : true , hash :true  });

function handleVedio ( req , callback){
    let Base64RegRxp = /^data:video\/\w+;base64,/;
    if ( !Base64RegRxp.test( req.body.image_face ) ){
        callback && callback ( null , req.body.image_face  ) ;
        return;
    }
    var base64Date = req.body.image_face.replace( Base64RegRxp , '');
    base64Date = base64Date.replace(/\s/g , '+');
    var dataBuffer = Buffer.from( base64Date , 'base64' );
    var timeStamp = Date.now() + parseInt(999*Math.random());
    var suffix = req.body.image_face.match(/^data:video\/(\w+);base64,/);
    var newPath =  timeStamp + '.' + suffix[1] ;
    var storePath =   "http://localhost:3000/static/resourse/video/" + newPath;
    newPath =  path.resolve(__dirname , '../static/resourse/video/'+ newPath );
    fs.writeFile(newPath , dataBuffer, { encoding : 'base64' } ,function(err) {
        if (err){
            callback && callback ( err , storePath  ) ;
        }else{
            callback && callback (  err , storePath );
        }
    });
}

module.exports = handleVedio ;

