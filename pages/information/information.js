var app = getApp();
let url = "https://www.glyac.com/aiyou/index.php?a=";
Page({
  data: {
    userInfo: {},
    followcount:0,
    myfollowcount:0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    that.setData({
      userInfo: app.globalData.userNet
    })
    //关注数量
    wx.request({
      url: url + 'getFollowCount&vid=' + wx.getStorageSync('openid'),
      success: function (res) {
        console.log(res)
        that.setData({
          followcount: res.data
        })

      },
      fail: function (res) { },
      complete: function (res) { },
    })
    //关注数量
    wx.request({
      url: url + 'getMyFollowCount&openid=' + wx.getStorageSync('openid'),
      success: function (res) {
        console.log(res)
        that.setData({
          myfollowcount: res.data
        })

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})