// pages/checkout/checkout.js
import { Calendar } from '../../utils/Calendar.js';
import { api } from '../../utils/api/index.js';
const calendar = Calendar.getInstance();
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
    let { doctor, doctorId } = options;
    this.setData({
      doctorSetting: doctor == 1,
      doctorId,
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
    this.setDateInfo();
    this.setDoctorInfo();
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
  change: function (e) {
    let { direction } = e.currentTarget.dataset;
    let currentDirection = Number(direction);
    calendar.change(currentDirection);
    this.setDateInfo();
  },
  setDateInfo: function () {
    let { year, month } = calendar;
    let displayDate = new Date(year, month, 1);
    let data = {
      year,
      month: month + 1,
      doctorId: this.data.doctorId,
    }
    let url = api.calendar();
    app.ajax({
      url,
      data
    }).then(res => {
      let { workDay } = res.info;
      this.setData({
        year: displayDate.getFullYear(),
        month: this.preZero(displayDate.getMonth() + 1),
        dateList: calendar.getDateList()
      })
      workDay.forEach(el => {
        calendar.setMapObject(el, { color: 'red' })
      })

      this.setData({
        dateList: Array.from(calendar.map)
      })
    })
  },
  preZero: function (num) {
    let n = num.toString();
    if (n < 10) {
      n = `0${n}`
    }
    return n;
  },
  setDoctorInfo: function () {
    let { hospital, office, name } = app.globalData.doctorInfo;
    this.setData({
      hospital,
      office,
      name
    })
  }
})