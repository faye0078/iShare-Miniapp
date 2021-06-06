// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const targetDB = db.collection(event.db);
try{
  if(event.type == "getAllPost"){
  return await targetDB.orderBy('createTime','desc').get();
  }
  if(event.type == "getCoodinate"){
    const _ = db.command
    return await targetDB.where({
          coordinate: _.geoWithin({
          centerSphere: [
            [event.longitude, event.latitude],
            10 / 6378.1,
          ]
        })
        }).get()
  }
}catch(e){
  console.error(e)
}
}