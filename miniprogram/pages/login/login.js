

Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    
  },

  //获取用户信息接口
  queryUsreInfo: function () {
    wx.request({
      url: getApp().globalData.urlPath + 'hstc_interface/queryByOpenid',
      data: {
        openid: getApp().globalData.openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        getApp().globalData.userInfo = res.data;
      }
    })
  },


  returnMe() {
    wx.navigateBack({
      delta: 1,
    })
  },

  getUserProfile(e) {
    console.log(e)
    var that = this
    // if (e.detail.userInfo) {
    wx.getUserProfile({
      desc: '用于完善资料',
      lang: 'zh_CN',
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log(res.userInfo)
        wx.cloud.database().collection('user').add({
          data: {
            openid: getApp().globalData.openid,
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl,
            province: res.userInfo.province,
            city: res.userInfo.city,
            sex: '',
            qqnumber: '',
            mailnumber: '',
            age: '',
            bosshead: false,
            admin: true,
            office:'无',
            
          },
        }).then(res => {
          //从数据库获取用户信息
          that.queryUsreInfo();
          console.log("插入小程序登录用户信息成功！");
          wx.switchTab({
            url: '/pages/index/index'
          })
        })
      }, fail: res => {
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法使用小程序，请授权之后再进入',
          showCancel: false,
          confirmText: '返回授权',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击了“返回授权”')
            }
          }
        })
      }
    })
  },
})
