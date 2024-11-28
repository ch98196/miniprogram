Page({
  data: {

  },

  onLoad(options) {
    if(options.url == undefined){
      wx.navigateBack()
    } else {
      this.setData({
        url: decodeURIComponent(options.url)
      })
    }
  }
})