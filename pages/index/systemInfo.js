Page({
    data: {
        systemInfo: [],
    },

    onLoad() {
        wx.hideHomeButton();
        const {
            model,
            system,
            environment
        } = wx.getSystemInfoSync();
        const {
            version,
            language,
            SDKVersion,
            enableDebug,
            theme
        } = wx.getAppBaseInfo();
        const {
            miniProgram
        } = wx.getAccountInfoSync();
        this.setData({
            theme,
        })
        const systemInfo = [{
            key: '小程序版本',
            value: miniProgram.version || miniProgram.envVersion
        }, {
            key: '微信版本号',
            value: version
        }, {
            key: '基础库版本',
            value: SDKVersion
        }, {
            key: '设备型号',
            value: model
        }, {
            key: '系统版本',
            value: system
        }, {
            key: '系统语言',
            value: language
        }, {
            key: '系统主题',
            value: theme
        }, {
            key: '调试开关',
            value: enableDebug
        }, {
            key: '运行环境',
            value: environment || 'wechat'
        }, ];
        this.setData({
            systemInfo,
        });
    },

    back() {
        wx.navigateBack().catch(() => {
            wx.exitMiniProgram()
        })
    },
})