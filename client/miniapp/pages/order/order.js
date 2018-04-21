// pages/order/order.js
import { api } from '../../utils/api/index.js';
import { Order } from '../../utils/order/order.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    list: [],
    first:true,
    more:'全部预约'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(1);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  changeType:function(){
    if(this.data.first){
      this.setData({
        type:0,
        first:false,
        more:'当前预约'
      })
      this.getList(0);
    }
  },
  getList: function (currentType) {
    console.log(currentType);
    let url = api.patientList();
    let data = {
      type: currentType
    }
    app.ajax({
      url, data
    }).then(res => {
      let { list } = res;
      let arr = [];
      list.forEach(el=>{
        let order =  new Order(el);
        order.getStatus();
        arr.push(order);
      })
      arr = arr.sort(this.compare);
      this.setData({
        list: arr
      })
    })
  },
  handleJumpCategroy:function(){
    wx.navigateTo({
      url: '/pages/category/category',
    })
  },
  cancel:function(e){
    let { currentTarget:{dataset:{id}} } =e;
    let url = api.cancel();
    let data = {id};
    app.ajax({url,data,method:'POST'}).then(res=>{
      this.setData({
        list:[],
        first: true
      })
      this.getList(1);
      if(!this.data.type){
        this.changeType(0)
      }
    });
  },
  compare:function(a,b){
    let val1 = new Date(a.date).getTime()+ (a.type==='上午'? 0 :1);
    let val2 = new Date(b.date).getTime()+ (b.type === '上午' ? 0 : 1);
    if(val1<val2){
      return -1;
    }else if(val1>val2){
      return 1;
    }else{
      return 0
    }
  }
})