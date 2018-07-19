const userInfo = require('../../model/userInfo');
const constant = require('../../utils/constant');
const co = require('co');
const OSS = require('ali-oss');
const fs = require('fs');


/* 初始化Client */
const client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: '',
  accessKeySecret: ''
});

const ali_oss = {
  bucket: '',
  endPoint: '',
};

class UploadController {

  constructor() {

  }

  uploadSingleFile(req, res, next) {

    console.log('upload====' + req.file.path);
    // 文件路径
    var filePath = './' + req.file.path;
    // 文件类型
    var temp = req.file.originalname.split('.');
    var fileType = temp[temp.length - 1];
    var lastName = '.' + fileType;
    // 构建图片名
    var fileName = Date.now() + lastName;
    // 图片重命名
    fs.rename(filePath, fileName, (err) => {
      if (err) {
        //res.end(JSON.stringify({status: '102', msg: '文件写入失败'}));
        res.json({status: '102', msg: '文件写入失败'});
      } else {
        var localFile = './' + fileName;
        var key = fileName;
        console.log('阿里云 上传文件');
        // 阿里云 上传文件
        co(function* () {
          console.log('阿里云 useBucket');
          client.useBucket(ali_oss.bucket);
          var result = yield client.put(key, localFile);
          var imageSrc = 'http://amwamw968.oss-cn-beijing.aliyuncs.com/' + result.name;
          // 上传之后删除本地文件
          fs.unlinkSync(localFile);
          //res.end(JSON.stringify({status: '100', msg: '上传成功', imageUrl: imageSrc}));
          res.json({status:'100',msg:'上传成功',imageUrl:imageSrc});
        }).catch(function (err) {
          console.log('阿里云 error');
          // 上传之后删除本地文件
          fs.unlinkSync(localFile);
          //res.end(JSON.stringify({status: '101', msg: '上传失败', error: JSON.stringify(err)}));
          res.json({status:'101',msg:'上传失败',error:JSON.stringify(err)});
        });
      }
    });
  }


}


module.exports = new UploadController();