// pages/me/setting/setting.js
var app = getApp()
let bosshead = false
Page({

  data: {
    openid: '',
    nickName: '',
    sex: '',
    age: '',
    province: '',
    city: '',
    qqnumber: '',
    mailnumber: '',
  },

  // 设置初始值
  onLoad() {
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
        wx.cloud.database().collection('user').where({
          _openid: this.data.openID
        }).get().then(res => {
          console.log("昵称", res.data.length)
          // for 遍历数组
          for (var i = 0; i < res.data.length; ++i) {
            // console.log(i);
            if (i >= 1) break;
            console.log(res.data[i])
            this.setData({
              openid: res.data[i]._openid,
              nickName: res.data[i].nickName,
              sex: res.data[i].sex,
              age: res.data[i].age,
              province: res.data[i].province,
              city: res.data[i].city,
              qqnumber: res.data[i].qqnumber,
              mailnumber: res.data[i].mailnumber
            })
            console.log(this.data.openid)
          }
        })
      },

      fail: err => {
        console.error('调用失败', err)
      }
    })
  },

  // 获取值
  getname(event) {
    console.log("昵称", event.detail.value)
    this.setData({ nickName: event.detail.value })
  },
  getsex(event) {
    console.log("性别", event.detail.value)
    this.setData({ sex: event.detail.value })
  },
  getage(event) {
    console.log("年龄", event.detail.value)
    this.setData({ age: event.detail.value })
  },
  getprovince(event) {
    console.log("省份", event.detail.value)
    this.setData({ province: event.detail.value })
  },
  getcity(event) {
    console.log("城市", event.detail.value)
    this.setData({ city: event.detail.value })
  },
  getqq(event) {
    console.log("QQ", event.detail.value)
    this.setData({ qqnumber: event.detail.value })
  },
  getmail(event) {
    console.log("邮箱", event.detail.value)
    this.setData({ mailnumber: event.detail.value })
  },


  settingInfo() {
    if (this.data.nickName.length < 1) {
      wx.showToast({
        title: '昵称不能为空',
        icon: 'error'
      })
    } else {
      wx.cloud.database().collection('user').where({
        _openid: this.data.openid
      }).update({
        data: {
          nickName: this.data.nickName,
          sex: this.data.sex,
          age: this.data.age,
          province: this.data.province,
          city: this.data.city,
          qqnumber: this.data.qqnumber,
          mailnumber: this.data.mailnumber
        }
      })
      wx.showToast({
        title: '修改成功！',
        icon: 'success'
      })
      wx.navigateBack({
        delta: 1
      })
    }
  }
})