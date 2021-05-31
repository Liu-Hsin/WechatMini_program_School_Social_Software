var app = getApp()

let listArr = ''
let fileidsArr = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme: {
      color: '#1890FF',
      tabColor: '#333' || '#20ACAB',
    },
    topic: {
      sorts:
        ["逸闻趣事", "疑问互答", "校园一角", "表白交友"],
      selected: 0
    },
    valueInput: '',
    articleid: '',
    title: '',
    content: '',
    images: '',
    topicid: 0,
    anonymous: false,
    imageList: [],
    fileidArr: [],
    avatarUrl: '',
    nickName: '',
    type: '',
    anonymity:'0',
  },

  // 是否匿名
  postStatus: function (e) {
    this.setData({
      anonymous: !this.data.anonymous
    }, () => {
      console.log("是否匿名", this.data.anonymous)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
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
        console.log("openid：", this.data.openID)
        wx.cloud.database().collection('user').where({
          _openid: this.data.openID
        }).get().then(res => {
          // console.log(res.data[0])
          console.log("用户信息数组长度", res.data.length)
          // for 遍历数组
          for (var i = 0; i < res.data.length; ++i) {
            console.log("用户信息数组下标",i);
            if (i >= 1) break;
            // console.log("信息数组",res.data[i])
            this.setData({
              avatarUrl: res.data[i].avatarUrl,
              nickName: res.data[i].nickName,
            })
          }
        })
      },
      fail: err => {
        console.error('调用失败', err)
      }
    })
  },
  
  getTitle(event) {
    this.data.title = event.detail.value
    console.log("获取到的标题：", this.data.title.length)
  },
  getContent(event) {
    this.data.content = event.detail.value
    console.log("获取到的内容：", this.data.content.length)
  },
  // 清空照片或者图片
  clearInput: function (name) {
    if (name != 'imageList') {
      this.setData({ imageList: [] })
    }
  },

  // 选择照片
  chooseImage: function (e) {
    var that = this;
    let surplus = 9 - this.data.imageList.length
    wx.chooseImage({
      count: surplus,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        that.clearInput("imageList");
        that.addNewImage(res.tempFilePaths);
        wx.showToast({
          title: '上传成功！',
          duration: 500
        })
      }
    })
  },

  addNewImage(imagePath) {
    listArr = this.data.imageList
    listArr = listArr.concat(imagePath)
    this.setData({
      imageList: listArr
    })
    console.log("临时路径", listArr) //图片临时路径
  },

  thisImage: function (e) {
    let index = e.currentTarget.dataset.imageid;
    let list = this.data.imageList;
    console.log("点击大图", index)
    wx.previewImage({
      urls: list,
      current: list[index]
    })
  },

  deleteImage: function (e) {
    let index = e.currentTarget.dataset.imageid;
    let list = this.data.imageList;
    list.splice(index, 1)
    this.setData({
      imageList: list
    })
  },



  // 发布的类型
  clickTag: function (e) {
    console.log("topicid=", e.currentTarget.dataset.topicid)
    let topicId = e.target.dataset.topicid;
    let topic = this.data.topic;
    topic.selected = topicId;
    this.setData({
      topic,
      topicid: e.currentTarget.dataset.topicid
    })
  },

  issuance() {
    if (this.data.nickName == '') {
      console.log(this.data.nickName)
      wx.showModal({
        cancelColor: 'cancelColor',
        title: '您没有登入，是否登入？',
        content:'没有登入将无法使用！',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../login/login',
            })
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    if (this.data.title.length < 3) {     //判断文字是否过短
      wx.showToast({
        title: '内容过短',
        icon: 'error',
        duration: 1500
      })
      return
    }else if(this.data.topicid == 2 && listArr == []){
      wx.showToast({
        title: '至少有一张图',
        icon:'error'
      })
      return
    }else {
      this.setData({
        articleid: Date.parse(new Date())
      })
      //文章id 为string类型时间
      let PromiseArr = [];
      for (let i = 0; i < listArr.length; i++) {
        PromiseArr.push(new Promise((reslove, reject) => {
          wx.cloud.uploadFile({
            cloudPath: `${'2021-' + new Date().getUTCMonth()}/${new Date().getUTCDate() + 1}/${Date.parse(new Date())}${i}.png`,
            filePath: listArr[i],
            success: res => {
              this.setData({
                fileidArr: this.data.fileidArr.concat(res.fileID),   //
              })
              console.log("已存入的fileID", this.data.fileidArr)
              reslove();
            },
            fail: console.error
          })
        }))
      }
      if (this.data.anonymous == true) {
        this.setData({
          nickName: '匿名',
          avatarUrl: 'cloud://campus-service-7gifi4wm69286cfd.6361-campus-service-7gifi4wm69286cfd-1304436265/login.png',
          anonymity:'1'
        })
      } else {
        console.log(this.data.nickName)
      }
      if (this.data.topicid == 0) {
        this.setData({
          type: '逸闻趣事'
        })
      } else if (this.data.topicid == 1) {
        this.setData({
          type: '疑问互答'
        })
      } else if (this.data.topicid == 2) {
        this.setData({
          type: '校园一角'
        })
      } else {
        this.setData({
          type: '表白交友'
        })
      }



      Promise.all(PromiseArr).then(res => {    //数据都存入数组后打印
        this.data.fileidsArr = this.data.fileidArr
        console.log("文件id", fileidsArr)
        const db = wx.cloud.database()
        const _ = db.command
        db.collection('articles').add({
          data: {
            articleid: this.data.articleid,
            title: this.data.title,
            content: this.data.content,
            images: this.data.fileidsArr,
            anonymous: this.data.anonymous,
            topicid: this.data.topicid,
            avatarUrl: this.data.avatarUrl,
            nickName: this.data.nickName,
            type: this.data.type,
            anonymity:this.data.anonymity
          }
        }).then(res => {
          // wx.clearStorage()
          this.setData({
            valueInput: '',
            articleid: '',
            title: '',
            content: '',
            fileidArr: [],
            anonymous: false,
            topicid: 0,
            type: '',
            imageList: [],
            anonymity:'0'
          })
        })
      })
      wx.showToast({
        title: '发布成功',
        icon: 'success',
        duration: 1500
      })

    }
    wx.navigateTo({
      url: '../articleList/articleList?type='+this.data.topicid,
    })
  }



})
