
var app = getApp()
let ID = ''
let commentator = ''
Page({
  data: {
    articletitle: '',
    articletype: '',
    author: '',
    comments: '',    //评论列表加载
    articleid: '',
    detail: '',
    collect: false,   //收藏
    commentText: '', //评论value值
    comment: '',     //评论内容
    images: '',
    openID: '',
    nickName: '',
    avatarUrl: '',
    wordNumber: 0,
    revert: [],
    revcontent: ''
  },

  onLoad(options) {
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
              nickName: res.data[0].nickName,
              avatarUrl: res.data[0].avatarUrl,
            })
          }
        }).then(res => {
          // // 加载收藏
          wx.cloud.database().collection('collect').where({
            _openid: this.data.openID,
            articleid: this.data.articleid
          }).get().then(res => {
            console.log(this.data.nickName)
            console.log('数据', res.data)
            if (res.data.length < 1 || this.data.nickName == '') {
              this.setData({
                collect: false
              })
              console.log('值', this.data.collect)
              return
            } else {
              this.setData({
                collect: true
              })
            }
            console.log('值', this.data.collect)
          })
        })
      },
      fail: err => {
        console.error('调用失败', err)
      }
    })

    // 加载内容
    ID = options.id
    wx.cloud.database().collection('articles').doc(ID).get().then(res => {
      //设置data初始值
      console.log("详情页成功", res)
      this.setData({
        detail: res.data,
        author: res.data.nickName,
        articleid: res.data.articleid,
        articletitle: res.data.title,
        articletype: res.data.type,
        images: res.data.images
      })

      // 加载评论
      wx.cloud.database().collection('comment').orderBy('commentid', 'desc').where({
        articleid: this.data.articleid
      }).get().then(res => {
        console.log("加载成功", res)
        this.setData({
          comments: res.data,
        })
      }).catch(res => {
        console.log(res)
      })
    }).catch(res => {
      console.log("详情页失败", res)
    })
  },


  //获取评论内容
  getPinglun(event) {
    this.setData({ comment: event.detail.value, wordNumber: event.detail.value.length })
    console.log("获取到的内容", this.data.comment)
  },

  // 查看图片
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.images       // 需要预览的图片http链接列表
    })
  },

  //发表按钮

  fabiao() {
    if (this.data.nickName == '') {
      wx.showModal({
        cancelColor: 'cancelColor',
        title: '您没有登入，是否登入？',
        content: '没有登入将无法使用！',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login',
            })
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return
    }
    if (this.data.comment.length < 2) {
      wx.showToast({
        icon: 'error',
        title: '内容过短',
      })
      return
    } else {
      var commentid = Date.parse(new Date())
      console.log(this.data.articleid)
      wx.cloud.database().collection('comment').add({
        data: {
          avatarUrl: this.data.avatarUrl,
          articleid: this.data.articleid,
          commenter: this.data.nickName,
          content: this.data.comment,
          commentid: commentid,
          articletitle: this.data.articletitle,
          articletype: this.data.articletype,
          article_id: ID
        }
      }).then(res => {
        console.log("success", res)
        this.setData({
          commentText: '',          //清空输入框
          comment: ''
        })
        wx.cloud.database().collection('comment').orderBy('commentid', 'desc').where({
          articleid: this.data.articleid
        }).get().then(res => {
          this.setData({
            comments: res.data,
          })
        })
      })
    }
    wx.showToast({
      title: '发表成功',
      icon: 'success'
    })

  },



  // // 收藏功能
  start(e) {
    this.startTime = e.timeStamp;
  },
  end(e) {
    this.endTime = e.timeStamp;
  },
  setCollect() {
    var that = this
    if (this.endTime - this.startTime > 350) {
      console.log("长按")
      return
    }
    if (this.data.nickName == '') {
      wx.showModal({
        cancelColor: 'cancelColor',
        title: '您没有登入，是否登入？',
        content: '没有登入将无法使用！',
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
    wx.cloud.database().collection('collect').where({
      _openid: this.data.openID,
      articleid: this.data.articleid
    }).get().then(res => {
      console.log('数据', res.data)
      if (res.data.length < 1) {
        wx.cloud.database().collection('collect').add({
          data: {
            articleid: this.data.articleid,
            collect: true,
            title: this.data.articletitle,
            author: this.data.author,
            collectid: ID
          }
        }).then(res => {
          wx.showToast({
            title: '收藏成功,长按取消收藏！',
            icon: 'none',
            success: res => {
              that.setData({
                collect: true
              })
            }
          })
        })
        return
      } else {
        wx.showToast({
          title: '你已经收藏过了！',
          icon: 'error'
        })
      }
    })
  },


  delCollect() {
    wx.cloud.database().collection('collect').where({
      _openid: this.data.openID,
      articleid: this.data.articleid
    }).get().then(res => {
      console.log('数据', res.data)
      if (res.data.length < 1) {
        wx.showToast({
          title: '你还没有收藏！',
          icon: 'error'
        })
        return
      } else {
        wx.cloud.database().collection('collect').where({
          _openid: this.data.openID,
          articleid: this.data.articleid
        }).remove().then(res => {
          wx.showToast({
            title: '取消成功',
            success: res => {
              this.setData({
                collect: false
              })
            }
          })
        })
      }
    })
  },


  /**跳转个人主页 */
  // 作者跳转
  goInfo(e) {
    console.log("用户_openid：", e)
    console.log("匿名id", e.currentTarget.dataset.id)
    if (e.currentTarget.dataset.id == 1) {
      wx.showToast({
        title: '匿名时无法查看',
        icon: 'error'
      })
      return
    } else {
      wx.navigateTo({
        url: '/pages/info/info?id=' + e.currentTarget.id,
      })
      wx.setNavigationBarTitle({
        title: this.data.author + '的信息',
      })
    }
  },
  // 跳转用户信息
  goCommenterInfo(e) {
    console.log("评论者 _openid：", e)
    wx.navigateTo({
      url: '/pages/info/info?id=' + e.currentTarget.id,
    })
    wx.setNavigationBarTitle({
      title: '个人信息',
    })
  },

  /**回复 评论*/
  //弹出窗
  close: function () {
    this.setData({
      dialog: false,
    });
  },

  review(e) {
    console.log(e.currentTarget.id)
    var revcommentid = e.currentTarget.id
    this.setData({ revcommentid: revcommentid })
    wx.cloud.database().collection('comment').doc(revcommentid).get().then(res => {
      console.log(res)
      this.setData({
        revcommenter: res.data.commenter
      })
    })
    this.setData({
      dialog: true,
      revcommenter: '',
    });
  },


  reviews(e) {
    //console.log(e)
    const db = wx.cloud.database()
    const _ = db.command
    console.log(e.currentTarget.id)
    this.setData({
      dialog: true,
      revcommenter: e.currentTarget.id,
      revcommentid: e.currentTarget.dataset.rev_id
    });
  },



  revcontent(e) {
    console.log(e.detail.value)
    this.setData({
      revcontent: e.detail.value
    })
  },

  btnDonate() {
    if (this.data.nickName == '') {
      wx.showModal({
        cancelColor: 'cancelColor',
        title: '您没有登入，是否登入？',
        content: '没有登入将无法使用！',
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
    if (this.data.revcontent.length < 2) {
      wx.showToast({
        title: '内容太短',
        icon: 'error',
      })
      return
    }
    console.log(this.data.revcommentid)
    let revertItem = {}
    revertItem.rev_id = this.data.revcommentid,
      revertItem.rev_obj = this.data.revcommenter
    revertItem.rev_name = this.data.nickName
    revertItem.rev_content = this.data.revcontent
    this.data.revert.push(revertItem)
    console.log(this.data.revert)

    wx.cloud.callFunction({
      name: 'update_revert',
      data: {
        id: this.data.revcommentid,
        revert: revertItem
      }
    }).then(res => {
      wx.cloud.database().collection('comment').orderBy('commentid', 'desc').where({
        articleid: this.data.articleid
      }).get().then(res => {
        this.setData({
          comments: res.data,
        })
      })
    })
    wx.showToast({
      title: '回复成功',
      success: res => {
        this.setData({
          dialog: false,
        })
      }
    })
  },








})
