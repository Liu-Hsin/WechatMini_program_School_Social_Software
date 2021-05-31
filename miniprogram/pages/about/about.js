// pages/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  pact() {
    wx.navigateTo({
      url: './pact',
      success: (result) => {
        console.log(result)
      },
      fail: (res) => {},
      complete: (res) => {},
    })
  },
  service(){
    wx.navigateTo({
      url: 'service',
      success: (result) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
  }
})