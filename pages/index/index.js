let url = "https://www.glyac.com/aiyou/index.php?a=";
var time = require('../../utils/components/formatTime');
var videoArray = [];
var currVideo = 1;
var app = getApp();
function iGetInnerText(testStr) {
  var resultStr = testStr.replace(/\ +/g, ""); //去掉空格
  resultStr = testStr.replace(/[ ]/g, "");    //去掉空格
  resultStr = testStr.replace(/[\r\n]/g, ""); //去掉回车换行
  return resultStr;
}
Page({
  data:{
    videolist:'',
    inputShowed: false,
    inputVal: "",
    userInfo:"",
    openid:"",
    videotime:{},
    actionSheetHidden: true,
    actionSheetItems: ['拍视频', '相册视频']

  }
  ,
  inputTyping:function()
  {
    wx.navigateTo({
      url: '../search/search',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
  ,shangchuan:function(e){
    var that = this
    that.setData({
      actionSheetHidden: !that.data.actionSheetHidden
    });
  },
  onLoad:function()
  {
    var that = this
   
   
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: url + 'getAllVideo',
      success: function (res) {
        videoArray = videoArray.concat(res.data);
        
        that.setData({
          videolist: videoArray
        })
        console.log(that.data.videotime)
          wx.hideLoading()
      
        
      },
      fail: function (res) {
        setTimeout(function () {
          wx.showLoading({
            title: '网络错误',
          })
          wx.hideLoading()
        }, 2000)
       },
      complete: function (res) { },
    })
   
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //console.log(res)
        if (res.code) {
          //获取openid
          wx.request({
            url: url+'getOpenId',
            data: {
              code: res.code
            }, success: function (res) { 
              that.setData({
                openid: res.data.openid
                
              })
              wx.setStorageSync("openid", res.data.openid)
              //获取用户信息
              wx.request({
                url: url +"getUserInfo",
                data: {openid: res.data.openid},
                success: function (res) {
                  //console.log(res.data)
                  app.globalData.userNet = res.data
                  if (res.data == '')
                  {
                    //调用应用实例的方法获取全局数
                    wx.getUserInfo({
                      success: res => {
                        console.log('success',res)
                        //如果是新用户则记录数据库
                        wx.request({
                          url: url + 'setUserInfo',
                          method: 'POST',
                          header: {
                            'content-type': 'application/x-www-form-urlencoded'
                          },
                          data: {
                            openid: wx.getStorageSync('openid'),
                            avatarUrl: res.userInfo.avatarUrl,
                            city: res.userInfo.city,
                            country: res.userInfo.country,
                            gender: res.userInfo.gender,
                            language: res.userInfo.language,
                            nickName: res.userInfo.nickName,
                            province: res.userInfo.province,
                          },
                          success: function (res) { },
                          fail: function (res) { },
                          complete: function (res) { },
                        })
                        that.setData({
                          userInfo: res.userInfo
                        })
                      },
                      fail: res => {
                        console.log('fail')
                        wx.showModal({
                          title: '警告',
                          content: '您还没有授权头像信息，目前无法正常使用小程序，请先授权,在小程序列表删除后，重新进入小程序即可正常使用',
                          cancelText: '不授权',
                          confirmText: '授权',
                          success: function (res) {
                            if (res.confirm) {
                              console.log('用户点击确定')
                              if (wx.openSetting) {
                                wx.openSetting({
                                  success: (res) => {
                                    res.authSetting = {
                                      "scope.userInfo": true
                                    }
                                  }
                                })
                              } else {
                                // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
                                wx.showModal({
                                  title: '提示',
                                  content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
                                })
                              }
                              wx.openSetting({
                                success: (res) => {
                                  res.authSetting = {
                                    "scope.userInfo": true
                                  }
                                }
                              })
                            }
                            else if (res.cancel) {
                              console.log('用户点击取消')
                              if (wx.openSetting) {
                                wx.openSetting({
                                  success: (res) => {
                                    res.authSetting = {
                                      "scope.userInfo": true
                                    }
                                  }
                                })
                              }
                            }
                          },
                          fail: function (res) { },
                          complete: function (res) { },
                        })
                      }
                    })

                  }
                },
                fail: function (res) { },
                complete: function (res) { },
              })

            },
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })


  },
  onReachBottom:function(e)
  {
    var that = this
    console.log('ddd',e)
    currVideo++;
    console.log(currVideo)
    wx.request({
      url: url + 'getAllVideo',
      data:{
        page:currVideo
      },
      success: function (res) {
        videoArray = videoArray.concat(res.data);
        that.setData({
          videolist: videoArray
        })
        console.log(res)
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onPullDownRefresh:function()
  {
    wx.showLoading({
      title: '加载中',
    })

    var that = this
    wx.request({
      url: url + 'getAllVideo',
      success: function (res) {
        videoArray = res.data
        that.setData({
          videolist: videoArray
        })
        console.log(that.data.videotime)
          wx.hideLoading()
       
        wx.stopPullDownRefresh() //停止下拉刷新
      },
      fail: function (res) { 
        setTimeout(function () {
          wx.showLoading({
            title: '网络错误',
          })
          wx.hideLoading()
        }, 2000)
      },
      complete: function (res) { },
    })
  },
  bindItemTap: function (e) {

    var content = e.currentTarget.dataset.name
    if (content == '相册视频')
    {
      wx.showModal({
        content: '支持35M以下视频MP4格式上传',
        showCancel: false,
        confirmText:'知道了',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.chooseVideo({
              sourceType: ['album'],
              compressed:false,
              success: function (res) {
                wx.navigateTo({
                  url: '../videopost/videopost?id=' + res.tempFilePath + "&time=" + res.duration + "&width=" + res.width + "&height=" + res.height + "&size=" + res.size,
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              }
            })

          }
        }
      })
    }else if(content == '拍视频')
    {
      var that = this
      wx.showModal({
        confirmText: '知道了',
        content: '支持视频15秒拍摄',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            wx.chooseVideo({
              sourceType: ['camera'],
              maxDuration: 15,
              camera: 'back',
              compressed:false,
              success: function (res) {
                console.log('path', res)
                wx.navigateTo({
                  url: '../videopost/videopost?id=' + res.tempFilePath + "&time=" + res.duration + "&width=" + res.width + "&height=" + res.height + "&size=" + res.size,
                  success: function (res) { },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              }
            })
          
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })

    }
   
  },
  actionSheetChange:function()
  {

    var that = this
    that.setData({
      actionSheetHidden: !that.data.actionSheetHidden
    });
  }
})