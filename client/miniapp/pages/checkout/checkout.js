// pages/checkout/checkout.js
import { Calendar } from '../../utils/Calendar.js';
import { OrderList } from '../../utils/OrderList.js'
import { api } from '../../utils/api/index.js';
const calendar = Calendar.getInstance();
const orderList = OrderList.getInstance();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    am: {
      startTime: '--:--',
      endTime: '--:--',
      active: false,
    },
    pm: {
      startTime: '--:--',
      endTime: '--:--',
      active: false,
    },
    patient: {
      am: false,
      pm: false,
    },
    setTitle: '今日设置',
    isChoose: false,
    isglobal: false,
    isOrder: false,
    amSettingBtn:'预约',
    pmSettingBtn:'预约'
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
    if(!this.data.doctorSetting){
      this.getOrderList();
    }
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
  },
  amStart: function (e) {
    let { value } = e.detail;
    this.data.am.startTime = value;
    let start = this.data.am.startTime;
    let end = this.data.am.endTime;
    let reg = /\:/g
    if (Number(start.replace(reg, "")) > Number(end.replace(reg, ""))) {
      this.data.am.endTime = this.data.am.startTime;
    }
    this.setData({
      am: this.data.am
    })
  },
  amEnd: function (e) {
    let { value } = e.detail;
    this.data.am.endTime = value;
    this.setData({
      am: this.data.am
    })
  },
  pmStart: function (e) {
    let { value } = e.detail;
    this.data.pm.startTime = value;
    let start = this.data.pm.startTime;
    let end = this.data.pm.endTime;
    let reg = /\:/g
    if (Number(start.replace(reg, "")) > Number(end.replace(reg, ""))) {
      this.data.pm.endTime = this.data.pm.startTime;
    }
    this.setData({
      pm: this.data.pm
    })
  },
  pmEnd: function (e) {
    let { value } = e.detail;
    this.data.pm.endTime = value;
    this.setData({
      pm: this.data.pm
    })
  },
  chooseDay: function (e) {
    let { currentTarget: { dataset: { day } } } = e;
    this.setData({
      isChoose: false
    });
    this.data.currentChooseday = day;
    this.data.currentChooseMonth = this.data.month;
    this.data.currentChooseYear = this.data.year;
    if (calendar.isOwn(day, 'active') && !this.data.doctorSetting) {
      return wx.navigateTo({
        url: '/pages/order/order',
      })
    };
    calendar.rmMapObject('active');
    calendar.setMapObject(day, { active: true })
    if (!calendar.isOwn(day, 'isOver')) {  
      this.data.setAble = true;
      this.data.isOrder = false;
    }else{
      this.data.setAble = false;
      this.data.isOrder = true
    }
    this.getTodaySetting(this.data.currentChooseYear, this.data.currentChooseMonth, this.data.currentChooseday);
    if(this.data.doctorSetting){
      this.getDoctorList();
    }else{
      let dateTime = new Date(`${this.data.currentChooseYear/1}-${this.data.currentChooseMonth/1}-${this.data.currentChooseday/1}`).getTime();
      if (orderList.dateMap.has(dateTime)){
        let arr = orderList.dateMap.get(dateTime);
        arr.forEach(el=>{
            if (el.type === 0){
              this.data.amSettingBtn = '取消'
            } else if (el.type !== 1){
              this.data.amSettingBtn = '预约'
            }
            if (el.type === 1 ) {
              this.data.pmSettingBtn = '取消'
            } else if (el.type !== 0){
              this.data.pmSettingBtn = '预约'
            }
        })
      }else{
        this.data.amSettingBtn = '预约'
        this.data.pmSettingBtn = '预约'
      }
    }
    this.setData({
      dateList: Array.from(calendar.map),
      setTitle: '今日设置',
      isChoose: true,
      isglobal: false,
      setAble:this.data.setAble,
      isOrder: this.data.isOrder,
      amSettingBtn:this.data.amSettingBtn,
      pmSettingBtn: this.data.pmSettingBtn

    })
  },
  allSetting: function () {
    this.data.am.active = true;
    this.data.pm.active = true;
    this.setData({
      setTitle: '默认设置',
      isChoose: true,
      isglobal: true,
      isOrder: false,
      setAble:true,
      am:this.data.am,
      pm:this.data.pm,
    })
  },
  getTodaySetting: function (year, month, day) {
    let url = api.workData();
    let data = {
      year: year,
      month: month,
      day: day,
      doctorId: this.data.doctorId
    }
    app.ajax({
      url, data
    }).then(res => {
      let { intervalList } = res;
      this.data.am.active = false,
        this.data.pm.active = false,
        intervalList.forEach(el => {
          if (el.type == 0) {
            let start = el.interval[0];
            let end = el.interval[1];
            this.data.am.startTime = `${this.addZero(start.hour)}:${this.addZero(start.minute)}`;
            this.data.am.endTime = `${this.addZero(end.hour)}:${this.addZero(end.minute)}`;
          } else {
            let start = el.interval[0];
            let end = el.interval[1];
            this.data.pm.startTime = `${this.addZero(start.hour)}:${this.addZero(start.minute)}`;
            this.data.pm.endTime = `${this.addZero(end.hour)}:${this.addZero(end.minute)}`;
          }
        });
      this.setData({
        am: this.data.am,
        pm: this.data.pm
      })
    })
  },
  addZero: function (str) {
    let current = Number(str);
    if (current < 10) {
      current = 0 + current.toString();
    }
    return current.toString();
  },
  amSettingBtn: function (e) {

    let { currentTarget: { dataset: { able } } } = e;

    if (able) {
      this.ampmSetting(0, this.data.am);
    }
  },
  pmSettingBtn: function (e) {
    let { currentTarget: { dataset: { able } } } = e;
    if (able) {
      this.ampmSetting(0, this.data.pm);
    }
  },
  ampmSetting: function (type, typedata) {
    let { startTime, endTime } = typedata;
    let startArr = startTime.split(':');
    let endArr = endTime.split(':');
    let data = {
      type,
      start: {
        hour: startArr[0] / 1,
        minute: startArr[1] / 1,
      },
      end: {
        hour: endArr[0] / 1,
        minute: endArr[1] / 1,
      },
    }
    if (!this.data.isglobal) {
      data = Object.assign({}, data, {
        day: this.data.currentChooseday / 1,
        month: this.data.currentChooseMonth / 1,
        year: this.data.currentChooseYear / 1,
      })
    }
    let url = api.setWorkTime();
    app.ajax({ url, data }).then(res => {
      wx.showToast({
        title: '设置成功',
        icon: 'successs'
      })
    })
  },
  am: function () {
    this.data.am.active = !this.data.am.active;
    this.setData({
      am: this.data.am
    })
  },
  pm: function () {
    this.data.pm.active = !this.data.pm.active;
    this.setData({
      pm: this.data.pm
    })
  },
  changeList: function (e) {
    let { currentTarget: { dataset: { setorder } } } = e;
    if (setorder === "true") {
      return this.setData({
        isOrder: true
      })
    }
    this.setData({
      isOrder: false
    })
  },
  getDoctorList: function () {
    let url = api.doctorList();
    let data = {
      day: this.data.currentChooseday / 1,
      month: this.data.currentChooseMonth / 1,
      year: this.data.currentChooseYear / 1,
    }
    app.ajax({ url, data }).then(res => {
      let { list } = res;
      let amList = list[0];
      let pmList = list[1];
      this.setData({
        amList,
        pmList
      })
    })
  },
  patientAm: function () {
    this.data.patient.am = !this.data.patient.am;
    this.setData({
      patient: this.data.patient
    })
  },
  patientPm: function () {
    this.data.patient.pm = !this.data.patient.pm;
    this.setData({
      patient: this.data.patient
    })
  },
  patientOrderAm: function (e) {
    let { detail: { formId }, currentTarget:{dataset:{able}}} = e;
    if(able){
      let url = api.patientOrder();
      let data = {
        year:this.data.currentChooseYear,
        month:this.data.currentChooseMonth,
        day:this.data.currentChooseday,
        userCode: formId,
        id: this.data.doctorId,
        type:0
      }
      app.ajax({ method:'POST', url, data}).then(res=>{
        wx.showToast({
          title: '预约成功',
          icon:'success'
        })
      })
    }
  },
  patientOrderPm: function () {
    let { detail: { formId }, currentTarget: { dataset: { able } } } = e;
    if (able) {
      let url = api.patientOrder();
      let data = {
        year: this.data.currentChooseYear,
        month: this.data.currentChooseMonth,
        day: this.data.currentChooseday,
        userCode: formId,
        id: this.data.doctorId,
        type: 1
      }
      app.ajax({ method: 'POST', url, data }).then(res => {
        wx.showToast({
          title: '预约成功',
          icon: 'success'
        })
      })
    }
  },
  confirm:function(){
    if(this.data.am.active){
      this.ampmSetting(0, this.data.am);
    }
    if(this.data.pm.active){
      this.ampmSetting(0, this.data.pm);
    }
  },
  cancel:function(){
    this.setData({
      isChoose: false
    })
  },
  getOrderList:function(){
    let url = api.patientList();
    let data = {type:0}
    app.ajax({url,data}).then(res=>{
      let { list } = res;
      return new Promise(resolve=>{
        resolve(list);
      })
    }).then(e=>{
      let data = {type:1};
      app.ajax({url,data}).then(res=>{
        let { list } = res;
        let currentList = [...e,...list];
        orderList.sourceMap(currentList);
        orderList.getMap(this.data.doctorId/1);
      })
    })
  }
})