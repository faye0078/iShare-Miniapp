// // miniprogram/pages/mypublish/mypublish.js
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     // 此页面 页面内容距最顶部的距离
//     height: app.globalData.height * 2 + 20,
//     user_message: [],
//     activeIndex: 1,
//     isLastPage: false, //是否最后一页
//     isLoading: false //页面是否渲染完毕
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
    
//     let that = this
//     /**
//      * 商家服务
//      */
//     this.setData({
//       user_message: getApp().globalData.postMessage,
//     })
//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {
//     let that = this
//     setTimeout(function() {
//       that.setData({
//         isLoading: true
//       })
//     }, 1000)
//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {
//     let that = this
   
//     /**
//      * 判断是否更新
//      */
//     if (getApp().globalData.isUpdate == 1) {
//       this.onLoad(),
//         this.setData({
//           activeIndex: 1,
//           isLastPage: false, //是否最后一页
//         })
//       getApp().globalData.isUpdate = -1
//     }

//   },
  

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {

//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {
//     // 最后一页了，取消下拉功能
//         if (this.data.isLastPage) {
//           return
//         }
//         this.loadMessage(++this.data.activeIndex)
//       },
//   loadMessage(index) {
//     wx.showLoading({
//       title: '加载中~',
//     })
//     var that = this;
//     var app = getApp()
//     wx.request({
//       url: getApp().globalData.url + '/getMessage/getAllMessageDetail/' + index,
//       method: "POST",
//       success: (res) => {
//         if (res.data == 200) {
//           that.setData({
//             isLastPage: true
//           })
//           return;
//         }
//         that.setData({
//           user_message: that.data.user_message.concat(res.data)
//         })


//       },
//       complete: function(res) {
//         wx.hideLoading();
//       },
//     })

//   },


//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   },

//     //跳转到详情页
//     to_message_detail: function(e) {
//       wx.navigateTo({
//         url: '/pages/message_detail/message_detail?messageId=' + e.currentTarget.id,
//       })
//     },
// })

