var express = require('express');
var multiparty = require('multiparty');
var util = require('util');
var fs = require("fs");
var path = require("path");

process.env.TZ = 'Asia/Shanghai';
var app = express();
app.use(express.static(__dirname+'/public'));
app.locals.moment = require('moment');

var _uploadtarget = __dirname+"/public/nj/upload";

/*
 上传
 地址: /ufile
 * */
app.post('/ufile', function(req, res, next) {
    console.log("/msg/msgsavepro.v2._uploadtarget:" + _uploadtarget);

    //生成multiparty对象，并配置上传目标路径
    var dpath = "/" + app.locals.moment(Date.now()).format("YYYY/MM/DD");
    var dstPath = _uploadtarget + dpath;    // + inputFile.originalFilename;
    if(!fsExistsSync(dstPath)){
        mkdirsSync(dstPath, 755);
    }
    var form = new multiparty.Form({uploadDir: dstPath});
    //上传完成后处理
    form.parse(req, function(err, fields, files) {
        if (err) {
            console.log('parse error: ' + err);
            res.end(JSON.stringify({success: 0}));
            next();
        }
        console.log("fields:"+JSON.stringify(fields));      //包含除文件类型外的域对象
        console.log("files:"+JSON.stringify(files));        //包含全部文件对象

        res.end(JSON.stringify({success: 1, fields: fields, files: files}));
    });
});


//检测文件或者文件夹存在 nodeJS
function fsExistsSync(path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}
//递归创建目录 同步方法
function mkdirsSync(dirname, mode){
    console.log(dirname);
    if(fs.existsSync(dirname)){
        return true;
    }else{
        if(mkdirsSync(path.dirname(dirname), mode)){
            fs.mkdirSync(dirname, mode);
            return true;
        }
    }
}

app.listen(3000, function() {
    if (!fsExistsSync(_uploadtarget)) {
        mkdirsSync(_uploadtarget, 755);
    }
    console.log("app listening on *:3000");
    console.log((new Date()).toLocaleString());
});