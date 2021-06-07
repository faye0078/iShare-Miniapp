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

        console.log(this.data);
        wx.cloud.callFunction({
          // 需调用的云函数名
          name: 'readSQL',
          data: {
            type: "getCoodinate",
            db: "post",
            longitude: this.data.longitude,
            latitude: this.data.latitude,
          },
          // 成功回调
          success: res => {
            console.log(res.result.data);
            var mks = []
            for (var i = 0; i < res.result.data.length; i++) {
              mks.push({ // 获取返回结果，放到mks数组中
                title: res.result.data[i].title,
                id: res.result.data[i]._id,
                latitude: res.result.data[i].coordinate.coordinates[1],
                longitude: res.result.data[i].coordinate.coordinates[0],
                iconPath: "../../images/marker.png", //图标路径
                width: 50,
                height: 50
              })
              console.log(mks);
            }
            this.setData({ //设置markers属性，将搜索结果显示在地图中
              markers: mks
            })
         },
        })
      }
     })
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

  add: function() {
    if(app.globalData.islogin){
    wx.navigateTo({
      url: '/pages/publish/publish',
    });
  }
  else{
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
        wx.navigateTo({
          url: '/pages/publish/publish',
        });
        }
        
       })
      
    }
    })
    
  }
  },

  controltap: function(){
    wx.navigateTo({
      url: '/pages/publish/publish',
    });
  }
 
})
