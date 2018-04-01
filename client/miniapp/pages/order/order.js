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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
    this.getNowDate();
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
  getNowDate: function () {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    this.setData({
      currentYear: year,
      currentMonth: month,
      currentDay: day
    })
  },
  changeType:function(){
    if(this.data.first){
      this.setData({
        type:0,
        first:false
      })
      this.getList();
    }
  },
  getList: function () {
    let url = api.orderList();
    let data = {
      type: this.data.type
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
      if (this.data.type) {
        this.data.list = [...this.data.list, ...arr];
      } else {
        this.data.list = [...arr, ...this.data.list];
      }
      this.setData({
        list: this.data.list
      })
    }).catch(e => {
      console.log(e);
    })
  }
})