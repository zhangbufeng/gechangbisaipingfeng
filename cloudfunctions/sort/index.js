// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let db = cloud.database();
  let _ = db.command;
  //score
  let openid = event.openid;
  let score = await db.collection('score').get();
  let scoreData = score.data;
  if (scoreData.length) {
    let speaker = await db.collection("speaker").get();
    let speakerData = speaker.data;
    for (let i = 0; i < speakerData.length; i++) {
      let s = speakerData[i];
      let grade = scoreData.filter(function(a){
        if(a.speaker==s._id){
          return a
        }
      })
      if(grade.length){
        let num=grade.length;
        let grades=0
        for(let j=0;j<num;j++){
          grades+=grade[j].score
        }
        let aa=grades/num;
        s.score=aa
      }
    }
    speakerData=speakerData.sort((a,b)=>b.score-a.score)
    return{
      data:speakerData
    }
  } 
}