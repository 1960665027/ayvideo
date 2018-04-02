let url = "https://www.glyac.com/aiyou/index.php?a=";
Page({
  data: {
    bodyList: [
      {
        id: 1,
        title: "搞笑"
      },
      {
        id: 2,
        title: "游戏"
      },
      {
        id: 3,
        title: "音乐"
      }, {
        id: 4,
        title: "开眼"
      }, {
        id: 5,
        title: "生活"
      }, {
        id: 6,
        title: "科技"
      } , {
        id: 7,
        title: "其他"
      }
    ],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    videolist:''
  },
  onLoad: function (param) {
    var mythis = this;
    //获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        mythis.setData({
          windowHeight: res.windowHeight - 51, windowWidth: res.windowWidth, sliderLeft: 8, sliderOffset: res.windowWidth / mythis.data.bodyList.length * mythis.data.activeIndex
        });
      }
    })
    //视频信息
    wx.request({
      url: url + 'getVideoType',
      data: {
        videotype: 0
      },
      success: function (res) {
        console.log(res)
        mythis.setData({
          videolist: res.data
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  tabClick: function (e) {
    var id = e.currentTarget.id;
    console.log(id)
    var mythis = this;
    mythis.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: id,
    });
    //获取推荐数据
    wx.request({
      url: 'https://www.glyac.com/aiyou/index.php?a=getVideoType',
      data: {
        videotype: id
      },
      success: function (res) {
        console.log('videotype', res)
        mythis.setData({
          videolist: res.data
        })

      }
    })
  }
});
