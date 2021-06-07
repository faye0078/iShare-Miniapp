// miniprogram/pages/mypublish/mypublish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 此页面 页面内容距最顶部的距离
    // height: app.globalData.height * 2 + 20,
    isLoading: false,
    user_message: [],
    all_data: [],
    activeIndex: 1,
    isLastPage: false, //是否最后一页
    // isLoading: false //页面是否渲染完毕
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    let that = this;
    /**
     * 获取部分数据
     */
    this.setData({
      all_data: getApp().globalData.postMessage,
    })
    var testdata = this.data.all_data.slice(0, 4);
    console.log(testdata);
    this.setData({
      user_message: testdata
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    setTimeout(function() {
      that.setData({
        isLoading: true
      })
    }, 100)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.goTop();
    /**
     * 判断是否更新
     */
    if (getApp().globalData.isUpdate == 1) {
      this.onLoad(),
        this.setData({
          activeIndex: 1,
          isLastPage: false, //是否最后一页
        })
      getApp().globalData.isUpdate = -1
    }
    console.log(this.data.all_data);
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
        postMessage = res.result.data;
        getApp().globalData.postMessage = postMessage;
        getApp().globalData.isUpdate = 1;
     },
    });
    // this.onShow();
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 最后一页了，取消下拉功能
        if (this.data.isLastPage) {
          return
        }
        this.loadMessage(++this.data.activeIndex)
      },
  loadMessage(index) {
    wx.showLoading({
      title: '加载中~',
    })
    var that = this;
    that.setData({
      user_message: that.data.all_data.slice(0,index*4)
    })
    wx.hideLoading();
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

    //跳转到详情页
    to_message_detail: function(e) {
      wx.navigateTo({
        url: '/pages/message_detail/message_detail?messageId=' + e.currentTarget.id,
      })
    },
    goTop: function (e) {  // 一键回到顶部
      if (wx.pageScrollTo) {
        wx.pageScrollTo({
          scrollTop: 0
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
    }

 })

