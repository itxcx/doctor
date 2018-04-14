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
      setting: 'set',
      settingBtn: '设定'
    },
    pm: {
      startTime: '--:--',
      endTime: '--:--',
      active: false,
      setting: 'set',
      settingBtn: '设定'
    },
    patient: {
      am: false,
      pm: false,
    },
    setTitle: '今日设置',
    isChoose: false,
    isglobal: false,
    isOrder: false,
    amSettingBtn: '预约',
    pmSettingBtn: '预约',
    pmId: -1,
    amId: -1,
    globalAm:{
      startTime: '--:--',
      endTime: '--:--',
    },
    globalPm:{
      startTime: '--:--',
      endTime: '--:--',
    }
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
    this.doctorInit();
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
    if (!this.data.doctorSetting) {
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
      let list = res.info;
      this.setData({
        year: displayDate.getFullYear(),
        month: this.preZero(displayDate.getMonth() + 1),
        dateList: calendar.getDateList()
      })
      list.forEach(el => {
        calendar.setMapObject(el.workDay, { color: 'red' })
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
    calendar.rmMapObject('active');
    calendar.setMapObject(day, { active: true })
    if (!calendar.isOwn(day, 'isOver')) {
      this.data.setAble = true;
      this.data.isOrder = false;
    } else {
      this.data.setAble = false;
      this.data.isOrder = true
    }
    this.getTodaySetting(this.data.currentChooseYear, this.data.currentChooseMonth, this.data.currentChooseday);
    if (this.data.doctorSetting) {
      this.getDoctorList();
    } else {
      this.getOrderList();
      this.data.patient = {
        am: false,
        pm: false,
      }
      let dateTime = new Date(`${this.data.currentChooseYear}-${this.addZero(this.data.currentChooseMonth)}-${this.addZero(this.data.currentChooseday)}`).getTime();
      if (orderList.dateMap.has(dateTime)) {
        let arr = orderList.dateMap.get(dateTime);
        arr.forEach(el => {
          if (el.type === 0) {
            this.data.amSettingBtn = '取消'
            this.data.amId = el.id;
          } else if (el.type !== 1) {
            this.data.amSettingBtn = '预约'
            this.data.amId = -1;
          }
          if (el.type === 1) {
            this.data.pmSettingBtn = '取消'
            this.data.pmId = el.id;
          } else if (el.type !== 0) {
            this.data.pmSettingBtn = '预约'
            this.data.pmId = -1;
          }
        })
      } else {
        this.data.amSettingBtn = '预约'
        this.data.pmSettingBtn = '预约'
      }
    }
    this.setData({
      dateList: Array.from(calendar.map),
      setTitle: '今日设置',
      isChoose: true,
      isglobal: false,
      setAble: this.data.setAble,
      isOrder: this.data.isOrder,
      amSettingBtn: this.data.amSettingBtn,
      pmSettingBtn: this.data.pmSettingBtn,
      pmId: this.data.pmId,
      amId: this.data.amId,
      patient: this.data.patient
    })
  },
  allSetting: function () {
    this.data.am.active = true;
    this.data.pm.active = true;
    this.data.am.settingBtn = '设定';
    this.data.am.setting = 'set';
    this.data.pm.settingBtn = '设定';
    this.data.pm.setting = 'set';
    this.setData({
      setTitle: '默认设置',
      isChoose: true,
      isglobal: true,
      isOrder: false,
      setAble: true,
      am: this.data.am,
      pm: this.data.pm,
    })
  },
  getTodaySetting: function (year, month, day) {
    let url = api.workData();
    let data = {
      year: year / 1,
      month: month / 1,
      day: day / 1,
      doctorId: this.data.doctorId
    }

    app.ajax({
      url, data
    }).then(res => {
      let { intervalList } = res;
      this.data.am.active = false;
      this.data.pm.active = false;
      this.data.am.settingBtn = '设定';
      this.data.am.setting = 'set';
      this.data.pm.settingBtn = '设定';
      this.data.pm.setting = 'set';
      this.data.pm.startTime = this.data.globalPm.startTime;
      this.data.pm.endTime = this.data.globalPm.endTime;
      this.data.am.startTime = this.data.globalAm.startTime;
      this.data.am.endTime = this.data.globalAm.endTime;
      intervalList.forEach(el => {
        if (el.type == 0) {
          let start = el.interval[0];
          let end = el.interval[1];
          this.data.am.startTime = `${this.addZero(start.hour)}:${this.addZero(start.minute)}`;
          this.data.am.endTime = `${this.addZero(end.hour)}:${this.addZero(end.minute)}`;
          this.data.am.settingBtn = '取消';
          this.data.am.setting = 'cancel';
        } else if (el.type == 1) {
          let start = el.interval[0];
          let end = el.interval[1];
          this.data.pm.startTime = `${this.addZero(start.hour)}:${this.addZero(start.minute)}`;
          this.data.pm.endTime = `${this.addZero(end.hour)}:${this.addZero(end.minute)}`;
          this.data.pm.settingBtn = '取消';
          this.data.pm.setting = 'cancel';
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

    let { currentTarget: { dataset: { able, canset} } } = e;

    if (able) {
      if (canset ==='cancel'){
        this.unsetWorkTime(0)
      } else if(canset==='set'){
        this.ampmSetting(0, this.data.am);
      }
     
    }
  },
  pmSettingBtn: function (e) {
    let { currentTarget: { dataset: { able, canset } } } = e;
    console.log(e);
    if (able) {
      if (canset ==='cancel'){
        this.unsetWorkTime(1)
      }else if(canset === 'set'){
        this.ampmSetting(1, this.data.pm);
      }
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
      let time = {
        day: this.data.currentChooseday / 1,
        month: this.data.currentChooseMonth / 1,
        year: this.data.currentChooseYear / 1,
      }
      data = Object.assign({}, data, { time })
    }
    let url = api.setWorkTime();
    app.ajax({ url, data, method: 'POST' }).then(res => {
      wx.showToast({
        title: '设置成功',
        icon: 'successs'
      })
      this.setDateInfo();
      if (type === 0) {
        this.data.am.settingBtn = '取消';
        this.data.am.setting = 'cancel';
        this.data.am.active = false;
      } else if (type === 1) {
        this.data.pm.settingBtn = '取消';
        this.data.pm.setting = 'cancel';
        this.data.pm.active = false;
      }
      this.setData({
        am: this.data.am,
        pm: this.data.pm
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
    let { detail: { formId, target: { dataset: { id } } }, currentTarget: { dataset: { able } } } = e;

    if (able) {
      if (id !== -1) {
        this.cancel(id, 'am');
      } else {
        let url = api.patientOrder();
        let data = {
          year: this.data.currentChooseYear/1,
          month: this.data.currentChooseMonth/1,
          day: this.data.currentChooseday/1,
          userCode: formId,
          id: this.data.doctorId,
          type: 0
        }
        app.ajax({ method: 'POST', url, data }).then(res => {
          let { id } = res;
          this.data.amId = id;
          wx.showToast({
            title: '预约成功',
            icon: 'success'
          })
          this.data.amSettingBtn = '取消';
          this.data.patient.am = false;
          this.setData({
            amSettingBtn: this.data.amSettingBtn,
            patient: this.data.patient,
            amId: this.data.amId
          })
        })
      }

    }
  },
  patientOrderPm: function (e) {
    let { detail: { formId, target: { dataset: { id } } }, currentTarget: { dataset: { able } } } = e;
    if (able) {
      if (id !== -1) {
        this.cancel(id, 'pm');
      } else {
        let url = api.patientOrder();
        let data = {
          year: this.data.currentChooseYear/1,
          month: this.data.currentChooseMonth/1,
          day: this.data.currentChooseday/1,
          userCode: formId,
          id: this.data.doctorId,
          type: 1
        }
        app.ajax({ method: 'POST', url, data }).then(res => {
          let { id } = res;
          wx.showToast({
            title: '预约成功',
            icon: 'success'
          })
          this.data.pmSettingBtn = '取消';
          this.data.patient.pm = false;
          this.data.pmId = id;
          this.setData({
            pmSettingBtn: this.data.pmSettingBtn,
            patient: this.data.patient,
            pmId: this.data.pmId
          })
        })
      }
    }
  },
  confirm: function () {
    if (this.data.am.active) {
      this.ampmSetting(0, this.data.am);
    }
    if (this.data.pm.active) {
      this.ampmSetting(0, this.data.pm);
    }
  },
  cancel: function (id, time) {
    let url = api.cancel();
    let data = { id };
    app.ajax({ url, data,method:'POST'}).then(res => {
      if (time === 'am') {
        this.data.amSettingBtn = '预约';
        this.data.patient.am = false;
        this.data.amId = -1
      } else {
        this.data.pmSettingBtn = '预约';
        this.data.patient.pm = false;
        this.data.pmId = -1
      }
      wx.showToast({
        title: '取消成功',
        icon: 'success'
      })
      this.setData({
        amSettingBtn: this.data.amSettingBtn,
        pmSettingBtn: this.data.pmSettingBtn,
        patient: this.data.patient,
        amId: this.data.amId,
        pmId: this.data.pmId,
      })
    })
  },
  getOrderList: function () {
    let url = api.patientList();
    let data = { type: 0 }
    app.ajax({ url, data }).then(res => {
      let { list } = res;
      let currentList = [ ...list];
      orderList.sourceMap(currentList);
      orderList.getMap(this.data.doctorId);
    })
  },
  doctorInit() {
    if (this.data.doctorSetting) {
      let url = api.workData();
      let data = {
        doctorId: this.data.doctorId,
      }
      app.ajax({ url, data }).then(res => {
        if (res.intervalList.length > 0) {
          res.intervalList.forEach(el => {
            if (el.type === 0) {
              let am = el.interval;
              this.data.am.startTime = `${this.addZero(am[0].hour)}:${this.addZero(am[0].minute)}`; 
              this.data.globalAm.startTime = `${this.addZero(am[0].hour)}:${this.addZero(am[0].minute)}`;
              this.data.am.endTime = `${this.addZero(am[1].hour)}:${this.addZero(am[1].minute)}`; 
              this.data.globalAm.endTime = `${this.addZero(am[1].hour)}:${this.addZero(am[1].minute)}`;
            } else if (el.type === 1) {
              let pm = el.interval;
              this.data.pm.startTime = `${this.addZero(pm[0].hour)}:${this.addZero(pm[0].minute)}`;
              this.data.globalPm.startTime = `${this.addZero(pm[0].hour)}:${this.addZero(pm[0].minute)}`;
              this.data.pm.endTime = `${this.addZero(pm[1].hour)}:${this.addZero(pm[1].minute)}`;
              this.data.globalPm.endTime = `${this.addZero(pm[1].hour)}:${this.addZero(pm[1].minute)}`
            }
          })
          this.setData({
            am: this.data.am,
            pm: this.data.pm
          })
        }
      })
    }
  },
  unsetWorkTime:function(type){
    let url = api.unsetWorkTime();
    let data = {
      year: this.data.currentChooseYear/1,
      month: this.data.currentChooseMonth/1,
      day:this.data.currentChooseday/1,
      type,
    }
    app.ajax({url,data,method:'POST'}).then(res=>{
      wx.showToast({
        title: '取消成功',
        icon:"success"
      })
      this.setDateInfo();
      if(type ===0 ){
        this.data.am.settingBtn = '设定';
        this.data.am.setting = 'set';
        this.data.am.active =false;
      }else if(type ===1 ){
        this.data.pm.settingBtn = '设定';
        this.data.pm.setting = 'set';
        this.data.pm.active = false;
      }
      this.setData({
        am:this.data.am,
        pm:this.data.pm,
        globalPm: this.data.globalPm,
        globalAm: this.data.globalAm
      })
    })
  },
  gotoorder:function(){
    wx.navigateTo({
      url: '/pages/order/order',
    })
  }
})