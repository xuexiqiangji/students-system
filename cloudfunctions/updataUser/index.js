// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
// 云函数入口函数
const _ = db.command
exports.main = async (event, context) => {
  const {
    OPENID
  } = cloud.getWXContext()
  const { name, phone, citys, isHot, studentId, classId} = event
  if (classId){
    await db.collection('class').where({
      classId
    }).update({
      data:{
        commitedSum:_.push({
          name,
          phone,
          citys
        })
      }
    })
  }
  await db.collection('user').where({
    openId: OPENID
  }).update({
      data: {
        name,
        studentId,
        phone,
        classId,
        passCity: citys,
        isHot: isHot - 0,
        isCommited:1,
        isPut:true}
  })
  return 'ok'
}