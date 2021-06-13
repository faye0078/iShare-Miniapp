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
    image_url: '',
    video_url: '',
    hideAdd: false,
    showimage: false,
    showvideo: false,
    bigImg: '',
    type: '',
    input_intro: ''
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

  input_intro: function(e) {
    let value = e.detail.value;
    this.setData({
      input_intro: value
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

  deleteImage(){
    this.setData({
      showimage: false,
      hideAdd: false,
      video_url: '',
      type: ''
      })
  },
  deleteVideo(){
    this.setData({
      showvideo: false,
      hideAdd: false,
      image_url: '',
      type: ''
    })
  },
   
  //去左右空格;
  trim(s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
  },

  chooseimage: function() {
    let that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image','video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success(res) {
        var data = res
        console.log(data)
        console.log(data.tempFiles)
        if(data.type=="image")
        that.setData({
          showimage: true,
          hideAdd: true,
          image_url: data.tempFiles[0].tempFilePath,
          type: "image"
        })
        else if(data.type=="video"){
          that.setData({
          showvideo: true,
          hideAdd: true,
          video_url: data.tempFiles[0].tempFilePath,
          type: "video"
          })
        }
        console.log(that.data.video_url)
        console.log(that.data.image_url)
      }
    })
  }, //上传
  img_upload: function(callBack) {
    if(this.data.type=="image"){
      let bigImg = this.data.bigImg;
      let img_url = this.data.image_url;
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
       let filePath = img_url;
       let cloudPath = new Date().getTime()+filePath.match(/\.[^.]+?$/)[0];
       console.log(cloudPath);
       wx.cloud.uploadFile({
         cloudPath,//云存储图片名字
         filePath,//临时路径
         success: res => {
           console.log('[上传图片] 成功：', res);
            bigImg = res.fileID;
            this.setData({
              bigImg: bigImg
            });
            callBack();
            
         },
          fail: res => {
           console.error('[上传图片] 失败：', e)
         },
       });
        
      }
      else if(this.data.type=="video"){
      let bigImg = this.data.bigImg;
      let img_url = this.data.video_url;
      let number = 0;
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
       let filePath = img_url;
       let cloudPath = new Date().getTime()+filePath.match(/\.[^.]+?$/)[0];
       console.log(cloudPath);
       wx.cloud.uploadFile({
         cloudPath,//云存储图片名字
         filePath,//临时路径
         success: res => {
           console.log('[上传视频] 成功：', res);
            bigImg = res.fileID;
            this.setData({
              bigImg: bigImg
            });
            callBack();
         },
          fail: res => {
           console.error('[上传视频] 失败：', e)
         },
       });
        
      }
  },
    
  

  truePublish(){
    const db = wx.cloud.database();
    const _=db.command;
    var manageData = {
      text_intro:this.data.input_intro,
      bigData: this.data.bigImg
  }  
  console.log(manageData)
    db.collection('post').doc(this.data.targetMessage._id).update({
      data: {
        manageData: _.push(manageData),
        condition: true,
        createTime: db.serverDate(),
      },
      success: e=>{
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '发布成功',
          showCancel: false,
          success: function() {
            wx.showLoading({
              title: '更新中',
            })
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
                wx.hideLoading();
                wx.navigateBack({
                  delta: 1
                })
             },
            });
          
              }
            })
          },
      fail: e=>{
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '发布失败',
          showCancel: false,
          success: function() {

              }
            })
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
          title: '发送中(视频文件较大，请稍等)',
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