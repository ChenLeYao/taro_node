var formidable = require('formidable');
var path = require('path');
let fs = require('fs');
var fileDir =  path.resolve(__dirname , '../static/resourse/image/');
var form = formidable({ multiples: false , uploadDir: fileDir ,  keepExtensions : true , hash :true  });

function upLoad( req , callback){
    form.parse(req, (err, fields, files) => {
        console.log(err);
        let actionGroup = [];
        if (!err ) {
            for ( var attr in files ){
                actionGroup.push(new Promise(function ( resolve, reject) {
                    var file = files[attr];
                    var id = fields.id;
                    var timeStamp = Date.now() + parseInt(Math.random() * 999);
                    var oldPath = file.path;
                    var newPath = fileDir + '\\' + timeStamp + '_' + file.name;
                    fs.rename(oldPath, newPath, function () {
                        let path = "http://localhost:3000/static/resourse/image/" + timeStamp + '_' + file.name;
                        resolve({
                            name : attr ,
                            path : path
                        });
                    });
                }));
            };
            Promise.all(actionGroup).then(( paths )=>{
                callback( err , fields , files , paths );
            });
        }
    });
}

module.exports = upLoad ;

