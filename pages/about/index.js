Page({
  data: {
    beian: '闽ICP备2023013432号-5A'
  },
  onLoad() {
    const { SDKVersion } = wx.getAppBaseInfo()
    // #if MP
    const {
      miniProgram
    } = wx.getAccountInfoSync()
    if (miniProgram.envVersion == 'release') {
      this.setData({
        version: miniProgram.version,
        SDKVersion,
        year: new Date().getFullYear()
      })
    } else {
      this.setData({
        version: miniProgram.envVersion,
        SDKVersion,
        year: new Date().getFullYear()
      })
    }
    // #elif NATIVE
    const { version } = wx.getAppBaseInfo()
    this.setData({
      version,
      SDKVersion,
      year: new Date().getFullYear()
    })
    // #endif
  },

  // #if MP
  openChannels() {
    wx.openChannelsUserProfile({
      finderUserName: 'spheXwDzSW8cFTe',
    })
  },
  // #elif NATIVE
  miit() {
    wx.showModal({
      title: '提示',
      content: '将前往工信部备案管理系统',
      confirmText: '继续',
      complete: (res) => {
        if (res.confirm) {
          wx.miniapp.openUrl({
            url: 'https://beian.miit.gov.cn'
          })
        }
      }
    })
  }
  // #endif
})