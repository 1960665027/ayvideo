// pages/videopost/videopost.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    videodata:"",
    videodate:"",
    array: ['搞笑', '游戏', '音乐', '开眼', '生活', '科技','其他'],
     index:0,
     width:"",
     height:"",
     size:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('postpath',options)
    var that=this
    that.setData({
      videodata: options.id,
      videodate: options.time,
      width:options.width,
      height:options.height,
      size:options.size
    })
  },
  formSubmit:function(e)
  {
    var that = this
    let title = e.detail.value.title;
    let content = e.detail.value.content;
    if (title == "") {
      wx.showModal({
        title: '提示',
        content: '标题不能为空!',
      })
      return false
    }
    if (content == "") {
      wx.showModal({
        title: '提示',
        content: '描述不能为空!',
      })
      return false
    }
    if (title == "" && content == "") {
      wx.showModal({
        title: '提示',
        content: '标题内容,描述说明不能为空!',
      })
      return false
    }else{
    console.log(e.detail.value.content)
    console.log('postheight',that.data.height)
   wx.redirectTo({
     url: '../uploadvideo/uploadvideo?videopath=' + that.data.videodata + "&videodate=" + that.data.videodate + "&title=" + e.detail.value.title + "&content=" + e.detail.value.content + "&index=" + that.data.index + "&width=" + that.data.width + "&height=" + that.data.height + "&size=" + that.data.size,
     success: function(res) {},
     fail: function(res) {},
     complete: function(res) {},
   })
    }
  },
  bindPickerChange:function(e)
  {
    console.log(e.detail.value)
    let selectType = e.detail.value
    this.setData({
      index: e.detail.value
    })
  }
  


})