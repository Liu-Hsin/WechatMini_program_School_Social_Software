// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()   
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('index').where({
    '_id':'b00064a76054bf6b0adc04827ae254ba',
  }).update({
    data:{
      notices:_.pull(event.notices) 
    },
    success:res=>{
      console.log(res)
    }
  })
}