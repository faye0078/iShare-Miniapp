//index.js
//获取应用实例
const app = getApp()


Page({
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '发布-详情', //导航栏 中间的标题
      height: 0
    },
    userId: -1,
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    result_image_url: [],
    img_url: [],
    hideAdd: false,
    array: [],
    category_index: null,

    input_level: "",
    input_intro: "",

  },
  input_level: function(e) {
  let value = e.detail.value;
  this.setData({
    input_level: value
  });
  console.log(value);
  },
  input_intro: function(e) {
    let value = e.detail.value;
    this.setData({
      input_intro: value
    })
  },


  onLoad() {

  },
  /**
   * 删除选择的图片
   */
  deleteImg: function(res) {

    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否删除',
      success: function(e) {
        if (e.confirm) {
          var image = [];
          var i = 0;
          for (var j = 0; j < that.data.img_url.length; j++) {
            if (that.data.img_url[j] != res.target.id) {
              image.push(that.data.img_url[j])
            }
          }
          that.setData({
            img_url: image
          })
          if (that.data.img_url.length < 9) {
            that.setData({
              hideAdd: false
            })
          } else {
            that.setData({
              hideAdd: true
            })
          }
        }

      }
    })

  },


  chooseimage: function() {
    var that = this;
    wx.chooseImage({
      count: 9 - that.data.img_url.length, // 默认9 
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有 
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有 
      success: function(res) {

        if (res.tempFilePaths.length > 0) {
          //图如果满了9张，不显示加图
          if (that.data.img_url.length == 9) {
            that.setData({
              hideAdd: true
            })
          } else {
            that.setData({
              hideAdd: false
            })
          }
          //把每次选择的图push进数组
          let img_url = that.data.img_url;

          for (let i = 0; i < res.tempFilePaths.length; i++) {
            if (i <= 8) {
              img_url.push(res.tempFilePaths[i])
            }

          }
          that.setData({
            img_url: img_url
          })
          /**
           * 如果选择多于九张,停止添加
           */

          if (that.data.img_url.length == 9) {
            that.setData({
              hideAdd: true
            })
          } else {
            that.setData({
              hideAdd: false
            })
          }
        }
      }
    })
  }, //图片上传
  img_upload: function(res) {
    let that = this;
    let img_url = that.data.img_url;

    let images_url = [];
    //由于图片只能一张一张地上传，所以用循环
    for (var i = 0; i < img_url.length; i++) {
      var tempFilePaths = img_url[i];
      var nowTime = util.formatTime(new Date());
      //支持多图上传
      for (var i = 0; i < img_url.length; i++) {
        //显示消息提示框
        wx.showLoading({
          title: '上传中' + (i + 1) + '/' + img_url.length,
          mask: true
        })

        //上传图片
        //你的域名下的/images/文件下的/当前年月日文件下的/图片.png
        //图片路径可自行修改

        var path = 'images/' + nowTime + '/' + new Date().getTime() + Math.floor(Math.random() * 150) + '.png';
        uploadImage(img_url[i], path,
          function(result) {
            console.log("======上传成功图片地址为：", result);
            wx.hideLoading();
          },
          function(result) {
            console.log("======上传失败======", result);
            wx.hideLoading()
          }
        )
        images_url.push(path);
      }

      that.setData({
        result_image_url: images_url
      })
    }
  },
  //去左右空格;
  trim(s) {
    return s.replace(/(^\s*)|(\s*$)/g, "");
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
    var content = this.input_intro;
    const db = wx.cloud.database();
    wx.showModal({
      title: '提示',
      content: '是否发布',
      success: res =>{
        if(res.confirm){

          // wx.showLoading({
          //   title: '发布中',
          // })
          // wx.hideLoading;
          db.collection('post').add({
            data: {
              title: this.input_level,
              content: this.input_intro,
              image: this.img_url,
            },
            success: res => {
              // 在返回结果中会包含新创建的记录的 _id
              console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id);
            },
            fail: err => {
              console.error('[数据库] [新增记录] 失败：', err)
            }
          })  
          wx.showModal({
            title: '提示',
            content: '发布成功',
            showCancel: false,
            success: function(res) {
              if (res.confirm) {
                // wx.showLoading({
                //   title: '更新主页信息中~',
                // })
               }
            }
          })
        }
      }
    })
  },

  bindPickerChange: function(e) {
    this.setData({
      category_index: e.detail.value
    })

  }
})