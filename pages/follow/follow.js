const app = getApp()

Page({
  //初始化页面数据
  data: {
    faceUrl: "../resource/images/noneface.png",
    isMe: true,
    isFollow: false,
    islogin: true,

    videoSelClass: "video-info",
    isSelectedWork: "video-info-selected",
    isSelectedLike: "",
    isSelectedFollow: "",

    myVideoList: [],
    myVideoPage: 1,
    myVideoTotal: 1,


    followVideoList: [],
    followVideoPage: 1,
    followVideoTotal: 1,


    likeVideoList: [],
    likeVideoPage: 1,
    likeVideoTotal: 1,

    myWorkFalg: false,
    myLikesFalg: true,
    myFollowFalg: true,

    yousign: "",
    youclss: "",

    myVideocount: "",
    followvideoCount: "",
    likevideocount: "",
     screenWidth: 350,

  },

  //页面加载
  onLoad: function (params) {
    var me = this;
    var screenWidth = wx.getSystemInfoSync().screenWidth;
    me.setData({
      screenWidth: screenWidth,
    });
    var user = app.getGlobalUserInfo();

    var userId = user.id;

    var publisherId = params.publisherId;

    if (userId == null || userId == '' || userId == undefined) {
      me.setData({
        islogin: false
      })
    }

    if (publisherId != null && publisherId != '' && publisherId != undefined) {

      if (publisherId == userId) {

        me.setData({
          isMe: true,
          publisherId: publisherId,
          serverUrl: app.serverUrl

        })
      } else {
        me.setData({
          isMe: false,
          publisherId: publisherId,
          serverUrl: app.serverUrl
        })
        // debugger
      }
      userId = publisherId;

    }

    me.setData({
      userId: userId,
    })


    wx.showLoading({
      title: '请等待...',
    });
    var serverUrl = app.serverUrl;
    // 调用后端
    wx.request({
      url: serverUrl + '/user/query?userId=' + userId + "&fanId=" + user.id,
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'headerUserId': user.id,
        'headerUserToken': user.userToken
      },
      success: function (res) {
        console.log(res.data);
        wx.hideLoading();
        if (res.data.status == 200) {
          var userInfo = res.data.data;
          var faceUrl = "../resource/images/noneface.png";
          if (userInfo.faceImage != null && userInfo.faceImage != '' && userInfo.faceImage != undefined) {
            faceUrl = serverUrl + userInfo.faceImage;
          }


          me.setData({
            faceUrl: faceUrl,
            fansCounts: userInfo.fansCounts,
            followCounts: userInfo.followCounts,
            receiveLikeCounts: userInfo.receiveLikeCounts,
            nickname: userInfo.nickname,
            isFollow: userInfo.follow,
            yousign: userInfo.sign,
            youclass: userInfo.youclass
          });

        } else if (res.data.status == 502) {
          wx.showToast({
            title: res.data.msg,
            duration: 3000,
            icon: "none",
            success: function () {
              wx.redirectTo({
                url: '../login/login',
              })
            }
          })
        }
      }
    }) ,
    this.setData({
     
      followVideoList: [],
      followVideoPage: 1,
      followVideoTotal: 1,

      followVideocount: ""
    });

    this.getMyFollowList(1)
  },


  getMyFollowList: function (page) {
    var me = this;
    var userId = me.data.userId;

    // 查询视频信息
    wx.showLoading();
    // 调用后端
    var serverUrl = app.serverUrl;
    wx.request({
      url: serverUrl + '/video/showMyFollow/?userId=' + userId + '&page=' + page + '&pageSize=6',
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        var followVideoList = res.data.data.rows;
        wx.hideLoading();

        var newVideoList = me.data.followVideoList;
        me.setData({
          followVideoPage: page,
          followVideoList: newVideoList.concat(followVideoList),
          followVideoTotal: res.data.data.total,
          serverUrl: app.serverUrl,
          followVideocount: res.data.data.records
        });
      }
    })
  },

  // 点击跳转到视频详情页面
  showVideo: function (e) {

    var me = this;
    var followVideoList = me.data.followVideoList;
    var arrindex = e.target.dataset.arrindex;
    var videoInfo = JSON.stringify(followVideoList[arrindex]);

    wx.redirectTo({
      url: '../videoinfo/videoinfo?videoInfo=' + videoInfo
    })

  },

  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    this.getMyFollowList(1);
  },
  // 到底部后触发加载
  onReachBottom: function () {

    var myFollowFalg = this.data.myFollowFalg;
    if (!myFollowFalg) {
      var currentPage = this.data.followVideoPage;
      var totalPage = this.data.followVideoTotal;
      // 获取总页数进行判断，如果当前页数和总页数相等，则不分页
      if (currentPage === totalPage) {
        wx.showToast({
          title: '已经没有视频啦...',
          icon: "none"
        });
        return;
      }
      var page = currentPage + 1;
      this.getMyFollowList(page);
    }

  },


})