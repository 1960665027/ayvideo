let url = "https://www.glyac.com/aiyou/index.php?a=";
var videoArray = [];
var currVideo = 1;
 Page({
  data: {
    videolist: '',
    openid:'',
    loading:true
  },
  onLoad:function(e)
  {
    var that= this
        wx.request({
          url: url +'getFollowVideo',
          data: {
            openid: wx.getStorageSync('openid')
          },
          success: function(res) {
            console.log(res)
            videoArray = videoArray.concat(res.data);
            if(res.data == '')
            {
              that.setData({
                loading: false
              })
            }
            that.setData({
              videolist: videoArray,
            })
          },
          fail: function(res) {},
          complete: function(res) {},
        })
  },
  onReachBottom: function (e) {
    var that = this
    console.log('ddd', e)
    currVideo++;
    console.log(currVideo)
    wx.request({
      url: url + 'getFollowVideo',
      data: {
        page: currVideo,
        openid:that.data.openid
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
  }
})