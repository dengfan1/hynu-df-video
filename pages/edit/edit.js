const app = getApp()
Page({
  data: {
    faceUrl: "",
    nickvalue: "",
    signvalue: "",
    classvalue: ""
    
  },

  onLoad: function(params) {
    var me = this;
    var user = app.getGlobalUserInfo();
    var userId = user.id;
    var redirectUrl = params.redirectUrl;

  

    wx.showLoading({
      title: '请等待...',
    });
    var serverUrl = app.serverUrl;
    // 调用后端
    wx.request({
      url: serverUrl + '/user/findinfo?userId=' + userId,
      method: "POST",
      header: {
        'content-type': 'application/json', // 默认值
        'headerUserId': user.id,
        'headerUserToken': user.userToken
      },
      success: function(res) {
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
            nickvalue: userInfo.nickname,
            signvalue: userInfo.sign,
            classvalue: userInfo.youclass
            
          });

        } else if (res.data.status == 502) {
          wx.showToast({
            title: res.data.msg,
            duration: 3000,
            icon: "none",
            success: function() {
              wx.redirectTo({
                url: '../index/index',
              })
            }
          })
        }
      }
    })
 

  },

  //编辑信息提交
  dosubmit: function(e) {
    var me = this;
    var user = app.getGlobalUserInfo();
    var userId = user.id;

   
    var form = e.detail.value; //获取表单对象
    var nickname = form.nickname;
    var sign = form.sign;
    var youclass = form.youclass;

    var serverUrl = app.serverUrl;
    //等待提示
    wx.showLoading({
      title: '请等待...',
    });


    // 调用后端登录接口
    wx.request({
      url: serverUrl + '/user/editinfo?userId='+userId+"&nickname="+nickname+"&sign="+sign+"&youclass="+youclass,
      method: "POST",
      data: {
        nickname:nickname,
        sign:sign,
        youclass:youclass
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        console.log(res.data);

        if (res.data.status == 200) {

          // 登录成功跳转 
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          });

          wx.switchTab({
            url: '../me/me',
          })

        } else if (res.data.status == 500) {
          // 失败弹出框
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000
          })

        }
      }
    })

  },
  //更换头像
  changeFace: function () {
    var me = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);

        wx.showLoading({
          title: '正在上传中...',
        })
        var serverUrl = app.serverUrl;

        var userInfo = app.getGlobalUserInfo();

        wx.uploadFile({
          url: serverUrl + '/user/uploadFace?userId=' + userInfo.id, //app.userInfo.id,
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'content-type': 'application/json', // 默认值
            'headerUserId': userInfo.id,
            'headerUserToken': userInfo.userToken
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            console.log(data);
            wx.hideLoading();

            if (data.status == 200) {
              wx.showToast({
                title: '上传成功!~~',
                icon: "success"
              });

              var imageUrl = data.data;
              me.setData({
                faceUrl: serverUrl + imageUrl
              });

            } else if (data.status == 500) {
              wx.showToast({
                title: data.msg
              });
            } else if (res.data.status == 502) {
              wx.showToast({
                title: res.data.msg,
                duration: 2000,
                icon: "none",
                success: function () {
                  wx.redirectTo({
                    url: '../login/login',
                  })
                }
              });

            }

          }
        })


      }
    })
  }


})