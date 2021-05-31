
const db = wx.cloud.database()
const _ = db.command
let ID = ''
let Name = ''
let Class = ''
let Phone = ''

Page({

  data: {
    openID:'',
    slideButtons: [{
      src: '/pages/icon/delete.svg', // icon的路径
    }],
    delete: false,
    delid:'',
    activityDetail: '',
    showModalStatus: false,
    masterhead: []
  },

  onLoad() {
    db.collection('activity').orderBy('activityid','desc').get().then(res => {
      console.log(res)
      this.setData({
        activityDetail: res.data
      })
    })

    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        //获取openid
        console.log('user openid: ', res.result.openid)
        this.setData({
          openID: res.result.openid
        })
      }
    })
  },

  hide(e) {
    // console.log(e)
    this.setData({
      delete: false
    })
    console.log("删除：",this.data.delete)
  },
  show(e) {
    // console.log(e)
    this.setData({
      delete: true
    })
    console.log("删除：", this.data.delete)
  },



  slideButtonTap(e) {
    // console.log(this.data.delete)
    console.log('slide button tap', e.target.id)  // 文章的 _id 
    this.setData({
      delid:e.currentTarget.id
    })
    if (this.data.delete == true) {
     console.log("id?=", this.data.delid)

    //  删除字段
      wx.cloud.database().collection('activity').doc(
        this.data.delid
      ).remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
          })
          // 刷新页面
          db.collection('activity').orderBy('activityid','desc').get().then(res => {
            console.log(res)
            this.setData({
              activityDetail: res.data
            })
          })
        },
        fail: err => {
          wx.showToast({
            icon:'none',
            title: '无法删除他人创建的活动',
          })
        }
      })
    }else{
      wx.showToast({
        icon: 'error',
        title: '删除失败',
      })
      return
    }
  },



  goDetail(option) {
     console.log("获取的_id", option.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/activity/activityDetail/activityDetail?id=' + option.currentTarget.dataset.id,
    }),
      wx.setNavigationBarTitle({
        title: '活动详情'
      })
  },



  addCollege(){
    wx.navigateTo({
      url: './addcollege/addcollege',
    })
    wx.setNavigationBarTitle({
      title: '添加活动',
    })
  },



  onPullDownRefresh: function () {
    db.collection('activity').orderBy('activityid','desc').get().then(res => {
      console.log(res)
      this.setData({
        activityDetail: res.data
      })
    })
  },

})
