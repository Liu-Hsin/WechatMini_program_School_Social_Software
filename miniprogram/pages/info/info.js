// pages/info/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.cloud.database().collection('user').where({_openid : options.id}).get().then(res=>{
      
      this.setData({
        info:res.data[0]
      })
      console.log(this.data.info)
    })
  },
})