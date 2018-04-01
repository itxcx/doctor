// pages/choose/choose.js
import { format } from '../../utils/category/category.js'
import { api } from '../../utils/api/index.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCategoryList();
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
  onJumpCheckout:function(){
    if (this.data.currentId){
      return wx.navigateTo({
        url: `/pages/checkout/checkout?doctor=0&doctorId=${this.data.currentId}`
      })
    }
  },
  getCategoryList:function(){
    let url = api.doctorList();
    app.ajax({ url }).then(res => {
      let formatList = format(res.list);
      this.setData({
        categoryList:formatList
      })
    })
  },
  getOfficeList:function(e){
    let { value } = e.detail;
    let { hospital } = this.data.categoryList[value];
    return this.setData({
      hospital,
      officeList:this.data.categoryList[value].officeList
    })
  },
  getDoctorList:function(e){
    if (this.data.officeList){
      let { value } = e.detail;
      let { office } = this.data.officeList[value];
      return this.setData({
        office,
        nameList: this.data.officeList[value].nameList
      })
    }
    return this.showToast('请先选择医院');
  },
  getId:function(e){
    if (this.data.nameList) {
      let { value } = e.detail;
      let { id, name } = this.data.nameList[value];
      return this.setData({
        name,
        currentId:id
      });
    } 
    return this.showToast('请先选择科室');
  },
  showToast:function(title){
    wx.showToast({
      title: title,
    })
  }
})