Page({
  data: {
    // 配置区
    visible: {
      options: false,
      edit: false,
      picker: false,
    },
    orderGroupList: [{ label: '不指定团体', value: 0 }],
    currentIndex: null,
    currentData: {
      name: '',
      member: '',
    },
    errmsg: ['', ''],
    name: '',
    orderGroupId: -1,
    textarea: {
      minHeight: 48,
    },
    list: [],
    // 结果区
    status: 0,
    result: {
      group: -1,
      member: -1,
      time: '',
    },
  },

  onLoad() {
    const { statusBarHeight, screenHeight, safeArea, windowHeight } = wx.getWindowInfo()
    let query = wx.createSelectorQuery().in(this);
    query.select('.result-card').boundingClientRect();
    query.exec((res) => {
      let cardHeight = res[0].height
      this.setData({
        statusBarHeight,
        bottomHeight: screenHeight - safeArea.bottom,
        contentHeight: windowHeight - (cardHeight + 16) - (screenHeight - safeArea.bottom) - statusBarHeight - 80
      })
    })

    let name = wx.getStorageSync('name');
    if (name === '') {
      name = ''
    }
    let list = wx.getStorageSync('list');
    if (list === '') {
      list = []
    }
    let orderGroupId = wx.getStorageSync('orderGroupId');
    if (orderGroupId === '') {
      orderGroupId = -1
    } else if (orderGroupId >= list.length) {
      wx.removeStorageSync('orderGroupId')
      orderGroupId = -1
    }
    this.setData({
      name,
      list,
      orderGroupId,
    });
  },

  openOptions() {
    this.setData({
      ['visible.options']: true,
      ['currentData.name']: this.data.name,
      currentIndex: [this.data.orderGroupId + 1]
    })
  },

  closeOptions() {
    if (this.data.currentData.name.length > 0) {
      wx.setStorageSync('name', this.data.name);
    } else {
      wx.removeStorageSync('name');
    }
    if (this.data.currentIndex[0] > 0) {
      wx.setStorageSync('orderGroupId', this.data.currentIndex[0] - 1);
    } else {
      wx.removeStorageSync('orderGroupId');
    }
    this.setData({
      name: this.data.currentData.name,
      orderGroupId: this.data.currentIndex[0] - 1,
      ['visible.options']: false,
      currentIndex: null,
      currentData: {
        name: '',
        member: '',
      },
      result: {
        group: -1,
        member: -1,
        time: '',
      }
    })
  },

  onOptionsChange(e) {
    this.setData({
      ['visible.options']: e.detail.visible
    });
  },

  onEditChange(e) {
    if (e.detail.visible == false) {
      this.closeEdit()
    }
  },

  add() {
    this.setData({
      ['visible.edit']: true,
      result: {
        group: -1,
        member: -1,
        time: '',
      },
      currentIndex: this.data.list.length,
    });
  },

  edit(e) {
    const that = this;
    const { id } = e.currentTarget.dataset;
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success(res) {
        if (res.tapIndex == 0) {
          that.setData({
            ['visible.edit']: true,
            result: {
              group: -1,
              member: -1,
              time: '',
            },
            currentIndex: id,
            currentData: {
              name: that.data.list[id].name,
              member: that.data.list[id].member.join('，'),
            },
          });
        } else if (res.tapIndex == 1) {
          wx.showModal({
            content: `确认删除「${that.data.list[id].name}」？`,
            confirmColor: '#d54941',
            complete: (res) => {
              if (res.confirm) {
                let list = that.data.list;
                list.splice(id, 1);
                that.setData({
                  result: {
                    group: -1,
                    member: -1,
                    time: '',
                  },
                  list
                });
                if (that.data.list.length == 0) {
                  wx.removeStorageSync('list');
                } else {
                  wx.setStorageSync('list', that.data.list);
                }
                if (that.data.orderGroupId >= id) {
                  this.clearOrder();
                }
              }
            }
          })
        }
      },
    })
  },

  closeEdit() {
    this.setData({
      ['visible.edit']: false,
      currentIndex: null,
      currentData: {
        name: '',
        member: '',
      },
      errmsg: ['', '']
    })
  },

  onNameChange(e) {
    this.setData({
      ['errmsg[0]']: '',
      ['currentData.name']: e.detail.value,
    });
  },

  onMemberChange(e) {
    this.setData({
      ['errmsg[1]']: '',
      ['currentData.member']: e.detail.value.replace(/\s+|@/g, ''),
    });
  },

  save() {
    if (this.data.currentData.name.length === 0) {
      this.setData({
        ['errmsg[0]']: '名称不得为空',
      });
    }
    if (
      this.data.list.some(
        (item) =>
          item.name.toLowerCase().replace(/\s+/g, '') ==
          this.data.currentData.name.toLowerCase().replace(/\s+/g, '')
      ) &&
      this.data.currentIndex == this.data.list.length
    ) {
      this.setData({
        ['errmsg[0]']: '团体名称已经存在',
      });
      return;
    } else if (
      this.data.list.some(
        (item) =>
          item.name.toLowerCase().replace(/\s+/g, '') ==
          this.data.currentData.name.toLowerCase().replace(/\s+/g, '')
      ) &&
      this.data.currentData.name.toLowerCase().replace(/\s+/g, '') !=
      this.data.list[this.data.currentIndex].name
        .toLowerCase()
        .replace(/\s+/g, '')
    ) {
      this.setData({
        ['errmsg[0]']: '团体名称已经存在',
      });
    }
    let data = {
      name: this.data.currentData.name,
      member: this.data.currentData.member.split(/[，]|[,]|[、]/) || [],
    };
    if (data.member.length >= 2) {
      const array = data.member.map((item) => item.toLowerCase());
      const set = new Set(array);
      if (set.size !== array.length) {
        this.setData({
          ['errmsg[1]']: '请检查是否重复录入',
        });
      }
    } else if (data.member.length < 2) {
      data.member = []
    }
    if(this.data.errmsg.some(currentValue => currentValue.length > 0)){
      return;
    }
    const key = `list[${this.data.currentIndex}]`;
    this.setData({
      [key]: data,
      ['visible.edit']: false,
      currentIndex: null,
      currentData: {
        name: '',
        member: '',
      },
      errmsg: ['', '']
    });
    wx.setStorageSync('list', this.data.list);
    if (this.data.orderGroupId == this.data.currentIndex) {
      this.clearOrder()
    }
  },

  clearOrder() {
    wx.removeStorageSync('orderGroupId');
    this.setData({
      orderGroupId: -1,
      showGroupPicker: false,
      result: {
        group: -1,
        member: -1,
        time: '',
      },
    });
  },

  orderGroup() {
    let orderGroupList = [{ label: '不指定团体', value: 0 }]
    this.data.list.map((item, index) => {
      if (item.member.length >= 2) {
        orderGroupList.push({
          label: item.name,
          value: index + 1
        })
      }
    })
    this.setData({
      ['visible.picker']: true,
      orderGroupList
    })
  },

  onPickerChange(e) {
    this.setData({
      currentIndex: e.detail.value
    })
  },

  onPickerClose() {
    this.setData({
      ['visible.picker']: false,
    })
  },

  clearResult() {
    wx.showModal({
      content: '是否清除',
      confirmColor: '#d54941',
      complete: (res) => {
        if (res.confirm) {
          this.setData({
            result: {
              group: -1,
              member: -1,
              time: '',
            },
          });
          wx.showToast({
            title: '已清除',
            icon: 'success',
          });
        }
      },
    });
  },

  clearData() {
    wx.showModal({
      content: '是否清除全部数据',
      confirmColor: '#d54941',
      complete: (res) => {
        if (res.confirm) {
          this.setData({
            result: {
              group: -1,
              member: -1,
              time: '',
            },
            orderGroupId: -1,
            orderGroupName: null,
            name: '',
            list: [],
          });
          wx.clearStorageSync();
          wx.showToast({
            title: '已清除',
            icon: 'success',
          });
        }
      },
    });
  },

  startMotto() {
    let groupId, memberId;
    this.setData({
      status: 1,
      'result.time': '',
    });
    var that = this;
    if (this.data.orderGroupId >= 0) {
      // 指定团体模式
      groupId = this.data.orderGroupId;
      this.setData({
        'result.group': groupId,
      });
      this.interval = setInterval(function () {
        memberId = Math.floor(
          Math.random() * that.data.list[groupId].member.length + 1
        );
        that.setData({
          'result.member': memberId - 1,
        });
      }, 10); //代表0.01秒一次
    } else {
      this.interval = setInterval(function () {
        groupId = Math.floor(Math.random() * that.data.list.length + 1);
        if (that.data.list[groupId - 1].member.length > 0) {
          memberId = Math.floor(
            Math.random() * that.data.list[groupId - 1].member.length + 1
          );
        } else {
          memberId = -1;
        }
        if (memberId == null) {
          memberId = -1;
        }
        that.setData({
          'result.group': groupId - 1,
          'result.member': memberId - 1,
        });
      }, 10); //代表0.01秒一次
    }
  },

  stopMotto() {
    clearInterval(this.interval);
    const time = Date.parse(new Date()) / 1000;
    const formatTime = this.formatTime(time);
    this.setData({
      status: 0,
      'result.time': formatTime,
    });
  },

  formatTime(timestamp) {
    var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '/';
    var M =
      (date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1)
        : date.getMonth() + 1) + '/';
    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
    var h =
      (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m =
      (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
      ':';
    var s =
      date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  }
})