// pages/map/index.js
const app = getApp();
var QQMapWX = require('../../libs/qqmap-wx-jssdk');
var qqmapsdk;
var plugin = requirePlugin('routePlan');
var key = '2TUBZ-YLS62-F5MU3-CLO4Y-R4FDV-DOFEO';  //使用在腾讯位置服务申请的key
var referer = 'iShare Every';   //调用插件的app的名称
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: '',
    longitude: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: key
    });
    wx.getLocation({
      type: 'wgs84',
      isHighAccuracy: true,
      success: (res)=> {
        app.globalData.coordinate.latitude = res.latitude;
        app.globalData.coordinate.longitude = res.longitude;
        this.setData({
          latitude: app.globalData.coordinate.latitude,
          longitude: app.globalData.coordinate.longitude
        });
      }
     })
     console.log(app.globalData.postMessage);
    // let endPoint = JSON.stringify({  //终点
    //   'name': '吉野家(北京西站北口店)',
    //   'latitude': 39.89631551,
    //   'longitude': 116.323459711
    // });
    // wx.navigateTo({
    //   url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    // });
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
// 事件触发，调用接口
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

  add() {
    wx.navigateTo({
      url: '/pages/publish/publish',
    });
  }
 
})
