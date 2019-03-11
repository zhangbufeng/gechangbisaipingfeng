// let app=getApp()
// app.globalData.host
Page({
  data:{
    list:[],
    index:0
  },
  onLoad(){
    this.getopenid();
  },
  onShow(){
    this.queryList();
  },
  queryList(){
    wx.showLoading({
      title: '正在加载...',
      mask:true
    })
    wx.cloud.init();
    const db=wx.cloud.database()
    db.collection('speaker').get({
      success:(res)=>{
        wx.hideLoading();
       this.setData({
         list:res.data
       })
      },
      fail:res=>{
        wx.hideLoading();
        wx.showLoading({
          title: '数据加载失败',
          mask: true
        })
      }
    })
  },
  setIndex(event){
    this.setData({
      index:event.detail.value
    })
  },
  getopenid(){
    wx.cloud.callFunction({
      name:'getopenid',
      success:(res)=>{
        wx.setStorageSync('openid', res.result.openid)
        //res.result.openid
      }
    })
  },
  goscore(event){
    /* 判断 rater speaker */
    let rater=wx.getStorageSync('openid');
    let index=this.data.index;
    let speaker=this.data.list[index]._id;
    let db = wx.cloud.database()
    db.collection('score').where({
      rater: rater,
      speaker: speaker
    })
      .get({
        success: res=>{
          if(res.data.length){
            wx.showToast({
              title: '已为该选手打分',
              icon:'none'
            })
          }else{
            wx.navigateTo({
              url: '/pages/score/score?id='+speaker,
            })
          }
        },
        fail:err=>{
          wx.showToast({
            title: '网络错误',
            icon:'none'
          })
        }
      })
  }
})