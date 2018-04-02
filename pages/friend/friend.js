// pages/friend/friend.js
let url = "https://www.glyac.com/aiyou/index.php?a=";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:'',
    followcount:0,
    fensicount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    //视频信息
    wx.request({
      url: url + 'getMyVideo',
      data: {
        openid: options.id
      },
      success: function (res) {
  
        that.setData({
          videodata: res.data
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    //用户信息
    wx.request({
      url: url +'getFriendInfo',
      data: {
        openid: options.id
      },
      success: function(res) {
        that.setData({
          userInfo: res.data
        })
        
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    //关注数量
    wx.request({
      url: url + 'getFollowCount&vid=' + options.id,
      success: function(res) {
        console.log(res)
        that.setData({
          followcount: res.data
        })
        
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    //粉丝数量
    wx.request({
      url: url + 'getFensiCount&openid=' + options.id,
      success: function (res) {
        console.log(res)
        that.setData({
          fensicount: res.data
        })

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})