const userInfo = require('../../model/userInfo');
const constant = require('../../utils/constant');
const co = require('co');
const OSS = require('ali-oss');
const fs = require('fs');


/* 初始化Client */
const client = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: 'LTAILLD8weS9I0j0',
  accessKeySecret: 'jgxRWWUGuacrMKOMup9UMsaRG70ujd'
});

const ali_oss = {
  bucket: 'amwamw968-app',
  endPoint: 'oss-cn-beijing.aliyuncs.com',
};

class UploadController {

  constructor() {

  }

  async uploadSingleFile(req, res, next) {

    console.log('upload====' + req.file.path);
    // 文件路径
    var filePath = './' + req.file.path;
    // 文件类型
    /*var temp = req.file.originalname.split('.');
    var fileType = temp[temp.length - 1];
    var lastName = '.' + fileType;
    // 构建图片名
    var fileName = Date.now() + lastName;
    console.log('temp====' + temp);
    console.log('fileType====' + fileType);
    console.log('lastName====' + lastName);
    console.log('fileName====' + fileName);*/
    // 图片重命名

    //fs.renameSync(filePath, fileName);
    //fs.renameSync(filePath, req.file.originalname);
    /* .catch((err) =>{
             res.json({status: '102', msg: '文件写入失败'});
         })*/


    var localFile = './' + req.file.path;//fileName;
    var key = 'avatar/' + req.file.originalname;//fileName;
    console.log('key====' + key);
    console.log('localFile====' + localFile);
    console.log('阿里云 上传文件');
    // 阿里云 上传文件
    var exists = fs.existsSync(localFile);
    
    if(!exists){
      console.log('文件不存在');
      
      res.json({
        code: constant.RESULT_CODE.UPLOAD_ERR.code,
        msg: '上传失败, 文件不存在'
      });
      return;
    }
  

    console.log('阿里云 useBucket');
    client.useBucket(ali_oss.bucket);
    var result = await client.put(key, localFile)
      .catch((err)=>{
        console.log('阿里云 error');
        // 上传之后删除本地文件
        fs.unlinkSync(localFile);
        //res.end(JSON.stringify({status: '101', msg: '上传失败', error: JSON.stringify(err)}));
        res.json({
          code: constant.RESULT_CODE.UPLOAD_ERR.code,
          msg: '上传失败',
          data: err
        });

        //res.json({status:'101',msg:'上传失败',error:err});
      });

    var imageSrc = 'https://amwamw968-app.oss-cn-beijing.aliyuncs.com/' + result.name;
    // 上传之后删除本地文件
    fs.unlinkSync(localFile);
    //res.end(JSON.stringify({status: '100', msg: '上传成功', imageUrl: imageSrc}));
    //res.json({status:'100',msg:'上传成功',imageUrl:imageSrc});
    res.json({
      code: constant.RESULT_CODE.SUCCESS.code,
      msg: '上传成功',
      data: imageSrc
    });

  }

}


module.exports = new UploadController();
