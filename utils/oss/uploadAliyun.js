const env = require('./config.js');

const Base64 = require('./Base64.js');

require('./hmac.js');
require('./sha1.js');
const Crypto = require('./crypto.js');


const uploadFile = function (params) {
  if (!params.filePath || params.filePath.length < 9) {
        wx.showModal({
            title: '视频错误',
            content: '请重试',
            showCancel: false,
        })
        return;
    }

    //const aliyunFileKey = fileW+filePath.replace('wxfile://', '')；
    const openid =  wx.getStorageSync("openid");
    const aliyunFileKey = params.filePath.replace('wxfile://', '');
    const videodata = params.videodata; 
    const aliyunServerURL = env.aliyunServerURL;
    const accessid = env.accessid;
    const policyBase64 = getPolicyBase64();
    const signature = getSignature(policyBase64);
    const uploadTask =  wx.uploadFile({
        url: aliyunServerURL, //接口地址
        filePath: params.filePath,      
        name: 'file',
        formData: {
            'key': aliyunFileKey,
            'OSSAccessKeyId': accessid,
            'policy': policyBase64,
            'Signature': signature,
            'success_action_status': '200',
        },
        success: function (res) {
          console.log('success',res)
            if (res.statusCode != 200) {
              wx.showModal({
                title: '提示',
                content: '参数错误，请重新上传！',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                   
                    wx.redirectTo({
                      url: '../uploadvideo/uploadvideo?videopath=' + videodata.videopath + "&videodate=" + videodata.videodate + "&title=" + videodata.title + "&content=" + videodata.content + "&index=" + videodata.index + "&width=" + videodata.width + "&height=" + videodata.height + "&size=" + videodata.size,
                      success: function (res) { },
                      fail: function (res) { },
                      complete: function (res) { },
                    })
                  }
                }
              })
                return;
            }
            
            wx.request({
              url: 'https://www.glyac.com/aiyou/index.php?a=setVideoPoster',
              method: 'GET',
              data: {
                'filename': aliyunFileKey
              },
              success: function (res) {
               // console.log('end', videodata.videodate)
                //console.log('end', videodata.width)
                wx.request({
                  url: "https://www.glyac.com/aiyou/index.php?a=setVideoInfor",
                  data: {
                    openid: openid,
                    videopath: aliyunFileKey,
                    videotime: videodata.videodate,
                    title: videodata.title,
                    content: videodata.content,
                    videotype: videodata.index,
                    width: videodata.width,
                    height: videodata.height,
                    size: videodata.size,
                  },
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function (res) {
                   wx.hideLoading();
                    wx.showModal({
                      title: '提示',
                      content: '上传完成',
                      showCancel:false,
                      success: function (res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                          wx.redirectTo({
                            url: '../myvideo/myvideo',
                            success: function(res) {},
                            fail: function(res) {},
                            complete: function(res) {},
                          })
                        }
                      }
                    })
                   
                  },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              },
              fail: function (res) { },
              complete: function (res) { },
            })
            //params.successCB(aliyunFileKey);
        },
        fail: function (err) {
          console.log('err',err)
            err.wxaddinfo = aliyunServerURL;
            wx.showModal({
              title: '提示',
              content: '上传失败',
            })
        },
    })
   uploadTask.onProgressUpdate((res) => {
     wx.showLoading({
       title: '当前进度：' + res.progress+'%'
     })
     //console.log('已经上传的数据长度', res.totalBytesSent)
     //console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
     if (res.progress == 100)
     {
       wx.showLoading({
         title: '请稍后...'
       })
     }


   })

}

const getPolicyBase64 = function () {
    let date = new Date(); 
    date.setHours(date.getHours() + env.timeout);
    console.log('srcT=', date);
    let srcT = date.toISOString();
    const policyText = {
        "expiration": srcT, //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了 指定了Post请求必须发生在2020年01月01日12点之前("2020-01-01T12:00:00.000Z")。
        "conditions": [
            ["content-length-range", 0, 35 * 1024 * 1024] // 设置上传文件的大小限制,1048576000=1000mb
        ]
    };

    const policyBase64 = Base64.encode(JSON.stringify(policyText));
    return policyBase64;
}

const getSignature = function (policyBase64) {
    const accesskey = env.accesskey;

    const bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accesskey, {
        asBytes: true
    });
    const signature = Crypto.util.bytesToBase64(bytes);

    return signature;
}

module.exports = uploadFile;