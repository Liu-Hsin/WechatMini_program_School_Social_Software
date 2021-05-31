// pages/activity/activityDetail/activityDetail.js
const db = wx.cloud.database()
const _ = db.command

Page({
  data: {
    activityDetail:'',
    parter:[]
  },
  onLoad(option) {
    db.collection('activity').doc(option.id).get().then(res=>{
      console.log("参与者：",res.data.parter)
      console.log(res.data)
      this.setData({
        activityDetail:res.data,
        parter:res.data.parter
      })
    })
  },
})