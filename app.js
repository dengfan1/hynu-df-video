App({
  serverUrl: "http://192.168.0.109:8087/",
  userInfo: null,

  setGlobalUserInfo:function(user){
    wx.setStorageSync("userInfo", user)
  },

   getGlobalUserInfo: function () {
    return wx.getStorageSync("userInfo")
  },

  reportReasonArray:[
    "引人不适",
    "政治敏感",
    "过于暴力",
    "色情庸俗",
    "侮辱谩骂",
    "涉嫌诈骗",
    "其他原因"

  ]


})