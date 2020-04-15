var videoUtil = require('../../utils/videoUtil.js')
const app = getApp()

Page({
  data: {
    cover: "cover",
    videoId: "",
    src: "",
    videoInfo: {},
    userLikeVideo: false,


    commentsPage: 1,
    commentsTotalPage: 1,
    commentsList: [],

    placeholder: "留下你的精彩评论吧"
  },
  videoCtx: {},
  onLoad: function(params) {
    var me = this;
    me.videoCtx = wx.createAudioContext("myvideo", me);

    //获取上一个页面传入的参数
    var videoInfo = JSON.parse(params.videoInfo);

    var height = videoInfo.videoHeight;
    var width = videoInfo.videoWidth;
    var cover = "cover";
    if (width > height) {
      cover = "";
    }
    me.setData({
      videoId: videoInfo.id,
      src: app.serverUrl + videoInfo.videoPath,
      videoInfo: videoInfo,
      cover: cover
    });
    var serverUrl = app.serverUrl;
    var user = app.getGlobalUserInfo();
    var loginUserId = "";
    if (user != null && user != '' && user != undefined) {
      loginUserId = user.id;
    }
    //debugger
    wx.request({
      url: serverUrl + '/user/queryPublisher?loginUserId=' + loginUserId + "&videoId=" + videoInfo.id + "&publishUserId=" + videoInfo.userId,
      method: 'POST',
      success: function(res) {

        console.log(res.data);
        var publisher = res.data.data.publisher;
        var userLikeVideo = res.data.data.userLikeVideo;
        me.setData({
          serverUrl: serverUrl,
          publisher: publisher,
          userLikeVideo: userLikeVideo
        });
      }
    });
    me.getCommentsList(1);

  },


  //播放
  onShow: function() {
    var me = this;
    me.videoCtx.play();
  },


  //双击点赞
  doubleclick: function(e) {

    var me = this;
    if (e.timeStamp - me.touchStartTime < 300) {
      me.likeOrNot();
    }
    me.touchStartTime = e.timeStamp;
  },


  //暂停  
  onHide: function() {
    var me = this;
    me.videoCtx.pause();
  },


  showSearch: function() {
    wx.navigateTo({
      url: '../search/search',
    })
  },



  //上传视频
  upload: function() {
    var me = this;
    var user = app.getGlobalUserInfo();

    var videoInfo = JSON.stringify(me.data.videoInfo);
    var realUrl = '../videoinfo/videoinfo#videoInfo@' + videoInfo;

    if (user == null || user == undefined || user == '') {
      wx.navigateTo({
        url: '../login/login?redirectUrl=' + realUrl,
      })
    } else {
     
      videoUtil.uploadVideo();

    }
  },


  //首页 
  showIndex: function() {
    wx.redirectTo({
      url: '../index/index',
    })
  },

  //点击发布者头像触发的函数
  showPublisher: function() {
    var me = this;

    var user = app.getGlobalUserInfo();

    var videoInfo = me.data.videoInfo;

    var realUrl = '../me/me#publisherId@' + videoInfo.userId;

    if (user == null || user == undefined || user == '') {
      wx.navigateTo({
        url: '../login/login?redirectUrl=' + realUrl,
      })
    } else {
      wx.navigateTo({
        url: '../me/me?publisherId=' + videoInfo.userId,
      })
    }
  },

  showMine: function() {
    var user = app.getGlobalUserInfo();

    //判断是否登录
    if (user == null || user == undefined || user == '') {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      wx.navigateTo({
        url: '../me/me',
      })
    }
  },



  // 点赞与取消
  likeOrNot: function() {
    var me = this;
    var videoInfo = me.data.videoInfo;
    var user = app.getGlobalUserInfo();
    if (user == null || user == '' || user == "undefined") {
      wx.navigateTo({
        url: '../login/login',
      })
    } else {
      var userLikeVideo = me.data.userLikeVideo;
      var url = '/video/userLike?userId=' + user.id + '&videoId=' + videoInfo.id + '&videoCreateId=' + videoInfo.userId;
      if (userLikeVideo) {
        var url = '/video/userUnLike?userId=' + user.id + '&videoId=' + videoInfo.id + '&videoCreateId=' + videoInfo.userId;
      } else {

      }
      var serverUrl = app.serverUrl;
      wx.showLoading({
        title: '...',
      });
    
      wx.request({
        url: serverUrl + url,
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
          'headerUserId': user.id,
          'headerUserToken': user.userToken
        },
        success: function(res) {
          wx.hideLoading();
          me.setData({
            userLikeVideo: !userLikeVideo
          });
        }
      })
    }

  },

  //下载与举报
  shareme: function() {
    var me = this;
    var user = app.getGlobalUserInfo();
    wx.showActionSheet({
      itemList: ['下载到本地', '举报该用户'],
      success(res) {
        console.log(res.tapIndex);
        if (res.tapIndex == 0) {
          // 下载
          wx.showLoading({
            title: '下载中...',
          })
          wx.downloadFile({
            url: app.serverUrl + me.data.videoInfo.videoPath,
            success: function(res) {
              // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
              if (res.statusCode === 200) {
                console.log(res.tempFilePath);

                wx.saveVideoToPhotosAlbum({
                  filePath: res.tempFilePath,
                  success: function(res) {
                    console.log(res.errMsg)
                    wx.hideLoading();
                  }
                })
              }
            }
          })
        } else if (res.tapIndex == 1) {
          // 举报用户
          var videoInfo = JSON.stringify(me.data.videoInfo);
          var realUrl = '../videoinfo/videoinfo#videoInfo@' + videoInfo;

          if (user == null || user == undefined || user == '') {
            wx.navigateTo({
              url: '../login/login?redirectUrl=' + realUrl,
            })
          } else {
            var publishUserId = me.data.videoInfo.userId;
            var videoId = me.data.videoInfo.id;
            var currentUserId = user.id;
            wx.navigateTo({
              url: '../report/report?videoId=' + videoId + "&publishUserId=" + publishUserId
            })
          }
        }
      }
    })
  },


  //分享
  onShareAppmessage: function(res) {
    var me = this;
    var videoInfo = me.data.videoInfo;

    return {
      title: '短视频内容',
      path: "pages/videoinfo/videoinfo?videoInfo=" + JSON.stringify(videoInfo)
    }
  },


  leaveComment: function() {
    this.setData({
      commentFocus: true
    })
  },

  //评论
  saveComment: function(e) {
    var me = this;
    var content = e.detail.value;


    //获取评论回复的 fatherCommentId,toUserId
    
    var fatherCommentId = e.currentTarget.dataset.replyfathercommentid;
    var toUserId = e.currentTarget.dataset.replytouserid;


    var user = app.getGlobalUserInfo();

    var videoInfo = JSON.stringify(me.data.videoInfo);
    var realUrl = '../videoinfo/videoinfo#videoInfo@' + videoInfo;

    if (user == null || user == undefined || user == '') {
      wx.navigateTo({
        url: '../login/login?redirectUrl=' + realUrl,
      })
    } else {
      wx.showLoading({
        title: '请稍后',
      })
      wx.request({
        url: app.serverUrl + '/video/saveComment?fatherCommentId=' + fatherCommentId + "&toUserId=" + toUserId,
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
          'headerUserId': user.id,
          'headerUserToken': user.userToken
        },
        data: {
          fromUserId: user.id,
          videoId: me.data.videoInfo.id,
          comment: content
        },
        success: function(res) {
          console.log(res.data);
          wx.hideLoading();

          me.setData({
            contentValue: "",
            commentsList: []
          });
          me.getCommentsList(1);
        }
      })
    }

  },

  //回复
  replyFocus: function(e) {
    var fatherCommentId = e.currentTarget.dataset.fathercommentid;

    var toUserId = e.currentTarget.dataset.touserid;

    var toNickname = e.currentTarget.dataset.tonickname;

    this.setData({
      placeholder: "回复 " + toNickname,
      replyFatherCommentId: fatherCommentId,
      replyToUserId: toUserId,
      commentFocus: true
    });
  },

  //得到所有评论
  getCommentsList: function(page) {

    var me = this;
    var videoId = me.data.videoInfo.id;

    wx.request({
      url: app.serverUrl + '/video/getVideoComments?videoId=' + videoId + "&page=" + page + "&pageSize=5",
      method: "POST",
      success: function(res) {
        console.log(res.data);

        var commentsList = res.data.data.rows; //查询出来的列表

        var newcommentsList = me.data.commentsList;
        me.setData({
          commentsList: newcommentsList.concat(commentsList), //拼接
          commentsPage: page,
          commentsTotalPage: res.data.data.total,

        });
      }
    })
  },
  onReachBottom: function() {
    var me = this;
    var currentPage = me.data.commentsPage;
    var totalPage = me.data.commentsTotalPage;
    if (currentPage === totalPage) {
      return;
    }

    var page = currentPage + 1;
    me.getCommentsList(page);
  }
})