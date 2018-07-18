const express = require('express');
const router = express.Router();
const userController = require('../controller/api/UserController');
const headers = require('../utils/headers');
console.log('enter route api');

router.use(headers.apptype);
/*user模块*/
router.post('/user/register', userController.userRegister);
router.get('/user/login', userController.userLogin);

router.use(headers.token);


router.get('/user/userinfo', userController.getUserInfo);
router.post('/user/uploadavatar', userController.userUploadAvatar);


module.exports = router;
