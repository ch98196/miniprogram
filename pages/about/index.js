Page({
  data: {
    beian: '闽ICP备2023013432号-5A'
  },
  onLoad() {
    const { version, SDKVersion } = wx.getAppBaseInfo()
    this.setData({ version, SDKVersion, year: new Date().getFullYear() })
  },
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
})