import { mock } from './mock.js';
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const ajax=( options )=>{
  return new Promise((resolve,reject)=>{
    if (!options.url) {
      return wx.showToast({
        title: 'url必备参数',
      }) 
    }
    let { url,method } = options;
    if(!method){
      method='GET'
    }
    let getToken = wx.getStorageSync('token');
    let header = { token: getToken }
    let data = Object.assign({}, options.data);
    mock.request({
      url, header, data, method,
      success: res => {
        if(res.data.code===undefined){
          resolve(res.data);
        }else{
          wx.showToast({
            title: res.data.errMsg,
            mask:true,
            icon:'none'
          })  
        }
      },
      fail: err => {
        reject(err);
      }
    })
  })

}

const addZero =function(n){
  var str = n;
  if(n<10){
    str = `0${n}`
  }
  return str.toString();
}


module.exports = {
  formatTime: formatTime,
  ajax,
  addZero
}
