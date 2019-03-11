// miniprogram/pages/score/score.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    person:null,
    list:[
    ],
    id:'',
    currentIndex:''
  },
  onLoad(option){
    let id = option.id;
    this.setData({
      id:id
    })
  },
  onShow(){
    this.getSpeaker();
    this.getRulers();
  },
  getSpeaker(){
    wx.showLoading({
      title: '正在加载数据',
    })
    let db=wx.cloud.database();
    db.collection('speaker').where({
      _id:this.data.id
    }).get({
      success:(res)=>{
        wx.hideLoading();
        if(res.data.length){
          this.setData({
            person:res.data[0]
          })
        }else{
          wx.showToast({
            title: '查无此人',
            icon:'none'
          })
        }
      },
      fail:(err)=>{
        wx.hideLoading();
        wx.showToast({
          title: '数据获取失败',
          icon:'none'
        })
      }
    })
  },
  getRulers(){
    let db=wx.cloud.database();
    db.collection('rules').get({
      success:(res)=>{
        if(res.data.length){
          this.setData({
            list:res.data
          })
        }else{
          wx.showToast({
            title: '数据加载失败',
            icon:'none'
          })
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '数据获取失败',
          icon: 'none'
        })
      }
    })
  },

  opendown(event){
    let id=event.currentTarget.dataset.id;
    this.setData({
      currentIndex:id
    })
  },
  setScore(event){
    let { index1, index2, score } = event.currentTarget.dataset;
    this.data.list[index1].son[index2].total=score+1;
    let sum=0;
    sum=this.data.list[index1].son.map(ele=>ele.total).reduce((a,b)=>a+b);
    this.data.list[index1].total=sum;
    this.setData({
      list:this.data.list
    })
  },
  submit(event){
    let flag=true;
    for(let i=0;i<this.data.list.length;i++){
      let list=this.data.list[i]
      for(let j=0;j<list.son.length;j++){
        let s=list.son[j];
        if(!s.total){
          flag=false;
          wx.showToast({
            title: '每一项至少填一星',
            icon: 'none'
          })
          return;
        }
      }
    }
    let score = this.data.list.map(ele => ele.total).reduce((a, b) => a + b);
    let rater=wx.getStorageSync("openid");
    let speaker=this.data.id;
    let db=wx.cloud.database();
    db.collection('score').add({
      data:{
        score,
        rater,
        speaker
      },
      success:res=>{
        if(res._id){
          wx.navigateBack();
        }else{
          wx.showToast({
            title: '数据存储失败',
            icon: 'none'
          })
        }
      },
      fail:err=>{
        wx.showToast({
          title: '数据存储失败',
          icon:'none'
        })
      }
    })
  }
})