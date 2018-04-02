var app = getApp();
let url = "https://www.glyac.com/aiyou/index.php?a=";
var commentid = 0;
var curr = 0;
function removeByValue(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}
Page({
  data: {
    videolist:{},
    items: [
      { name: 'AUTO', value: '自动播放', checked: 'true' },
    ],
    type: '取消赞',
    nontype: '取消不赞',
    vid:'',
    status:'',
    zancount:0,
    nonzancount:0,
    videotype:'',
    videorecommend:'',
    followtype:'取消关注',
    openid: '',
    followcount:0,
    currvideo:null,
    quanping:0,
    videopath:'',
    userInfo:'',
    commentlist:'',
    commentcount:'',
    commentzan: '取消评赞',
    pingzancount:0,
    commentid:'',
    noncommentzan:'取消不评赞',
    bupingzancount:0
    
    
  },
  share_button:function(E)
  {
    wx.showShareMenu({
      withShareTicket: true
    })
  }
  ,onShareAppMessage:function()
  {
    
  },
  onLoad:function(res){
    var that = this
    
    
    //根据id请求数据
    wx.request({
      url: url+'getIdVideo&id=' + res.vid,
      success: function(res) {
     
        console.log('paly', res.data)
        var videopath = that.iGetInnerText(res.data['0'].videopath);
        var openid = res.data["0"].openid;
        var id = res.data["0"].id;
        var currvideo = res.data['0'];
        var width = res.data["0"].width;
        var height = res.data["0"].height; 
        //判断全屏的是否竖屏
        if (width < height)
        {
           that.setData({
             quanping:0
           })
        } else if (width == height){
          that.setData({
            quanping: 0
          })
        }else{
          that.setData({
            quanping: 90
          })
        }
        wx.getStorage({
          key: 'record',
          success: function (res) {

          },
          fail: function (res) {
            if (res.errMsg == "getStorage:fail data not found") {
              wx.setStorage({
                key: "record",
                data: currvideo
              });
            } else {
              console.log('获取local其他系统错误');
            }

          }
        })
        that.setData({
          videolist:res.data,
          videopath: videopath,
          openid: openid,
          currvideo: currvideo,
          videoid:id
        })
        //缓存记录
        let historyVideo = [];
        wx.getStorage({
          key: 'record',
          success: function (res) {
            console.log(res.data);
            historyVideo = res.data;


            // if (historyVideo > 20) {
            //     historyVideo.shift();
            // }

            let flag = true;
            for (let item of historyVideo) {
              if (item.id == id) {
                flag = false;
              }
            }

            if (flag) {
              historyVideo.push(currvideo);
              console.log(historyVideo);
            }

            wx.setStorage({
              key: "record",
              data: historyVideo
            });
          },
          fail: function (res) {
            // wx.setStorage({
            //     key: "h",
            //     data: historyVideo
            // });
          }

        })
        wx.setStorage({
          key: "record",
          data: historyVideo
        });
        //获取推荐数据
        wx.request({
          url: 'https://www.glyac.com/aiyou/index.php?a=getVideoRecommend',
          data: {
            videotype:res.data[0].videotype
          },
          success: function (res) {
            console.log('videorecommend', res)
            that.setData({
              videorecommend: res.data
            })

          },
        })
        //关注量
        wx.request({
          url: url + 'getFollowCount',
          data: {
            vid: openid
          },
          success: function (res) {
            console.log('fol', res)
            that.setData({
              followcount: res.data
            })
          },
        })
        //根据判断是否关注了
        wx.request({
          url: url + 'getFollow',
          data: {
            openid: wx.getStorageSync('openid'),
            vid: openid
          },
          success: function (res) {
            console.log('bool', res)
            that.setData({
              status: res.data
            })
            if (res.data == '') {
              return;
            } else if (res.data != '') {
              that.setData({
                followtype: '关注'
              });
            }
          },
        })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
   
    that.setData({
      vid:res.vid
    })
    //获取点赞数量
    wx.request({
      url: url+'getAllZan&vid=' + res.vid,
      success: function (res) {
           console.log('count',res)
           if (res.data == null)
           {
             that.setData({
               zancount: 0
             })
           }else{
             that.setData({
               zancount: parseInt(res.data)
             })
           }
      },
    })
   
    //获取不赞数量
    wx.request({
      url: url+'getNonAllZan&vid=' + res.vid,
      success: function (res) {
        if (res.data == null) {
          that.setData({
            nonzancount: 0
          })
        } else {
          that.setData({
            nonzancount: parseInt(res.data)
          })
        }
      },
    })
    //点击量
    wx.request({
      url: url +'setKanCount&id='+res.vid,
      success: function(res) {

      },
      fail: function(res) {},
      complete: function(res) {},
    })
    //记录播放
    wx.request({
      url: url + 'setVideoPaly',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'openid': wx.getStorageSync('openid'),
        'kan_count': 1,
        'vid': res.vid
      },
      method: 'POST',
      success: function (res) {

      },
      fail: function (res) { },
      complete: function (res) { },
    })

     //根据判断是否点赞
    wx.request({
      url: url+'getDianzan',
      data: {
        openid: wx.getStorageSync('openid'),
        vid:res.vid
      },
      success: function(res) {
        console.log(res)
        that.setData({
          status: res.data
        })
        if (res.data == '')
        {
          return;
        }else if(res.data != '') {
          that.setData({
            type: '赞'
          });
          }
      },
      
    })


    //根据判断是否不赞
    wx.request({
      url: url + 'getNonDianzan',
      data: {
        openid: wx.getStorageSync('openid'),
        vid: res.vid
      },
      success: function (res) {
        console.log(res)
        that.setData({
          status: res.data
        })
        if (res.data == '') {
          return;
        } else if (res.data != '') {
          that.setData({
            nontype: '不赞'
          });
        }
      },
    })

  },
  //下载文件
  downvideo:function(res)
  {
    var that = this
    console.log("down", that.data.videopath)
    wx.showLoading({
      title: '正在下载',
    })
    wx.downloadFile({
      url: that.data.videopath,
      success: function(res) {

        console.log("down", res)
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function (res) {
            var savedFilePath = res.savedFilePath
            wx.showLoading({
              title: '下载完成',
            })
            setTimeout(function () {
              wx.hideLoading()
            }, 2000)
 
          }
        })
      },
      fail: function(res) {
        wx.showLoading({
          title: '下载失败',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)

      },
      complete: function(res) {},
    })
    //点赞事件
  }, dianzanbindtap:function(res)
  {
    var that = this;  
    var type = that.data.type === '取消赞' ? '赞' : '取消赞';
    //赞
    if (type == '赞')
    {
 
      wx.request({
        url: url +'setDianzan' ,
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          openid:wx.getStorageSync('openid'),
          vid: that.data.vid,
          status:1
        },

        success: function(res) {
          const zancounts = (that.data.zancount+1);
          console.log(res)
          that.setData({
            zancount: zancounts
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
  //取消赞
    } else if (type == '取消赞'){
 
      console.log('quzan')
      wx.request({
        url: url + 'setQuDianzan',
        data:{
          vid: that.data.vid,
          openid: wx.getStorageSync('openid')
        },
        success: function(res) {
          const zancounts = (that.data.zancount - 1);
          console.log(res)
          that.setData({
            zancount: zancounts
          })
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }
    that.setData({
      type: type
    });
  },
  //不赞事件
  nonzanbindtap:function()
  {
    var that = this;
    var type = that.data.nontype === '取消不赞' ? '不赞' : '取消不赞';
    //赞
    if (type == '不赞') {
  
      wx.request({
        url: url + 'setNonDianzan',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          openid: wx.getStorageSync('openid'),
          vid: that.data.vid,
          status: 1
        },

        success: function (res) { 
          const nonzancounts = (that.data.nonzancount + 1);
          that.setData({
            nonzancount: nonzancounts
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
      //取消赞
    } else if (type == '取消不赞') {
      console.log('quzan')
      wx.request({
        url: url + 'setNonQuDianzan',
        data: {
          vid: that.data.vid,
          openid: wx.getStorageSync('openid')
        },
        success: function (res) {
          var nonzancount = (that.data.nonzancount - 1);
          that.setData({
            nonzancount: nonzancount
          })
         },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    that.setData({
      nontype: type
    });
  },
  iGetInnerText:function(testStr) {
    var resultStr = testStr.replace(/\ +/g, ""); //去掉空格
          resultStr = testStr.replace(/[ ]/g, "");    //去掉空格
          resultStr = testStr.replace(/[\r\n]/g, ""); //去掉回车换行
          return resultStr;
  },
  followbindtap:function()
  {
    var that = this;
    var type = that.data.followtype === '取消关注' ? '关注' : '取消关注';
    if (type == '关注')
    {
      if (wx.getStorageSync('openid') == that.data.openid)
      {
        wx.showModal({
          title: '提示',
          content: '不能关注自己!',
        })
        return false
      }
      console.log('follw')
      wx.request({
        url: url + 'setFollow',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          openid: wx.getStorageSync('openid'),
          vid: that.data.openid,
          status: 1
        },

        success: function (res) {
          var follow = (res.data + 1);
          that.setData({
            follow: follow
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
      that.setData({
        followtype: type
      });
    }else if(type == '取消关注'){
      console.log('quxiaofollw')
      wx.request({
        url: url + 'setQuFollow',
        data: {
          vid: that.data.openid,
          openid: wx.getStorageSync('openid')
        },
        success: function (res) {
          var follow = (res.data - 1);
          that.setData({
            follow: follow
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
      that.setData({
        followtype: type
      });
    }
   
  },
  //播放完毕自动跳下一集
  endpaly:function(e)
  {
    var that = this
    var vLen = that.data.videorecommend.length;
    var vList = that.data.videorecommend;

    console.log(curr)
    var vid = vList[curr].id
    curr++;
      
      console.log(vid)
      wx.redirectTo({
        url: '../video-play/video-play?vid=' + vid ,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
   
  }
  ,checkboxChange:function(e)
  {
    console.log(e)
 
  },
  bindfull:function(e)
  {
       console.log(e)
  },
  jubaobind:function()
  {
    var that = this
    wx.navigateTo({
      url: '../jubao/jubao?vid=' + that.data.vid + "&videopath=" + that.data.videopath,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  onReady:function(){
    console.log('read')
    var that = this
    that.videoContext = wx.createVideoContext('myVideo')
    //设置评论头像
    that.setData({
      userInfo: app.globalData.userNet
    })
    //获取评论
    wx.request({
      url: url +'getComment',
      data:{
        vid:that.data.vid
      },
      success: function(res) {
         console.log('comment',res)
         //获取评赞数量
         wx.request({
           url: url + 'getPingZanCount',
           data: {
             comid: res.data[0].id
             
           },
           success: function (res) {
             if (res.data == null) {
               that.setData({
                 pingzancount: 0
               })
             } else {
               that.setData({
                 pingzancount: parseInt(res.data)
               })
             }
           },
         })
         //获取不评赞数量
         wx.request({
           url: url + 'getbuPingZanCount',
           data: {
             comid: res.data[0].id

           },
           success: function (res) {
             if (res.data == null) {
               that.setData({
                 bupingzancount: 0
               })
             } else {
               that.setData({
                 bupingzancount: parseInt(res.data)
               })
             }
           },
         })
        //根据判断是否评赞
         wx.request({
           url: url + 'getPingzanBool',
           data: {
             openid: wx.getStorageSync('openid'),
             comid: res.data[0].id,
             vid:that.data.vid
           },
           success: function (res) {

             if (res.data == '') {
               return;
             } else if (res.data != '') {
               that.setData({
                 commentzan: '评赞'
               });
             }
           },

         })
         //根据判断是否不评赞
         wx.request({
           url: url + 'getbuPingzanBool',
           data: {
             openid: wx.getStorageSync('openid'),
             comid: res.data[0].id,
             vid: that.data.vid
           },
           success: function (res) {

             if (res.data == '') {
               return;
             } else if (res.data != '') {
               that.setData({
                 noncommentzan: '不评赞'
               });
             }
           },

         })
         
         that.setData({
           commentlist:res.data,
           commentid:res.data[0].id
         })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    //获取评论总数
    wx.request({
      url: url + 'getCommentCount',
      data: {
        vid: that.data.vid
      },
      success: function(res) {
        that.setData({
          commentcount: res.data
        })
        
      },
      fail: function(res) {},
      complete: function(res) {},
    })
 

  },
  bindcomment:function()
  {
    var that = this
   // that.videoContext.pause();
    wx.navigateTo({
      url: '../commentlist/commentlist?target_user_id=' + that.data.openid + '&vid=' + that.data.vid,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  pingzanbindtap:function()
  {
    var that = this;
    var type = that.data.commentzan === '取消评赞' ? '评赞' : '取消评赞';
    if(type=='评赞')
    {
      wx.request({
        url: url + 'setPingzan',
        data: {
          openid:that.data.openid,
          vid:that.data.vid,
          comid: that.data.commentid,
          like_count:1
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method:'POST',
        success: function (res) {
          const zancounts = (that.data.pingzancount + 1);
          console.log(res)
          that.setData({
            pingzancount: zancounts
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (type =='取消评赞')
    {
      wx.request({
        url: url + 'setNonPingzan',
        data: {
          comid: that.data.commentid,
          openid: that.data.openid,
          vid: that.data.vid,
        },
        success: function (res) {
          var nonzancount = (that.data.pingzancount - 1);
          that.setData({
            pingzancount: nonzancount
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    that.setData({
      commentzan: type
    });
  },
  nonpingzanbindtap:function()
  {
    var that = this;
    var type = that.data.noncommentzan === '取消不评赞' ? '不评赞' : '取消不评赞';
    if (type == '不评赞') {
      wx.request({
        url: url + 'setbuPingzan',
        data: {
          openid: that.data.openid,
          vid: that.data.vid,
          comid: that.data.commentid,
          like_count: 1
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          const zancounts = (that.data.bupingzancount + 1);
          console.log(res)
          that.setData({
            bupingzancount: zancounts
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (type == '取消不评赞') {
      wx.request({
        url: url + 'setNonbuPingzan',
        data: {
          comid: that.data.commentid,
          openid: that.data.openid,
          vid: that.data.vid,
        },
        success: function (res) {
          var nonzancount = (that.data.bupingzancount - 1);
          that.setData({
            bupingzancount: nonzancount
          })
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    }
    that.setData({
      noncommentzan: type
    });
  }
})