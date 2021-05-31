var app = getApp()
let name = ''
let organizer = ''
let number = ''
let place = ''
let link = ''
let content = ''

let activityid = Date.parse(new Date());    //文章id 为string类型时间
Page({

  data: {
    links: ["微信", "QQ", "手机号"],
    linksIndex: 0,
    contact: '微信',
    startime: "2021-01-01",
    endtime: "2021-01-01",
    wordNumber: "0",
    nickName:'',
    office:''
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
              office:res.data[i].office
            })
          }
        })
      },
      
      fail: err => {
        console.error('调用失败', err)
      }
    })


  },
  // 获取页面所有的值
  getName(event) {
    console.log("名称", event.detail.value)
    name = event.detail.value
  },
  getColleger(event) {
    console.log("人员", event.detail.value)
    organizer = event.detail.value
  },
  getNumber(event) {
    console.log("人数", event.detail.value)
    number = event.detail.value
  },
  getPlace(event) {
    console.log("地点", event.detail.value)
    place = event.detail.value
  },
  getLink(event) {
    console.log("联系", event.detail.value)
    link = event.detail.value
  },
  getContent(event) {
    console.log("详情", event.detail.value)
    content = event.detail.value
    this.setData({
      wordNumber: event.detail.value.length
    })
  },
  getStartime(event) {
    console.log("开始时间", event.detail.value)
    this.setData({ startime: event.detail.value })
  },
  getEndtime(event) {
    console.log("结束时间", event.detail.value)
    this.setData({ endtime: event.detail.value })
  },


  changeLinks: function (e) {
    console.log('值为', e.detail.value);
    this.setData({
      linksIndex: e.detail.value
    })
    if (e.detail.value == 0) {
      this.setData({
        contact: "微信"
      })
    } else if (e.detail.value == 1) {
      this.setData({
        contact: "QQ"
      })
    } else {
      this.setData({
        contact: "手机"
      })
    }
  },



  issuance() {
    if (name.length < 2 || organizer.length < 2 || number.length < 1 || place.length < 2 || link.length < 4 || content.length < 3) {
      wx.showToast({
        title: '内容过短或未填完',
        icon: 'none'
      })
    } else {
      wx.showLoading({
        title: '发布中'
      })
      wx.cloud.database().collection('activity').add({
        data: {
          activityid: activityid,
          title: name,
          organizer: organizer,
          number: number,
          place: place,
          link: link,
          contents: content,
          star_time: this.data.startime,
          end_time: this.data.endtime,
          contact: this.data.contact,
          nickName: this.data.nickName,
          office:this.data.office
        }
      })
      wx.hideLoading(), 2000
    }
    wx.navigateBack({
      delta: 1
    })


  }









})