Page({
  data: {
    detail: [],
    type: '',
  },

  onLoad(event) {
    console.log(event.type)
    this.setData({
      type: event.type,
    })
    wx.cloud.database().collection('articles').where({ topicid: Number(this.data.type) }).orderBy('articleid', 'desc').get().then(res => {
      console.log(res)
      this.setData({
        detail: res.data
      })
    }).catch(res => {
      console.log(res)
    })
  },



  /**跳转 */
  goDetail(event) {
    console.log("获取的id", event.currentTarget.dataset.id)
    wx.navigateTo({
      url: '/pages/detail/detail?id=' + event.currentTarget.dataset.id,
    })
    wx.setNavigationBarTitle({
      title: '内容详情',
    })
  },

  // 下拉刷新
  onPullDownRefresh: function () {
    wx.cloud.database().collection('articles').where({ topicid: Number(this.data.type) }).orderBy('articleid', 'desc').get().then(res => {
      console.log(res)
      this.setData({
        detail: res.data,
      })
    }).catch(res => {
      console.log(res)
    })
    wx.stopPullDownRefresh()
  },
})