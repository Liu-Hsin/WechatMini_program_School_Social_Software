// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()   
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  return await cloud.database().collection('activity').doc(event.id).update({
     data:{
      id: event.id,
      organizer : event.organizer,
      title: event.title,
      place : event.place,
      number:event.number,
      link : event.link,
      contents:event.contents,
      star_time:event.star_time,
      end_time:event.end_time,
      parter:_.addToSet(event.parter)
     }
   }).then(res=>{
     console.log("success",res)
     return res
   }).catch(res=>{
     console.log("false",res)
     return res
   })
 }