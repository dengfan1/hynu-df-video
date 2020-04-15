const app = getApp()

Page({
  data: {

  },
  doRegist: function(e) {
    var formObject = e.detail.value;

    var username = formObject.username; //接收用户名
    var password = formObject.password; //接收密码
    var repassword = formObject.repassword;
    var nickname = formObject.nickname;
    var youclass = formObject.youclass;

    if (username.length == 0 || password.length == 0 || repassword.length == 0 || nickname.length == 0 || youclass.length == 0) {
      if (nickname.length == 0) {
        wx.showToast({
          title: '请填写昵称',
          icon: 'none',
          duration: 3000
        })
      } else if (username.length == 0) {
        wx.showToast({
          title: 'sorry账号不能为空',
          icon: 'none',
          duration: 3000
        })
      } else
      if (password.length == 0) {
        wx.showToast({
          title: 'sorry密码不能为空',
          icon: 'none',
          duration: 3000
        })
      } else
      if (repassword.length == 0) {
        wx.showToast({
          title: 'sorry确认密码不能为空',
          icon: 'none',
          duration: 3000
        })
      } else if (youclass.length == 0) {
        wx.showToast({
          title: '请填写学院',
          icon: 'none',
          duration: 3000
        })
      }
    } else
    if (password != repassword) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none',
        duration: 3000
      })
    } else {

      var serverUrl = app.serverUrl;
      wx.request({
        url: serverUrl + '/regist',
        method: "POST",
        data: {
          //将账号和密码传给后端
          username: username,
          password: password,
          nickname:nickname,
          youclass:youclass
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          console.log(res.data)
          var status = res.data.status;

          if (status == 200) {
            wx.showToast({
              title: '恭喜您注册成功',
              icon: 'none',
              duration: 5000

            })

            //修改原有的全局对象为本地缓存
            app.setGlobalUserInfo(res.data.data);
            //重定向
            wx.redirectTo({
              url: '../login/login',
            })
          } else if (status == 500) {
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

  //返回登录页面
  goLoginPage: function() {
    wx.redirectTo({
      url: '../login/login',
    })
  }

})