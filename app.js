// app.js
App({
    onLaunch() {
        wx.hideShareMenu();

        const updateManager = wx.getUpdateManager();

        updateManager.onCheckForUpdate((res) => {
            if (res.hasUpdate) {
                console.log('检测到新版本')
            }
        });

        updateManager.onUpdateReady(() => {
            updateManager.applyUpdate()
        });

        updateManager.onUpdateFailed(() => {
            console.log('新版本下载失败')
        });
    }
})