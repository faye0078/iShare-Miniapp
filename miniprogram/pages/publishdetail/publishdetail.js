//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
    userInfo: {},
    messageDetail: {},
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    isLoading: false, //页面是否渲染完毕

    targetMessage: {},
    isOwner: false,
    openid: '',
    input_comment: '',
    manageDetail: ''
  },
  onShow(){
    for(var i=0;i<app.globalData.postMessage.length;i++){
      if(app.globalData.postMessage[i]._id == this.data.targetMessage._id){
        this.setData({
        targetMessage: app.globalData.postMessage[i],
        })
      }
    }
  },
  delete_comment(e) {
    let that = this;
    if (that.data.userId == -1) {
      wx.showModal({
        title: '提示',
        content: '好像没有登录噢~',
        confirmText: "去登陆",
        success: function(e) {
          if (e.confirm) {
            wx.switchTab({
              url: '/pages/me/me',
            })
            return;
          }
        }
      })
    }

    wx.showModal({
      title: '提示',
      content: '是否删除当前内容~',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.url + '/deleteCommentByCommentId/' + that.data.userId + '/' + e.target.id,
            method: "post",
            success: function(result) {

              if (result.statusCode != 200) {
                wx.showModal({
                  title: '提示',
                  content: '服务器出现问题，请稍后再试',
                })
                return;
              }

              if (result.data == 200) {
                wx.showModal({
                  title: '提示',
                  content: '删除成功~',
                  success: function() {
                    wx.request({
                      url: getApp().globalData.url + '/getMessageDetailById/' + that.data.messageDetail.messageId,
                      method: "post",
                      success: function(e) {
                        that.setData({
                          messageDetail: e.data,
                        })
                      }
                    })
                  }
                })
              }

            }
          })
        }
      }
    })

  },

  delete_comment_reply(e) {
    let that = this;
    if (that.data.userId == -1) {
      wx.showModal({
        title: '提示',
        content: '好像没有登录噢~',
        confirmText: "去登陆",
        success: function(e) {
          if (e.confirm) {
            wx.switchTab({
              url: '/pages/me/me',
            })
            return;
          }
        }
      })
    }
    wx.showModal({
      title: '提示',
      content: '是否删除当前内容~',
      success: function(res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.url + '/deleteCommentReplyByCommentId/' + that.data.userId + '/' + e.target.id,
            method: "post",
            success: function(result) {

              if (result.statusCode != 200) {
                wx.showModal({
                  title: '提示',
                  content: '服务器出现问题，请稍后再试',
                })
                return;
              }

              if (result.data == 200) {
                wx.showModal({
                  title: '提示',
                  content: '删除成功~',
                  success: function() {
                    wx.request({
                      url: getApp().globalData.url + '/getMessageDetailById/' + that.data.messageDetail.messageId,
                      method: "post",
                      success: function(e) {
                        that.setData({
                          messageDetail: e.data,
                        })
                      }
                    })
                  }
                })
              }

            }
          })
        }
      }
    })
  },

  input_comment(e){
    let value = e.detail.value;
  this.setData({
    input_comment: value
  });
  },

  sendComment() {
    let that = this;
    if (!getApp().globalData.islogin){
      wx.getUserProfile({
        desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        success: (res) => {
        app.globalData.userinfo = res.userInfo;
        app.globalData.islogin = true;
  
        const db = wx.cloud.database();
        const _ = db.command;
    
        var test = app.globalData.openid;
        db.collection('users').where({
          _openid: app.globalData.openid
        })
        .get({
          success: res=> {
            var choice = res.data;
            var test = 1;
            if(choice == null || choice == undefined || choice == ''){
            db.collection('users').add({
              data: {
                // openid: this.openid
                name: this.data.userInfo.nickName,
                avatarUrl: this.data.userInfo.avatarUrl,
                gender: this.data.userInfo.gender,
                province: this.data.userInfo.province,
                city: this.data.userInfo.city,
                country: this.data.userInfo.country
              },
              success: res => {
                // 在返回结果中会包含新创建的记录的 _id
                console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
              },
              fail: err => {
                console.error('[数据库] [新增记录] 失败：', err)
              }
            })
          }
          if (that.data.input_comment.length < 3) {
            wx.showModal({
              title: '提示',
              content: '至少输入三个字噢~',
              showCancel: false
            })
            return;
          }
          wx.showLoading({
            title: '发送中',
          })
          const db = wx.cloud.database();
          const _=db.command;
          var commentData = {
            commentAvatar:this.data.targetMessage.avatarUrl,
            commentNickname: this.data.targetMessage.nickName,
            openid:this.data.targetMessage._openid,
            commentDetail:this.data.input_comment
        }  
        console.log(commentData)
          db.collection('post').doc(this.data.targetMessage._id).update({
            data: {
              comment: _.push(commentData),
              createTime: db.serverDate(),
            },
            success: e=>{
              wx.hideLoading();
              that.setData({
                input_comment: ''
              });
              wx.showModal({
                title: '提示',
                content: '留言成功',
                showCancel: false,
                success: function() {
                  console.log("1");
                  wx.cloud.callFunction({
                    // 需调用的云函数名
                    name: 'readSQL',
                    data: {
                      type: "getAllPost",
                      db: "post"
                    },
                    // 成功回调
                    success: res => {
                      app.globalData.postMessage = res.result.data;
                      app.globalData.isupdate = 1;
                      app.globalData.isupdate_1 = 1;
                      for(var i=0;i<app.globalData.postMessage.length;i++){
                        if(app.globalData.postMessage[i]._id == that.data.targetMessage._id){
                          that.setData({
                          targetMessage: app.globalData.postMessage[i],
                          })
                        }
                      }
                   },
                  });
                
                    }
                  })
                },
            fail: e=>{
              wx.hideLoading();
              wx.showModal({
                title: '提示',
                content: '留言失败',
                showCancel: false,
                success: function() {
      
                    }
                  })
            }
              })
          
          }
         }) 
      }
      })
    }
    else{
    if (that.data.input_comment.length < 3) {
      wx.showModal({
        title: '提示',
        content: '至少输入三个字噢~',
        showCancel: false
      })
      return;
    }
    wx.showLoading({
      title: '发送中',
    })
    const db = wx.cloud.database();
    const _=db.command;
    var commentData = {
      commentAvatar:this.data.targetMessage.avatarUrl,
      commentNickname: this.data.targetMessage.nickName,
      openid:this.data.targetMessage._openid,
      commentDetail:this.data.input_comment
  }  
  console.log(commentData)
    db.collection('post').doc(this.data.targetMessage._id).update({
      data: {
        comment: _.push(commentData),
        createTime: db.serverDate(),
      },
      success: e=>{
        wx.hideLoading();
        that.setData({
          input_comment: ''
        });
        wx.showModal({
          title: '提示',
          content: '留言成功',
          showCancel: false,
          success: function() {
            console.log("1");
            wx.cloud.callFunction({
              // 需调用的云函数名
              name: 'readSQL',
              data: {
                type: "getAllPost",
                db: "post"
              },
              // 成功回调
              success: res => {
                app.globalData.postMessage = res.result.data;
                app.globalData.isupdate = 1;
                app.globalData.isupdate_1 = 1;
                for(var i=0;i<app.globalData.postMessage.length;i++){
                  if(app.globalData.postMessage[i]._id == that.data.targetMessage._id){
                    that.setData({
                    targetMessage: app.globalData.postMessage[i],
                    })
                  }
                }
             },
            });
          
              }
            })
          },
      fail: e=>{
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '留言失败',
          showCancel: false,
          success: function() {

              }
            })
      }
        })
      }
  },

  updataAll: function(){
    
  },
  /**
   * 删除信息
   */
  delete_message() {
    let that = this

    if (that.data.userId == -1) {
      wx.showModal({
        title: '提示',
        content: '出现错误，请稍后再试~',
      })
      return;
    }

    wx.showModal({
      title: '提示',
      content: '是否删除?',
      confirmColor: "#f00",
      success: function(e) {
        if (e.confirm) {
          wx.showLoading({
            title: '稍等噢~',
          })
          that.setData({
            showDialog1: false
          });
          wx.request({
            url: getApp().globalData.url + '/deleteMessageById/' + that.data.userId + '/' + that.data.messageDetail.messageId,
            method: "post",
            success: function(e) {
              wx.hideLoading()
              if (e.statusCode != 200) {
                wx.showModal({
                  title: '提示',
                  content: '服务器出现错误，请稍后再试',
                  showCancel: false
                })
                return;
              }
              if (e.data.code == 200) {
                wx.showModal({
                  title: '提示',
                  content: '删除成功',
                  showCancel: false,
                  success: function() {
                    wx.showLoading({
                      title: '更新主页信息中~',
                    })
                    that.updateAllMessage();
                    wx.hideLoading();
                  },

                })

              } else {
                wx.showModal({
                  title: '提示',
                  content: '非法操作，请联系管理员',
                  showCancel: false,
                  success: function() {
                    that.setData({
                      user_message: []
                    })
                    that.loadMessage(1)
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  updateAllMessage() {
    let that = this;
    /**
     * 获取最新失物招领
     */
    wx.request({
      url: getApp().globalData.url + '/getMessage/getLostMessage',
      method: "post",
      success: function(e) {
        getApp().globalData.lost_new = e.data
      }
    })
    wx.request({
      url: getApp().globalData.url + '/getMessage/getAllMessageDetail/' + 1,
      method: "POST",
      success: (res) => {
        getApp().globalData.messageDetail = res.data
      },
      complete: function() {
        wx.switchTab({
          url: '/pages/index/index',
        })
      }
    })
    getApp().globalData.isUpdate = 1;
  },
  
  onReady() {
    let that = this;
    /**页面渲染完毕 */
    setTimeout(function() {
      that.setData({
        isLoading: true
      })
    }, 500)
  },
  /**
   * 查看图片
   */
  look_image(e) {

    wx.previewImage({
      urls: [e.currentTarget.id],
    })
  },

  onLoad(options) {
    let that = this;
    this.setData({
      height: app.globalData.height,
      userInfo: app.globalData.userinfo,
      openid: app.globalData.openid
    })
      for(var i=0;i<app.globalData.postMessage.length;i++){
      if(app.globalData.postMessage[i]._id == options.messageId){
        this.setData({
        targetMessage: app.globalData.postMessage[i],
        })
      }
    }
    if(app.globalData.openid==this.data.targetMessage._openid){
      this.setData({
        isOwner: true
      })
    }
    this.setData({
      messageId: options.messageId
    })

  },
  managePost(){
    wx.navigateTo({
      url: '/pages/managepublish/managepublish?messageId=' + this.data.targetMessage._id,
    })
  }
})