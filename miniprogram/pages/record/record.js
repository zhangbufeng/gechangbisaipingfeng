// miniprogram/pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },
  onShow(){
    this.getRecord();
  },
  getRecord(){
    let openid=wx.getStorageSync('openid');
    wx.cloud.callFunction({
      name:'record',
      data:{
        openid:openid
      },
      success:res=>{
        if(res.result.data.length){
          this.setData({
            list:res.result.data
          })
        }else{
          wx.showToast({
            title: '暂无数据...',
            icon:'none'
          })
        }
      }
    })
  }
})