var app = getApp()

Page({
  data: {
    avatarUrl: '',
    openID: '',
    nickName: '点击登入',
    bosshead: false,
    admin: false
  },

  login() {
    if (this.data.avatarUrl.length < 1) {
      wx.navigateTo({
        url: '../login/login',
      })
    }
  },
  onShow() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        //获取openid
        console.log('user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        this.setData({
          openID: res.result.openid
        })
        // 通过openid查找
        // console.log(res.result)
        // console.log(this.data.openID)
        wx.cloud.database().collection('user').where({
          _openid: this.data.openID
        }).get().then(res => {
          console.log("信息数组长度", res.data.length)
          // for 遍历数组
          for (var i = 0; i < res.data.length; ++i) {
            // console.log(i);
            if (i >= 1) break;
            // console.log(res.data[i])
            this.setData({
              avatarUrl: res.data[i].avatarUrl,
              nickName: res.data[i].nickName,
              bosshead: res.data[i].bosshead,
              admin: res.data[i].admin
            })
          }
        })
      },

      fail: err => {
        console.error('调用失败', err)
      }
    })
  },
  updateInfo() {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        //获取openid
        app.globalData.openid = res.result.openid
        this.setData({
          openID: res.result.openid
        })
        // 通过openid查找
        // console.log(res.result)
        // console.log(this.data.openID)
        wx.cloud.database().collection('user').where({
          _openid: this.data.openID
        }).get().then(res => {
          // for 遍历数组
          for (var i = 0; i < res.data.length; ++i) {
            // console.log(i);
            if (i >= 1) break;
            this.setData({
              nickName: res.data[i].nickName,
              bosshead: res.data[i].bosshead,
              admin: res.data[i].admin
            })
          }
        })
      }
    })

  },

  goCollege() {
    if (this.data.bosshead == false) {
      wx.showToast({
        title: '您不是社团人员',
        icon: 'error'
      })
      return
    } else {
      wx.navigateTo({
        url: '../college/college',
      })
      wx.setNavigationBarTitle({
        title: '活动管理',
      })
    }
  },

  goadmin() {
    if (this.data.admin == false) {
      wx.showToast({
        title: '您不是管理员',
        icon: 'error'
      })
      return
    } else {
      wx.navigateTo({
        url: '../admin/admin',
      })
      wx.setNavigationBarTitle({
        title: '管理员设置',
      })
    }
  },
  about() {
    wx.navigateTo({
      url: '../about/about',
    })
    wx.setNavigationBarTitle({
      title: '关于我们',
    })
  }
})