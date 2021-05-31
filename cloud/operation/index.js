// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
 return await cloud.database().collection('comment').doc(event.id).update({
    data:{
      articleid:event.articleid,
      openid:event.openid,
      up : event.up,
      down: event.down,
      sc : event.sc,
      pinglun:event.pinglun,
      commentid:event.commentid

    }
  }).then(res=>{
    console.log("success",res)
    return res
  }).catch(res=>{
    console.log("false",res)
    return res
  })
}