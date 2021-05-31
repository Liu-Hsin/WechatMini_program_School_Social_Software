// pages/me/myissuance/myissuance.js
var app = getApp()
Page({
  data: {
    slideButtons: [{
      src: '/pages/icon/delete.svg', // icon的路径
    }],
    openID: '',
    issuance: '',
    delete: false,
    delid:''
  },

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
        // console.log("openid", this.data.openID)

        wx.cloud.database().collection('articles').where({
          _openid: this.data.openID
        }).orderBy('articleid', 'desc').get().then(res => {
          this.setData({
            issuance: res.data
          })
          // console.log(res)
        })
      },
      fail: err => {
        console.error('调用失败', err)
      }
    })

  },
  
  goDetail(event){
    console.log(event)
    wx.navigateTo({
      url: '/pages/detail/detail?id='+event.currentTarget.id,
    })
    wx.setNavigationBarTitle({
      title: '内容详情',
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
      wx.cloud.database().collection('articles').doc(
        this.data.delid
      ).remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
          })

          // 刷新页面
          wx.cloud.database().collection('articles').where({
            _openid: this.data.openID
          }).orderBy('articleid', 'desc').get().then(res => {
            this.setData({
              issuance: res.data
            })
            console.log(res)
          })

        },
        fail: err => {
          wx.showToast({
            icon: 'error',
            title: '删除失败',
          })
          console.error('[数据库] [删除记录] 失败：', err)
        }
      })
    }else{
      wx.showToast({
        icon: 'error',
        title: '删除失败',
      })
      return
    }
  }
})