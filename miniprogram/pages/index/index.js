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
    user_message: [],
    search_message: [],
    targetID: '',
    showModalStatus: false,
    input_search: '',
    isSearch: false,
    distance: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: key
    });
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      success: (res)=> {
        app.globalData.coordinate.latitude = res.latitude;
        app.globalData.coordinate.longitude = res.longitude;
        this.setData({
          latitude: app.globalData.coordinate.latitude,
          longitude: app.globalData.coordinate.longitude
        });

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
            this.setData({
              user_message: res.result.data
            })
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
            }
            this.setData({ //设置markers属性，将搜索结果显示在地图中
              markers: mks
            })
            console.log(this.data.markers);
         },
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
      showModalStatus: false,
      isSearch: false,
    })
// 事件触发，调用接口
if (getApp().globalData.isupdate_1 == 1) {
  wx.getLocation({
    type: 'gcj02',
    isHighAccuracy: true,
    success: (res)=> {
      app.globalData.coordinate.latitude = res.latitude;
      app.globalData.coordinate.longitude = res.longitude;
      this.setData({
        latitude: app.globalData.coordinate.latitude,
        longitude: app.globalData.coordinate.longitude
      });

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
          this.setData({
            user_message: res.result.data
          })
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
          }
          this.setData({ //设置markers属性，将搜索结果显示在地图中
            markers: mks
          })
          console.log(this.data.markers);
       },
      })
    }
   })
  getApp().globalData.isupdate_1 = -1
}
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
  input_search(e){
    let value = e.detail.value;
  this.setData({
    input_search: value
  });
  },

  searchMarkers(){
    let that = this;
    let target = this.data.input_search;
    wx.showLoading({
      title: '搜索中',
    })
   var searchdata = []
   var mks = []
    for(let i=0;i<that.data.user_message.length;i++){
      console.log(that.data.user_message[i].title);
      if(that.data.user_message[i].title==target){
        searchdata.push(that.data.user_message[i])
        mks.push({ // 获取返回结果，放到mks数组中
          title: that.data.user_message[i].title,
          id: that.data.user_message[i]._id,
          latitude: that.data.user_message[i].coordinate.coordinates[1],
          longitude:that.data.user_message[i].coordinate.coordinates[0],
          iconPath: "../../images/marker.png", //图标路径
          width: 50,
          height: 50
        })
      }
    }
    this.setData({
      search_message: searchdata,
      markers: mks,
      input_search: '',
      isSearch: true
    })
    wx.hideLoading();
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


  markertap: function(e){
    console.log(e.detail);
    //电脑
    // console.log(e.detail.markerId-900000000);
    // var number = e.detail.markerId-900000000; 
    // console.log(this.data.user_message);
    // console.log(this.data.search_message);
    // console.log(number);
    // if(this.data.isSearch){
    //   var a = this.data.search_message[number].coordinate.coordinates[1];
    //     var b = this.data.search_message[number].coordinate.coordinates[0]
    //     console.log(a);
    //     var distance =this.distance(a,b,app.globalData.coordinate.latitude,app.globalData.coordinate.longitude)
    //   this.setData({
    //     targetID: this.data.search_message[number],
    //     showModalStatus: true,
    //     distance: distance
    // })
    // }
    // else{
    //   var a = this.data.user_message[number].coordinate.coordinates[1];
    //     var b = this.data.user_message[number].coordinate.coordinates[0]
    //     console.log(a);
    //     var distance =this.distance(a,b,app.globalData.coordinate.latitude,app.globalData.coordinate.longitude)
    // this.setData({
    //   targetID: this.data.user_message[number],
    //   showModalStatus: true,
    //   distance:distance
    // })
    // }
    // 手机
    if(this.data.isSearch){
      for(var i=0;i<this.data.search_message.length;i++){
        if(this.data.search_message[i]._id == e.detail.markerId){
        var a = this.data.search_message[i].coordinate.coordinates[1];
        var b = this.data.search_message[i].coordinate.coordinates[0]
        console.log(a);
        var distance =this.distance(a,b,app.globalData.coordinate.latitude,app.globalData.coordinate.longitude)
        console.log(distance);
          this.setData({
          targetID: this.data.search_message[i],
          showModalStatus: true,
          distance: distance
          })
        }
      }
    }
    else{
    for(var i=0;i<this.data.user_message.length;i++){
      if(this.data.user_message[i]._id == e.detail.markerId){
        var a = this.data.user_message[i].coordinate.coordinates[1];
        var b = this.data.user_message[i].coordinate.coordinates[0]
        console.log(a);
        var distance =this.distance(a,b,app.globalData.coordinate.latitude,app.globalData.coordinate.longitude)
        console.log(distance);
        this.setData({
        targetID: this.data.user_message[i],
        showModalStatus: true,
        distance: distance
        })
      }
    }
    }
  },

  hideModal: function() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function() {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },

  letgo: function(){

    qqmapsdk.reverseGeocoder({
       //Object格式
        location: {
          latitude: this.data.targetID.coordinate.coordinates[1] ,
          longitude: this.data.targetID.coordinate.coordinates[0]
        },
      success: function(res) {
        console.log(res.result);
    let endPoint = JSON.stringify({  //终点
      'name': res.result.address,
      'latitude': res.result.location.lat,
      'longitude': res.result.location.lng
  });
  wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
  });
      }
    })
    
  },

  getDetail: function(){
    wx.navigateTo({
      url: '/pages/publishdetail/publishdetail?messageId=' + this.data.targetID._id,
    })
  },

  distance: function(la1, lo1, la2, lo2) {
    var La1 = la1 * Math.PI / 180.0;
    var La2 = la2 * Math.PI / 180.0;
    var La3 = La1 - La2;
    var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;//地球半径
    s = Math.round(s * 10000) / 10000;
    console.log("计算结果",s);
    return s;
    },
 
})

