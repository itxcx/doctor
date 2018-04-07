// pages/welcome/welcome.js
import { api } from '../../utils/api/index.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMode: 'user',
    value: '',
    username: ''
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
    this.getInit();
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
    if (userInfo) {
      this.setData({
        userInfo,
      })
    } else {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    }
  },
  enter: function (e) {
    let isDoc = this.checkIsdoc(e);
    app.globalData.isDoc = isDoc;
    if (isDoc) {
      this.onJumpisDoc()
    } else {
      this.onJumpisNoDoc();
    }
  },
  checkIsdoc: function (e) {
    let { doctor } = e.currentTarget.dataset;
    return doctor == 1;
  },
  onJumpisDoc: function () {
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
        method: 'POST',
        url,
        data,
      }).then(res => {
        wx.setStorageSync('password', this.data.value);
        let { info: { hospital, office, name, id } } = res;
        app.globalData.doctorInfo = { hospital, office, name };
        wx.redirectTo({
          url: `/pages/checkout/checkout?doctor=1&doctorId=${id}`,
        })
      }).catch(err => {
        if (err.errMsg) {
          wx.showToast({
            title: err.errMsg,
          })
        }
      })
    }
  },
  onJumpisNoDoc: function () {
    if (!this.data.username) {
      return wx.showToast({
        icon: 'loading',
        title: '请输入名字',
      })
    } else {
      let url = api.patientReg();
      let data = {
        name: this.data.username
      };
      app.ajax({ url, data, method: 'POST' }).then(res => {
        wx.setStorageSync('username',this.data.username);
        let url = api.patientList();
        let data = {
          type: 1
        }
        app.ajax({ url, data }).then(res => {
          let { list } = res;
          if (list.length > 0) {
            wx.redirectTo({
              url: `/pages/order/order`,
            })
          } else {
            wx.redirectTo({
              url: `/pages/category/category`,
            })
          }
        })
      }).catch(err => {
        wx.showToast({
          title: err.errMsg,
          icon: 'lodding'
        })
      })
    }



  },
  bindKeyInput: function (e) {
    this.setData({
      value: e.detail.value
    })
  },
  bindKeyUserName: function (e) {
    this.setData({
      username: e.detail.value
    })
  },
  getSetting: function () {

  },
  getInit: function () {
    let username = wx.getStorageSync('username');
    let value = wx.getStorageSync('password');
    this.setData({
      username,
      value
    })
  }
})