// pages/me/admin/admin.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    curNav: 1,
    // 公告内容
    slideButtons: [{
      src: '/pages/icon/delete.svg', // icon的路径
    }],
    delete: false,
    deleteValue: '',
    indexTextData: '',
    textNumber: '0',
    notice: '',
    wordNumber: 0,

    // 轮播图
    indexImgData: '',
    fileID: '',

    // 社团人员
    bossheads: '',

    // 所有用户
    show: false,
    addCollegaId: '',
    officeInfo: '',

    // 文章列表
    articles: '',

    // 评论列表
    comments: ''
  },

  // 切换菜单
  switchRightTab: function (e) {
    let id = e.target.dataset.id;
    console.log(id);
    this.setData({
      curNav: id,
      show: false,
    })
  },

  // 页面加载
  onLoad() {
    wx.cloud.database().collection('index').doc('b00064a76054bf6b0adc04827ae254ba').get().then(res => {
      console.log("onload 公告轮播图：", res.data)
      this.setData({
        indexImgData: res.data.images,
        indexImgData_0: res.data.images[0],
        indexImgData_1: res.data.images[1],
        indexImgData_2: res.data.images[2],
        indexTextData: res.data.notices,
      })
    })

    wx.cloud.database().collection('user').where({
      bosshead: true
    }).get().then(res => {
      console.log("onload 社团人员：", res.data)
      this.setData({
        bossheads: res.data
      })
    })

    wx.cloud.database().collection('user').get().then(res => {
      console.log("onload 所有用户：", res.data)
      this.setData({
        users: res.data,
      })
    })

    wx.cloud.database().collection('articles').get().then(res => {
      console.log("onload 文章：", res.data)
      this.setData({
        articles: res.data
      })
    })

    wx.cloud.database().collection('comment').get().then(res => {
      console.log("onload 评论", res.data)
      this.setData({
        comments: res.data
      })
    })

  },

  // 公告栏

  hide(e) {
    // console.log(e)
    this.setData({
      delete: false
    })
    console.log("滑动显示删除：", this.data.delete)
  },
  show(e) {
    // console.log(e)
    this.setData({
      delete: true,
      deleteValue: e.currentTarget.id
    })
    console.log("滑动显示删除：", this.data.delete)
  },

  slideButtonTap(e) {
    var that = this
    if (this.data.delete == true) {
      wx.showModal({
        cancelColor: 'cancelColor',
        title: '确定删除此条公告 ？',
        content: '删除后无法撤销！',
        success(res) {
          console.log(res)
          if (res.confirm) {
            const _ = wx.cloud.database().command

            wx.cloud.callFunction({
              name: 'delete_notices',
              data: {
                notices: that.data.deleteValue
              }
            }).then(res => {
              wx.cloud.database().collection('index').doc('b00064a76054bf6b0adc04827ae254ba').get().then(res => {
                console.log(res.data)
                that.setData({
                  indexTextData: res.data.notices,
                  notice: ''
                })
              })
            })
          } else if (res.cancel) {
            console.log('取消')
          }

        }
      })
    }
  },


  getNotices(e) {
    this.setData({
      notice: e.detail.value,
      wordNumber: e.detail.value.length
    })
    console.log("notice文字", this.data.notice)
  },

  setNotices() {
    if (this.data.notice.length > 4) {
      const _ = wx.cloud.database().command
      wx.cloud.callFunction({
        name: 'update_index',
        data: {
          notices: this.data.notice
        }
      }).then(res => {
        wx.cloud.database().collection('index').doc('b00064a76054bf6b0adc04827ae254ba').get().then(res => {
          console.log(res.data)
          this.setData({
            indexTextData: res.data.notices,
            notice: ''
          })
        })
      })
    }else{
      wx.showToast({
        title: '至少 5 个字符',
        icon:'error',
        duration:1500
      })
    }
  },

  // 轮播图
  /**  预览图片 */
  showImg: function (event) {
    console.log("图片数组", this.data.indexImgData)
    console.log("viewID", event.currentTarget.id)
    if (event.currentTarget.id == 0) {
      wx.previewMedia({
        sources: [{ url: this.data.indexImgData_0, type: "image" }],
      })
    } else if (event.currentTarget.id == 1) {
      wx.previewMedia({
        sources: [{ url: this.data.indexImgData_1, type: "image" }],
      })
    } else {
      wx.previewMedia({
        sources: [{ url: this.data.indexImgData_2, type: "image" }],
      })
    }
  },


  /**上传图片 */
  updateImg(e) {
    var buttonid = e.currentTarget.id
    console.log("按钮id", e.currentTarget.id)
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        wx.showLoading({
          title: '上传中',
        })
        const filePath = res.tempFilePaths[0]
        console.log("临时数据：", res)
        // 上传图片
        const cloudPath = '轮播图/' + Date.parse(new Date()) + `${filePath.match(/\.[^.]+?$/)[0]}` // 图片位置
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res.fileID)
            that.setData({ fileID: res.fileID })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
            wx.cloud.callFunction({
              name: 'updata_user',  //云函数名称
              data: {
                type: 'update',      //data所有的变量都是关联云函数的，按照编写的云函数需要的变量来
                db: 'index',           //需要操作的集合
                indexKey: 'b00064a76054bf6b0adc04827ae254ba',
                data: {
                  ['images.' + [buttonid]]: that.data.fileID
                },
              },
              success: res => {
                console.log(res)
                that.setData({
                  fileID: ''
                })
                wx.cloud.database().collection('index').doc('b00064a76054bf6b0adc04827ae254ba').get().then(res => {
                  console.log("onload 公告轮播图：", res.data)
                  that.setData({
                    indexImgData: res.data.images,
                    indexImgData_0: res.data.images[0],
                    indexImgData_1: res.data.images[1],
                    indexImgData_2: res.data.images[2],
                    indexTextData: res.data.notices,
                  })
                })
              }
            })
          }
        })
      },
    })
  },


  // 社团人员
  cancelCollega(e) {
    var that = this
    console.log("字段 _id:", e.currentTarget.id)
    var collegaId = e.currentTarget.id
    wx.showModal({
      cancelColor: 'cancelColor',
      title: "是否删除社团人员身份？",
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'updata_user',  
            data: {
              type: 'update',      
              db: 'user',           
              indexKey: collegaId,
              data: {
                bosshead: false,
                office: '',
              },
            }
          })
          wx.showToast({
            title: '删除成功！',
            icon: 'success',
            duration: 2000,
            success: res => {
              wx.startPullDownRefresh({
                success: (res) => {
                  wx.cloud.database().collection('user').where({
                    bosshead: true
                  }).get().then(res => {
                    console.log('自动刷新，社团：', res)
                    that.setData({
                      bossheads: res.data
                    })
                  })
                },
              })
            }
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },



  // 所有用户 //
  // 添加社团
  addCollega(e) {
    this.setData({
      show: true,
      addCollegaId: e.currentTarget.id
    })
    // console.log(e.currentTarget.id)
  },

  bindKeyInput(e) {
    // console.log("弹窗文字：",e.detail.value)
    this.setData({
      officeInfo: e.detail.value
    })
  },
  btnDonate() {
    if (this.data.officeInfo.length < 1) {
      wx.showToast({
        title: '内容不能为空！',
        icon: 'error'
      })
      return
    }
    wx.cloud.callFunction({
      name: 'updata_user',  //你的云函数名称
      data: {
        type: 'update',      //data所有的变量都是关联云函数的，按照编写的云函数需要的变量来
        db: 'user',           //需要操作的集合
        indexKey: this.data.addCollegaId,
        data: {
          bosshead: true,
          office: this.data.officeInfo,
        },
      }
    })
    wx.showToast({
      title: '添加成功！',
      icon: 'success',
      success: res => {
        wx.startPullDownRefresh({
          success: (res) => {
            wx.cloud.database().collection('user').get().then(res => {
              // console.log(res.data)
              this.setData({
                users: res.data,
                show: false
              })
            })
          },
        })
      }
    })
  },
  //删除用户
  deleteUser(e) {
    var that = this
    // console.log(e.currentTarget.dataset.id)   是否管理员
    var id = e.currentTarget.id  // 字段: _id
    if (e.currentTarget.dataset.id == true) {
      wx.showToast({
        title: '无法删除管理员',
        icon:'none'
      })
      return
    }
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '是否删除该用户 ？',
      content: '仅删除用户注册信息，无法删除该用户文章及评论',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'updata_user',  //你的云函数名称
            data: {
              type: 'delete',      //data所有的变量都是关联云函数的，按照编写的云函数需要的变量来
              db: 'user',           //需要操作的集合
              indexKey: id,
            }
          })
          wx.showToast({
            title: '删除成功',
            success: res => {
              wx.startPullDownRefresh({
                success: (res) => {
                  wx.cloud.database().collection('user').get().then(res => {
                    console.log("删除用户后：", res.data)
                    that.setData({
                      users: res.data
                    })
                  })
                },
              })
            }
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },



  // 文章列表
  deleteArticle(e) {
    var that = this
    console.log(e.currentTarget.id)
    var id = e.currentTarget.id
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '是否删除该文章？',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'updata_user',  //你的云函数名称
            data: {
              type: 'delete',      //data所有的变量都是关联云函数的，按照编写的云函数需要的变量来
              db: 'articles',           //需要操作的集合
              indexKey: id,
            }
          })
          wx.showToast({
            title: '删除成功',
            success: res => {
              wx.startPullDownRefresh({
                success: (res) => {
                  wx.cloud.database().collection('articles').get().then(res => {
                    console.log("文章2：", res.data)
                    that.setData({
                      articles: res.data
                    })
                  })
                },
              })
            }
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  // 评论列表
  deleteComment(e) {
    var that = this
    console.log(e.currentTarget.id)
    var id = e.currentTarget.id
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '是否删除该条评论 ？',
      success(res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'updata_user',  //你的云函数名称
            data: {
              type: 'delete',      //data所有的变量都是关联云函数的，按照编写的云函数需要的变量来
              db: 'comment',           //需要操作的集合
              indexKey: id,
            }
          })
          wx.showToast({
            title: '删除成功',
            success: res => {
              wx.startPullDownRefresh({
                success: (res) => {
                  wx.cloud.database().collection('comment').get().then(res => {
                    console.log("评论：", res.data)
                    that.setData({
                      comments: res.data
                    })
                  })
                },
              })
            }
          })
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },










  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh({
      success: (res) => {
        wx.cloud.database().collection('index').doc('b00064a76054bf6b0adc04827ae254ba').get().then(res => {
          console.log('公告与轮播图：', res.data)
          this.setData({
            indexImgData: res.data.images,
            indexImgData_0: res.data.images[0],
            indexImgData_1: res.data.images[1],
            indexImgData_2: res.data.images[2],
            indexTextData: res.data.notices,
          })
        })

        wx.cloud.database().collection('user').where({
          bosshead: true
        }).get().then(res => {
          console.log('社团人员：', res)
          this.setData({
            bossheads: res.data
          })
        })

        wx.cloud.database().collection('user').get().then(res => {
          console.log("用户列表：", res.data)
          this.setData({
            users: res.data,
          })
        })


        wx.cloud.database().collection('articles').get().then(res => {
          console.log("文章：", res.data)
          this.setData({
            articles: res.data
          })
        })

        wx.cloud.database().collection('comment').get().then(res => {
          console.log("评论：", res.data)
          this.setData({
            comments: res.data
          })
        })


      },
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})













// Page({
//   data: {
//     slideButtons: [{
//       src: '/pages/icon/shoucangFalse.svg', // icon的路径
//     }, {
//       src: '/pages/icon/delete.svg', // icon的路径
//     }],
//   },


//   onLoad: function () {

//   },
//   slideButtonTap(e) {
//     console.log('slide button tap', e.detail)
//     this.setData({
//       slideButtons: [{
//         src: '/pages/icon/shoucangTrue.svg', // icon的路径
//       }, {
//         src: '/pages/icon/delete.svg', // icon的路径
//       }],
//     });
//   }
// });


