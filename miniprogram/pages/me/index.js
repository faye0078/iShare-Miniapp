// miniprogram/pages/me/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    isHide: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const db = wx.cloud.database();
    wx.cloud.callFunction({
    name: 'login',
    data: {},
    success: res => {
      console.log('[云函数] [login] user openid: ', res.result.openid)
      app.globalData.openid = res.result.openid
      this.setData({
        openid: app.globalData.openid
      });

      db.collection('users').add({
        data: {
          // openid: this.openid
          name: 'wangyu'
        },
        success: res => {
          // 在返回结果中会包含新创建的记录的 _id
          console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        },
        fail: err => {
          console.error('[数据库] [新增记录] 失败：', err)
        }
      })

   },
  
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

})