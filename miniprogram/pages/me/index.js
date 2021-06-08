// miniprogram/pages/me/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    userInfo: "",
    isHide: true,
    canIUseGetUserProfile: false,
    islogin: false,
    isExistUser: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        this.setData({
          openid: app.globalData.openid
        });
     },
    })
  },

  getUserProfile(e) {
    wx.getUserProfile({
    desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    success: (res) => {
    app.globalData.userinfo = res.userInfo;
    app.globalData.islogin = true;
    this.setData({
      islogin: true,
      userInfo: res.userInfo
      // nickName = e.detail.userInfo.nickName
      // avatarUrl = e.detail.uuserInfo.avatarUrl
      // gender = e.detail.userInfo.gender //性别 0：未知、1：男、2：女
      // province = e.detail.userInfo.province
      // city = e.detail.userInfo.city
      // country = e.detail.userInfo.country
    })
    console.log(this.data.userInfo.avatarUrl);
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
      }
      
     })
    
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
  onShow: function () {
    this.setData({
      islogin: app.globalData.islogin,
      userInfo: app.globalData.userinfo
    })
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

})