// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  let arr = [
    { 'names': '小李', title: '人工智能的发展', direction: 'UAI', classes: 'UAIW1803' },
    { 'names': "小A", title: '算法的发展', direction: 'UI', classes: 'uai1803' },
    { 'names': "小B", title: '人工智能的发展', direction: 'UAI', classes: 'UAIW1803' },
    { 'names': "小C", title: '人工智能的发展', direction: 'UAI', classes: 'UAIW1803' },
    { 'names': "小D", title: '人工智能的发展', direction: 'UAI', classes: 'UAIW1803' },
  ];
  for (let i = 0; i < arr.length; i++) {
    try {
      await db.collection('speaker').add({
        data: arr[i]
      })
    } catch (e) {
      console.log(e);
    }
  }
  return 'ok';
}