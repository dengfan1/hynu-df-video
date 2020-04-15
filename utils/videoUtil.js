function uploadVideo() {
  var me = this;
  wx.chooseVideo({
    sourceType: ['album'],
    success(res) {
      console.log(res);
      var duration = res.duration;
      var tmpHeight = res.height;
      var tmpWidth = res.width;
      var tmpVideoUrl = res.tempFilePath;
      var tmpCoverUrl = res.thumTempFilePath;

      if (duration > 20) {
        wx.showToast({
          title: '视频长度不可以超过20秒',
          icon: "none",
          duration: 2500
        })
      } else if (duration < 1) {
        wx.showToast({
          title: '视频太短，请上传超过一秒的视频...',
          icon: "none",
          duration: 2500
        })
      } else {
        //打开选择bgm的页面
        wx.navigateTo({
          url: '../bgm/bgm?duration=' + duration +
            "&tmpHeight=" + tmpHeight +
            "&tmpWidth=" + tmpWidth +
            "&tmpVideoUrl=" + tmpVideoUrl +
            "&tmpCoverUrl=" + tmpCoverUrl,
        })

      }
    }
  })
}

module.exports={
  uploadVideo: uploadVideo
}