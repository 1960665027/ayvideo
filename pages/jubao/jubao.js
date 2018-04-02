// pages/videopost/videopost.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['涉黄', '政治', '显示敏感信息', '有侮辱性或危害性', '这是垃圾信息', '视频不感兴趣', '其他'],
    index: 0,
    vid:'',
    videodata:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that = this
   that.setData({
     vid:options.vid,
     videodata: options.videopath
   })
  },
  formSubmit: function (e) {
    var that = this
    let title = e.detail.value.title;
    if (title == "") {
      wx.showModal({
        title: '提示',
        content: '请说明理由!',
      })
      return false
    }
    else {
     wx.request({
       url:'https://www.glyac.com/aiyou/index.php?a=setReport',
       header: {
         'content-type': 'application/x-www-form-urlencoded'
       },
       data: {
         'vid':that.data.vid,
         'openid': wx.getStorageSync('openid'),
         'title': title,
         'index':that.data.index
       },
       method: 'POST',
       success: function(res) {
         wx.navigateBack({
           delta: 1,
         })
       },
       fail: function(res) {},
       complete: function(res) {},
     })
    }
  },
  bindPickerChange: function (e) {
    console.log(e.detail.value)
    let selectType = e.detail.value
    this.setData({
      index: e.detail.value
    })
  }



})