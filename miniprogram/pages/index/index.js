// pages/index/index.js
Page({
  data: {
    url: '',
    notices: '',
  },

  onLoad() {
    wx.cloud.database().collection('index').doc('b00064a76054bf6b0adc04827ae254ba').get().then(
      res => {
        // console.log(res.data.images)
        this.setData({
          url: res.data.images,
          notices: res.data.notices,
        })
      }
    )
  },
  onShow() {
    wx.cloud.database().collection('index').doc('b00064a76054bf6b0adc04827ae254ba').get().then(
      res => {
        //  console.log(res.data)
        this.setData({
          url: res.data.images,
          notices: res.data.notices,
        })
      }
    )
  },
  qushi() {                      //逸闻趣事
    wx.navigateTo({
      url: '../articleList/articleList?type=0',
    })
    wx.setNavigationBarTitle({
      title: '逸闻趣事'
    })
  },
  questions() {                   //疑问互答
    wx.navigateTo({
      url: '../articleList/articleList?type=1',
    })
    wx.setNavigationBarTitle({
      title: '疑问互答'
    })
  },
  sight() {                  //校园一角
    wx.navigateTo({
      url: '../articleList/articleList?type=2',
    })
    wx.setNavigationBarTitle({
      title: '校园一角'
    })
  },
  love() {                     //表白交友
    wx.navigateTo({
      url: '../articleList/articleList?type=3',
    })
    wx.setNavigationBarTitle({
      title: '表白交友'
    })
  },
  activityPage() {                //社团活动
    wx.navigateTo({
      url: '../activity/activity',
    })
    wx.setNavigationBarTitle({
      title: '社团活动'
    })
  },
  chengji() {                    //四六级
    wx.navigateTo({
      url: './cet/cet',
    })
    wx.setNavigationBarTitle({
      title: '四六级查询'
    })
  },
})