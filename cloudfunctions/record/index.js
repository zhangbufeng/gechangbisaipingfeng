// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let db=cloud.database();
  let _ =db.command;
  //score
  let openid=event.openid;
  let score=await db.collection('score').where({
    rater:openid
  }).get();
  let scoreData=score.data;
  if(scoreData.length){
    let ids = scoreData.map(ele => ele.speaker);
    let speaker = await db.collection("speaker").where({
      "_id": _.in(ids)
    }).get();
    let speakerData = speaker.data;
    for (let i = 0; i < speakerData.length; i++) {
      let s = speakerData[i];
      let value = scoreData.filter(ele => ele.speaker == s._id)[0].score;
      s.score = value;
    }
    return {
      data:speakerData
    };
  }else{
      return []
  }
}