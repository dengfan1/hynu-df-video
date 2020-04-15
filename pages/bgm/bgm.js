const app = getApp()

Page({
  data: {
    bgmList: [],
    serverUrl: "",
    videoParams:{}
  },

  onLoad: function (params) {
    var i = this;
    console.log(params);
    i.setData({
      videoParams:params
    });
    wx.showLoading({
      title: '请等待...',
    });
    var serverUrl = app.serverUrl;
  
   
    // 调用后端
    wx.request({
      url: serverUrl + '/bgm/list',
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
       // console.log(res.data);
        console.log(serverUrl);
        wx.hideLoading();
        if (res.data.status == 200) {
          var bgmList = res.data.data;
          console.log(bgmList);
          i.setData({
            bgmList: bgmList,
            serverUrl: serverUrl
          });
        } 
      }
    })
  },
  

    




  upload: function (e) {
    var me = this;

    var bgmId = e.detail.value.bgmId;
    var desc = e.detail.value.desc;

    console.log("bgmId:" + bgmId);
    console.log("desc:" + desc);

    var duration = me.data.videoParams.duration;
    var tmpHeight = me.data.videoParams.tmpHeight;
    var tmpWidth = me.data.videoParams.tmpWidth;
    var tmpVideoUrl = me.data.videoParams.tmpVideoUrl;
    var tmpCoverUrl = me.data.videoParams.tmpCoverUrl;

    // 上传短视频
    wx.showLoading({
      title: '上传中...',
    })
    var serverUrl = app.serverUrl;
   
    //fixme 修改原有的全局对象为本地缓存
    var userInfo = app.getGlobalUserInfo();
    wx.uploadFile({
      url: serverUrl + '/video/upload',
      formData: {
        userId:userInfo.id,    
        bgmId: bgmId,
        desc: desc,
        videoSeconds: duration,
        videoHeight: tmpHeight,
        videoWidth: tmpWidth
      },
      filePath: tmpVideoUrl,
      name: 'file',
      header: {
        'content-type': 'application/json', // 默认值
       
      },
      success: function (res) {
        var data = JSON.parse(res.data);
        wx.hideLoading();
        if (data.status == 200) {

          wx.showToast({
            title: '上传成功!~~',
            icon: "success"
          });
          wx.navigateBack({
            success: function () {
              beforePage.onLoad(); // 执行前一个页面的onLoad方法
            }
          });
         
        //  var videoId=data.data;

        //   wx.showLoading({
        //     title: '上传中...',
        //   })
        

        //   wx.uploadFile({
        //     url: serverUrl + '/video/uploadCover',
        //     formData: {
        //         userId:app.userInfo.id,
        //         videoId:videoId
        //     },
        //     filePath: tmpCoverUrl,
        //     name: 'file',
        //     header: {
        //       'content-type': 'application/json', // 默认值

        //     },
        //     success: function (res) {
        //       var data = JSON.parse(res.data);
        //       wx.hideLoading();
        //       if (data.status == 200) {
        //         wx.showToast({
        //           title: '上传成功!~~',
        //           icon: "success"
        //         }); 
        //         wx.navigateBack({
        //           delta: 1,
        //         }) 


          //     } else {
          //       wx.showToast({
          //         title: '上传失败!~~',
          //         icon: "success"
          //       });
          //     }

          //   }
          // })



        }else{
          wx.showToast({
            title: '上传失败!~~',
            icon: "success"
          });  
        } 

      }
    })
  }

})

