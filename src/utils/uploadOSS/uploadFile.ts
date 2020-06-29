import './hmac.js';
import './sha1.js';
import Base64 from './Base64'; //Base64,hmac,sha1,crypto相关算法
//参考这里https://github.com/peterhuang007/weixinFileToaliyun.git
import Crypto from './crypto.js';

const clint = {
  rootDir: '', //默认存在根目录，可根据需求改
  accessKeyId: '',
  accessKeySecret: '',
  stsToken: '',
  timeout: 87600, //这个是上传文件时Policy的失效时间
};

export const uploadFile = (
  env: any,
  options: {
    file: any;
    dir: string;
    failCallback?: (arg0: Error) => void;
    successCallback?: (arg0: any) => void;
  }
) => {
  clint.rootDir = `https://${env.bucket}.${env.endpoint}`; //默认存在根目录，可根据需求改
  clint.accessKeyId = env.accessKeyId;
  clint.accessKeySecret = env.accessKeySecret;
  clint.stsToken = env.stsToken;

  if (!options.file.tempFilePath || options.file.tempFilePath.length < 9) {
    wx.showModal({
      title: '图片错误',
      content: '请重试',
      showCancel: false,
    });
    return;
  }

  let fileName = options.file.tempFilePath.includes('tmp/')
    ? options.file.tempFilePath.split('tmp/')[1]
    : options.file.tempFilePath.split('tmp_')[1];
  const fileUrl = `${options.dir}/${fileName}`; // dir表示要传到这个目录下
  const policyBase64 = getPolicyBase64();
  const signature = getSignature(policyBase64); //获取签名
  wx.uploadFile({
    url: clint.rootDir,
    filePath: options.file.tempFilePath,
    name: 'file', // 必须填file
    formData: {
      key: fileUrl,
      policy: policyBase64,
      signature: signature,
      OSSAccessKeyId: clint.accessKeyId,
      'x-oss-security-token': clint.stsToken, // 访问是使用STS临时授权，则需要指定该项为SecurityToken的值
      success_action_status: '200',
    },
    success: function (res) {
      if (res.statusCode != 200) {
        typeof options.failCallback === 'function' &&
          options.failCallback(new Error('上传错误:' + JSON.stringify(res)));
        return;
      }
      // console.log('上传图片成功', res);
      typeof options.successCallback === 'function' &&
        options.successCallback(res);
    },
    fail: function (err) {
      typeof options.failCallback === 'function' && options.failCallback(err);
    },
  });
};

const getPolicyBase64 = function () {
  let date = new Date();
  date.setHours(date.getHours() + clint.timeout);
  let srcT = date.toISOString();
  const policyText = {
    expiration: srcT, // 设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
    conditions: [
      ['content-length-range', 0, 5 * 1024 * 1024], // 设置上传文件的大小限制,5mb
    ],
  };
  const policyBase64 = Base64.encode(JSON.stringify(policyText));
  return policyBase64;
};

const getSignature = function (policyBase64: any) {
  const accessKey = clint.accessKeySecret;
  const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accessKey, {
    asBytes: true,
  });
  const signature = Crypto.util.bytesToBase64(bytes);
  return signature;
};
