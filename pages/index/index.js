{
    Page({
        data: {
            condition: '-1',
            systemTime: '',
            activityName: '',
            list: [],
            count: '',
            setTime: 3,
            isMotto: false,
            isEdit: false,
            inputValue: '',
            inputStatus: '',
            inputTips: '',
            showToptips: false,
            status: '',
            msg: '',

            //单选框
            value: 0,
            options: [{
                    label: '3秒',
                    value: 3
                },
                {
                    label: '5秒',
                    value: 5
                },
                {
                    label: '10秒',
                    value: 10
                },
            ],
        },

        onLoad() {
            const { theme } = wx.getAppBaseInfo();
            this.setData({
                theme,
            })
            const config = wx.getStorageSync('config')
            if (config) {
                this.setData({
                    list: config.list,
                    value: config.value,
                    setTime: this.data.options[config.value].value,
                    activityName: config.activityName,
                })
            } else {
                this.edit()
            }
            if (this.data.list.length < 2 || this.data.activityName.length < 2) {
                this.edit()
            }
        },

        /**
         * 编辑开关
         */
        edit() {
            if (this.data.condition >= 0) {
                this.setData({
                    condition: -1
                })
            }
            this.setData({
                isEdit: true,
            })
        },
        /**
         * 保存配置
         */
        save() {
            if (this.data.list.length < 2) {
                this.setData({
                    showToptips: true,
                    status: 'error',
                    msg: '可抽选数量不足，请配置后保存'
                });
                setTimeout(() => {
                    this.setData({
                        showToptips: false,
                    })
                }, 3000);
            } else if (this.data.activityName.length < 2) {
                this.setData({
                    showToptips: true,
                    status: 'error',
                    msg: '活动名称不得为空'
                });
                setTimeout(() => {
                    this.setData({
                        showToptips: false,
                    })
                }, 3000);
            } else {
                this.setData({
                    isEdit: false,
                    activityName: this.data.activityName,
                })
                const config = {
                    list: this.data.list,
                    value: this.data.value,
                    activityName: this.data.activityName,
                }
                wx.setStorage({
                    key: 'config',
                    data: config
                }).then(() => {
                    this.setData({
                        showToptips: true,
                        status: 'success',
                        msg: '在本次抽选完成之前，此配置将缓存'
                    });
                    setTimeout(() => {
                        this.setData({
                            showToptips: false,
                        })
                    }, 3000);
                })
            }
        },

        /**
         * 抽选名单相关方法
         */
        add(e) {
            let list = this.data.list
            if (list.includes(e.detail.value)) {
                this.setData({
                    inputStatus: 'error',
                    inputTips: '名称重复'
                })
            } else {
                list.push(e.detail.value)
                this.setData({
                    list,
                    inputValue: '',
                })
            }
        },
        change() {
            if (this.data.inputStatus == 'error') {
                this.setData({
                    inputStatus: '',
                    inputTips: ''
                })
            }
        },
        delete(e) {
            const item = e.currentTarget.dataset.item
            let list = this.data.list
            const index = list.indexOf(item)
            list.splice(index, 1)
            this.setData({
                list,
            })
        },
        bindInput(e) {
            this.data.activityName = e.detail.value
        },

        /**
         * 选择器相关方法
         */
        bindPickerChange(e) {
            this.setData({
                value: e.detail.value,
                setTime: this.data.options[e.detail.value].value
            });
        },

        /**
         * 开始抽选
         */
        startMotto() {
            if (this.data.list.length < 2) {
                this.setData({
                    showToptips: true,
                    status: 'error',
                    msg: '可抽选数量不足，无法开始'
                });
                setTimeout(() => {
                    this.setData({
                        showToptips: false,
                    })
                }, 3000);
            } else if (this.data.activityName.length < 2) {
                this.setData({
                    showToptips: true,
                    status: 'error',
                    msg: '活动名称为空，无法开始'
                });
                setTimeout(() => {
                    this.setData({
                        showToptips: false,
                    })
                }, 3000);
            } else {
                this.setData({
                    isMotto: true,
                    count: this.data.setTime,
                })
                var that = this;
                this.interval = setInterval(function () {
                    that.setData({
                        condition: Math.floor(Math.random() * that.data.list.length + 1)
                    })
                }, 10) //代表0.01秒钟发送一次请求

                let count = this.data.setTime;
                this.count = setInterval(function () {
                    count--;
                    that.setData({
                        count,
                    })
                    if (count <= 0) {
                        clearInterval(that.interval);
                        clearInterval(that.count);
                        const time = Date.parse(new Date()) / 1000;
                        const formatTime = that.formatTime(time);
                        that.setData({
                            isMotto: false,
                            systemTime: formatTime
                        })
                        wx.clearStorage()
                    }
                }, 1000)
            }
        },
        /**
         * 结束抽选（目前是定时制，此方法不可用）
         */
        endMotto() {
            this.setData({
                isMotto: false
            })
            clearInterval(this.interval);
            clearInterval(this.count);
        },

        formatTime(timestamp) {
            var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            var Y = date.getFullYear() + '-';
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
            var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
            var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            return Y + M + D + h + m + s;
        }
    })
}