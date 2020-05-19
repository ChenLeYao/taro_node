var eventEmitter = require('events');
var stream = require('stream');
var fs = require('fs');
var child_progress = require('child-progress');

var readStream = fs.createReadStream("./static/resourse/image/demo.txt");
readStream.on("data",function (data) {
    // console.log('监听数据');
    // console.log(data);
});
readStream.on("close",function (data) {
    console.log('close');
    console.log(data);
});
readStream.on("error",function (err) {
    console.log('err');
    console.log(err);
});

var myEventEmitter = new eventEmitter();
myEventEmitter.on('begin',function () {
    console.log('开始了');
});

myEventEmitter.on('destination',function () {
    console.log('destination');
});

myEventEmitter.on('pipe',function () {
    console.log('pipe');
});
//console.log(myEventEmitter.eventNames());
myEventEmitter.emit('begin');
process.on('uncaughtException',function (e) {
    // console.log('caught');
    // console.log(e);
});




