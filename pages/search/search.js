Page({
  data: {
    inputShowed: false,
    inputVal: "",
    loading:true
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  }
  , inputfirm:function(e)
  {
    
    let inputVal = e.detail.value;
    let that = this
    console.log()
    wx.request({
      url: 'https://www.glyac.com/aiyou/index.php?a=getVideoLike',
      data:{
        title: inputVal
      },
      success: function(res) {
        console.log(res)
        if(res.data == '')
        {
          
          that.setData({
            loading: false
          });

        }
        that.setData({
          videodata: res.data
        });
        
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    wx.request({
      url: 'https://www.glyac.com/aiyou/index.php?a=setUserSearch',
      data: {
       uid:wx.getStorageSync('openid'),
       status:1,
       content: inputVal
      },
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      method: 'POST',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }
});