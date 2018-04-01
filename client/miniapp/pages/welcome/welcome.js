// pages/welcome/welcome.js
import {api} from '../../utils/api/index.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMode: 'user',
    value: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        let { windowWidth, windowHeight } = res;
        this.setData({
          windowWidth,
          windowHeight
        })
      },
    })
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
    this.handleUser();
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
  loginMode: function () {
    let currentMode = this.data.currentMode;
    if (currentMode === 'user') {
      currentMode = 'doctor'
    } else {
      currentMode = 'user'
    }
    this.setData({
      currentMode,
    })
  },
  handleUser: function () {
    let { userInfo } = app.globalData;
    this.setData({
      userInfo,
    })
  },
  enter: function (e) {
    let isDoc = this.checkIsdoc(e);
    app.globalData.isDoc = isDoc;
    if(isDoc){
      this.onJumpisDoc()
    }else{
      this.onJumpisNoDoc();
    }
  },
  checkIsdoc:function(e){
    let { doctor } = e.currentTarget.dataset;
    return doctor == 1;
  },
  onJumpisDoc:function(){
    if (!this.data.value) {
      return wx.showToast({
        icon: 'loading',
        title: '请输入密钥',
      })
    } else {
      let url = api.bind();
      let data = {
        regCode: this.data.value
      }
      app.ajax({
        url,
        data,
      }).then(res => {
        wx.navigateTo({
          url: `/pages/checkout/checkout?docotr=1`,
        })
      }).catch(err=>{
        if(err.errMsg){
          wx.showToast({
            title: err.errMsg,
          })
        }
      })
    }
  },
  onJumpisNoDoc:function(){
    wx.navigateTo({
      url: `/pages/choose/choose`,
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      value: e.detail.value
    })
  }
})