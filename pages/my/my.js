var app = getApp();
Page({
  data: {
    userInfo: "",
  },
  onLoad: function (options) {
    console.log(app.globalData.userNet[0])
    var that = this
    that.setData({
      userInfo: app.globalData.userNet
    })
  }
})