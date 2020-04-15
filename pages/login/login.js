const app = getApp()

Page({
  data: {},

  onLoad: function(params) {
    var me = this;
    var redirectUrl = params.redirectUrl;

    //debugger;

    if (redirectUrl != null && redirectUrl != undefined && redirectUrl != '') {
      redirectUrl = redirectUrl.replace(/#/g, "?");
      redirectUrl = redirectUrl.replace(/@/g, "=");

      me.redirectUrl = redirectUrl;
    }

  },
  // 登录  
  doLogin: function(e) {
    var me = this;
    var form = e.detail.value; //获取表单对象
    var username = form.username;
    var password = form.password;
    var repassword = form.repassword;


    // 简单的用户名密码不能为空的验证
    if (username.length == 0 || password.length == 0 || password.length == 0) {
      if (username.length == 0) {
        wx.showToast({
          title: 'sorry用户名不能为空',
          icon: 'none',
          duration: 3000
        })
      }
      if (password.length == 0) {
        wx.showToast({
          title: 'sorry密码不能为空',
          icon: 'none',
          duration: 3000
        })
      }


    } else {

      var serverUrl = app.serverUrl;
      //等待提示
      wx.showLoading({
        title: '请等待...',
      });


      // 调用后端登录接口
      wx.request({
        url: serverUrl + '/login',
        method: "POST",
        data: {
          username: username,
          password: password
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          console.log(res.data);

          if (res.data.status == 200) {

            // 登录成功跳转 
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000
            });

            app.setGlobalUserInfo(res.data.data);
            var redirectUrl = me.redirectUrl;
            //页面跳转
            if (redirectUrl != null && redirectUrl != '' && redirectUrl != undefined) {
              wx.redirectTo({
                url: redirectUrl,
              })
            } else {
              wx.navigateTo({
                url: '../me/me',
              })
            }


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
    }
  },

  gotoRegistPage: function() {
    wx.redirectTo({
      url: '../regist/regist',
    })
  }
})