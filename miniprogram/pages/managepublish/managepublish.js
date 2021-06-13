// miniprogram/pages/managePublish/managePublish.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    openid: '',
    targetMessage: '',
    hideAdd: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  },
  chooseimage: function() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        console.log(res.tempFiles.tempFilePath)
        console.log(res.tempFiles.size)
        that.setData({
          hideAdd: true
        })
      }
    })
    var that = this;
    wx.chooseImage({
      count: 9 - that.data.img_url.length, // 默认9 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function(res) {

        if (res.tempFilePaths.length > 0) {
          //图如果满了9张，不显示加图
          if (that.data.img_url.length == 9) {
            that.setData({
              hideAdd: true
            })
          } else {
            that.setData({
              hideAdd: false
            })
          }
          //把每次选择的图push进数组
          let img_url = that.data.img_url;
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            if (i <= 8) {
              img_url.push(res.tempFilePaths[i])
            }

          }
          that.setData({
            img_url: img_url
          })
          /**
           * 如果选择多于九张,停止添加
           */

          if (that.data.img_url.length == 9) {
            that.setData({
              hideAdd: true
            })
          } else {
            that.setData({
              hideAdd: false
            })
          }
        }
      }
    })
  }, //图片上传
  img_upload: function(callBack) {

      let bigImg = this.data.bigImg;
      let img_url = this.data.img_url;
      let number = 0;
      for(var i=0; i< img_url.length; i++){
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
       let filePath = img_url[i];
       let cloudPath = new Date().getTime()+filePath.match(/\.[^.]+?$/)[0];
       console.log(cloudPath);
       wx.cloud.uploadFile({
         cloudPath,//云存储图片名字
         filePath,//临时路径
         success: res => {
           console.log('[上传图片] 成功：', res);
            bigImg.push(res.fileID);
            this.setData({
              bigImg: bigImg
            });
            number++;
            console.log(number);
            if(number==img_url.length){
              callBack();
            }
         },
          fail: res => {
           console.error('[上传图片] 失败：', e)
         },
       });
        }
 
        
        
      },
    

   
  //去左右空格;
  trim(s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
  },

  truePublish(){

    for(let i=0; i<1000;i++){
      let j=0;
      j=j+1;
    }
    
      var content = this.input_intro;
    const db = wx.cloud.database();


          // wx.showLoading({
          //   title: '发布中',
          // })
          // wx.hideLoading;
          console.log(app.globalData);
          db.collection('post').add({
            data: {
              nickName: app.globalData.userinfo.nickName,
              avatarUrl: app.globalData.userinfo.avatarUrl,
              gender: app.globalData.userinfo.gender,//性别 0：未知、1：男、2：女
              title: this.data.input_level,
              content: this.data.input_intro,
              image: this.data.bigImg,
              coordinate: db.Geo.Point(app.globalData.coordinate.longitude, app.globalData.coordinate.latitude),
              createTime:db.serverDate(),
              comment:[],
              condition: false,
              manageDate: []
            },
            success: res => {
              wx.hideLoading();
              // 在返回结果中会包含新创建的记录的 _id
              console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id);
              wx.showModal({
                title: '提示',
                content: '发布成功',
                showCancel: false,
                success: function(res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: 1
                    })
                   }
                }
              })
              this.updataAll();
            },
            fail: err => {
              console.error('[数据库] [新增记录] 失败：', err)
            }
          })  
          

  },
  submit() {
    var that = this;
    if (that.trim(that.data.input_intro) == "" || that.trim(that.data.input_intro) < 2) {
      wx.showModal({
        title: '提示',
        content: '内容有点少噢~(至少两个字)',
        showCancel: false
      })
      return;
    }
    wx.showModal({
      title: '提示',
      content: '是否发布',
      success: res =>{
        wx.showLoading({
          title: '发送中',
        })
        if(res.confirm){
        this.img_upload(this.truePublish);
      }
     }
    })
  },

  updataAll: function(){
    let postMessage = [];
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
        console.log(app.globalData.postMessage);
     },
    })
  }
})