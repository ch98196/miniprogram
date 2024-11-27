// app.js
App({
  onLaunch() {

  },
  onThemeChange(e){
    wx.setNavigationBarColor({
      backgroundColor: e.theme == 'light' ? '#ffffff':'#242424',
      frontColor: e.theme == 'light' ? '#000000' : '#ffffff'
    })
  },
  globalData: {
    
  }
})
