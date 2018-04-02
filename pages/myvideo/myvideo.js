// pages/myvideo/myvideo.js
let url = "https://www.glyac.com/aiyou/index.php?a=";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videodata:"",
    loading:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var openid = wx.getStorageSync('openid');
    wx.request({
      url: url +'getMyVideo' ,
      data: {
        openid:openid
      },
      success: function(res) {
        console.log(res.data)
        if (res.data == '') {
          that.setData({
            loading: false
          })
          return;
        } else {
          that.setData({
            videodata: res.data
          })
        }
       
      },
      fail: function(res) {},
      complete: function(res) {},
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