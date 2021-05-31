// pages/activity/activity.js
var app = getApp()
const db = wx.cloud.database()
const _ = db.command
let ID = ''

Page({

  data: {
    activityDetail: '',
    Name: '',
    Class: '',
    Phone: '',
    nickName: '',
    inputDialog: false,
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
        console.log("openid：", this.data.openID)
        wx.cloud.database().collection('user').where({
          _openid: this.data.openID
        }).get().then(res => {
          console.log("用户信息数组长度", res.data)
          if (res.data.length != 1) {
            this.setData({
              nickName: ''
            })
          } else {
            this.setData({
              nickName: res.data[0].nickName
            })
          }
        })
      },
      fail: err => {
        console.error('调用失败', err)
      }
    })
    db.collection('activity').orderBy('activityid', 'desc').get().then(res => {
      console.log(res)
      this.setData({
        activityDetail: res.data
      })
    })
  },

  goDetail(event) {
    // console.log("获取的_id", event)
    db.collection('activity').where({
      id: event.currentTarget.dataset.id,
      parter: _.all([_.elemMatch({ parter_id: this.data.openID })])
    }).get().then(res => {
      // console.log("是否报名", res)
      if (res.data.length == 0) {
        wx.showToast({
          title: '报名后才能查看',
          icon: "error"
        })
        return
      } else {
        wx.navigateTo({
          url: '/pages/activity/activityDetail/activityDetail?id=' + event.currentTarget.dataset.id,
        }),
          wx.setNavigationBarTitle({
            title: '活动详情'
          })
      }
    })
  },

  powerDrawer: function (e) {
    if (this.data.nickName == '') {
      wx.showModal({
        cancelColor: 'cancelColor',
        title: '您没有登入，是否登入？',
        content: '没有登入将无法使用！',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login',
            })
            // console.log('用户点击确定')
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
      return
    } else {
      // console.log("活动id", e.target.id)
      ID = e.target.id
      var currentStatu = e.currentTarget.dataset.statu;
      this.setData({
        inputDialog: true
    });
    }
  },
  close: function () {
    this.setData({
        inputDialog: false,
    })
},
  //获取信息
  getName(event) {
    this.setData({
      Name: event.detail.value
    })
    console.log("获取到的姓名", this.data.Name)
  },
  getClass(event) {
    this.setData({
      Class: event.detail.value
    })
    console.log("获取到的班级", this.data.Class)
  },
  getPhone(event) {
    this.setData({
      Phone: event.detail.value
    })
    console.log("获取到的手机", this.data.Phone)
  },
  //确认报名
  inputButton() {
    if (this.data.Name.length < 2 || this.data.Name.length > 8 || this.data.Class.length < 2 || this.data.Phone.length < 5 || this.data.Phone.length > 20) {
      wx.showToast({
        icon: 'none',
        title: '您的信息有误',
      })
      return
    }
    let parterItems = {}
    parterItems.parter_id = this.data.openID
    parterItems.parter_name = this.data.Name
    parterItems.school_class = this.data.Class
    parterItems.link_qq = this.data.Phone
    console.log("用户数组：", parterItems)
    wx.showLoading({
      title: '提交中',
    })

    wx.cloud.callFunction({
      name: 'parerInfo',
      data: {
        id: ID,
        parter: parterItems
      }
    }).then(res => {
      this.setData({
        inputDialog: false,
        Name: '',
        Class: '',
        Phone: ''
      })
      wx.hideLoading(), 1000
      wx.navigateTo({
        url: '/pages/activity/activityDetail/activityDetail?id=' + ID,
      })
      wx.setNavigationBarTitle({
        title: '活动详情',
      }),
        console.log("success", res.result.stats)
    }).catch(res => {
      console.log("false", res)
    })
  }
})
