// pages/welcome/welcome.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMode:'user'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res=>{
        let {windowWidth,windowHeight} = res;
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
  loginMode:function(){
    let currentMode = this.data.currentMode;
    if(currentMode ==='user'){
      currentMode = 'doctor'
    }else{
      currentMode = 'user'
    }
    this.setData({
      currentMode,
    })
  },
  enter:function(e){
    let { doctor } = e.currentTarget.dataset;
    app.globalData.doctor = doctor;
    wx.navigateTo({
      url: `/pages/checkout/checkout?doctor=${doctor}`,
    })
  }
})