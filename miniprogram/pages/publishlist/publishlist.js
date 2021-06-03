// // miniprogram/pages/mypublish/mypublish.js
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
//     imageUrl:"",
//     // 此页面 页面内容距最顶部的距离
//     height: app.globalData.height * 2 + 20,
//     currentIndex: 0,
//     swiper_images: [],
//     allCategoryMessage: [],
//     floorstatus: "none",
//     category_first: [],
//     category_second: [],
//     notice: [],
//     lost_new: {},
//     takeout: [],
//     ad_bottom: ["../../images/other/ad_bottom.jpg"],
//     user_message: [],
//     activeIndex: 1,
//     isLastPage: false, //是否最后一页
//     isUpdate: -1,
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
//       takeout: getApp().globalData.postMessage,
//     })

//     /**
//      * 轮播图
//      */
//     this.setData({
//       swiper_images: getApp().globalData.swiperImages
//     })
//     /**
//      * 分类信息
//      */
//     this.setData({
//       allCategoryMessage: getApp().globalData.categoryMessage
//     })
//     var get_first = getApp().globalData.categoryMessage.slice(0, 10);
//     var tem = [{}, {}, {}, {}, {}]
//     var get_second = getApp().globalData.categoryMessage.slice(10, 13).concat(tem)
//     this.setData({
//       category_first: get_first,
//       category_second: get_second,
//       category_second: get_second
//     })
//     /**
//      * 公告信息
//      */
//     this.setData({
//       notice: getApp().globalData.noticeMessage
//     })
//     /**
//      *第一页最新信息
//      */
//     this.setData({
//       user_message: getApp().globalData.messageDetail
//     })
//     /**
//      * 获取最新失物招领
//      */
//     this.setData({
//       lost_new: getApp().globalData.lost_new
//     })

//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {

//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {

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

