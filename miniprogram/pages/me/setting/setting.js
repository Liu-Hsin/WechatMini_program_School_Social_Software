// pages/me/setting/setting.js

var app = getApp()
let  bosshead = false
Page({

  data: {
    nickName:'',
    avatarUrl:'',
    sex:'',
    age:'',
    province:'',
    city:'',
    qqnumber:'',
    mailnumber:'',
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
          console.log("昵称", res.data.length)
          // for 遍历数组
          for (var i = 0; i < res.data.length; ++i) { 
            // console.log(i);
            if (i >= 1) break;
            console.log(res.data[i])
            this.setData({
              nickName:res.data[i].nickName,
              avatarUrl:res.data[i].avatarUrl,
              sex:res.data[i].sex,
              age:res.data[i].age,
              province:res.data[i].province,
              city:res.data[i].city,
              qqnumber:res.data[i].qqnumber,
              mailnumber:res.data[i].mailnumber,
              bosshead:res.data[i].bosshead,
              admin:res.data[i].admin
            })
          }
        })
      },
      
      fail: err => {
        console.error('调用失败', err)
      }
    })


  },
  settingInfo(){
    wx.navigateTo({
      url: './settingInfo/settingInfo',
    })
    wx.setNavigationBarTitle({
      title: '设置信息',
    })
  },


    //下拉刷新 
    onPullDownRefresh: function () {
      wx.stopPullDownRefresh({
        success: (res) => {
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
                console.log("昵称", res.data.length)
                // for 遍历数组
                for (var i = 0; i < res.data.length; ++i) { 
                  // console.log(i);
                  if (i >= 1) break;
                  console.log(res.data[i])
                  this.setData({
                    nickName:res.data[i].nickName,
                    avatarUrl:res.data[i].avatarUrl,
                    sex:res.data[i].sex,
                    age:res.data[i].age,
                    province:res.data[i].province,
                    city:res.data[i].city,
                    qqnumber:res.data[i].qqnumber,
                    mailnumber:res.data[i].mailnumber,
                    bosshead:res.data[i].bosshead,
                    admin:res.data[i].admin
                  })
                }
              })
            },
            
            fail: err => {
              console.error('调用失败', err)
            }
          })
        },
      })
    },
})