// app.js
App({
  onLaunch() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      if (res.hasUpdate) {
        console.log('发现新版本')
      }
    })
    updateManager.onUpdateReady(() => {
      updateManager.applyUpdate()
    })
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
