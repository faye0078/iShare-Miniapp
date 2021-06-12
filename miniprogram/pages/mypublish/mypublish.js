// miniprogram/pages/mypublish/mypublish.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 此页面 页面内容距最顶部的距离
    // height: app.globalData.height * 2 + 20,
    //页面是否渲染完毕
    isLoading: false,
    //用户读取的消息，依次四条
    user_message: [],
    //从全局变量中拷贝过来的总的数据
    all_data: [],
    activeIndex: 1,
    //是否最后一页
    isLastPage: false, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var id = getApp().globalData.openid;
    console.log(id);
    const db = wx.cloud.database();
    db.collection('post').where({
      _openid: id
    }).get({
      success: res => {
        this.data.all_data = res.data;
        console.log(this.data.all_data);
        console.log(this.data.all_data);
        //testdata 总数据的四项
        var testdata = this.data.all_data.slice(0, 4);
        //控制台检测赋值是否成功
        console.log(testdata);
        //将testdata赋给user_message（数组）
        this.setData({
        user_message: testdata
        });
      }
    })
  
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
        url: '/pages/publishdetail/publishdetail?messageId=' + e.currentTarget.id,
      })
    },
    goTop: function (e) { 
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

