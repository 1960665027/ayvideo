let url = "https://www.glyac.com/aiyou/index.php?a=";
Page({
  data: {
    loading: false,
    contact: '',
    contant: '',
    vid:'',
    target_user_id:''

  },
 onLoad:function(e)
 {
   let that = this
   that.setData({
     vid:e.vid,
     target_user_id: e.target_user_id
   })
 },
  formSubmit: function (e) {
    let _that = this;
    let content = e.detail.value.opinion;
    if (content == "") {
      wx.showModal({
        title: '提示',
        content: '反馈内容不能为空!',
      })
      return false
    }
      else {
      this.setData({
        loading: true
      })
      wx.request({
        url: url + 'setComment',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          'owner_user_id': wx.getStorageSync('openid'),
          'target_user_id': _that.data.target_user_id ,
          'content': content,
          'vid': _that.data.vid,
          'commentcount': 1
        },
        method: 'POST',
        success: function (res) {
          let status = res.statusCode;
          if (status == 200) {
            _that.setData({
              loading: false,
              contact: '',
              contant: ''
            })
            wx.navigateBack({
              delta: 1,
            })
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 1500
            })
          }
         },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
  },
  
  guanbibind:function(){
    wx.navigateBack({
      delta: 1,
    })
  }
})
