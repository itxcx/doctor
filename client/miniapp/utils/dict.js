import { api } from './api/index.js';
export const dict = {
  //登陆test
  [api.login()]: (params) => {
    if (params && params && params.code != 1) {
      return {
        code: "00",
        errMsg: "登陆成功",
        token: 'aabbcc'
      }
    } else {
      return {
        code: '50',
        errMsg: "登陆失败",
      }
    }
  },

  //绑定test
  [api.bind()]:(params,header)=>{
    if (params && params.regCode==123) {
      return {
        code: "1",
        errMsg: "regCode错误",
      }
    } else if (header && !header.token){
      return {
        code: '0',
        errMsg: "没有找到相关信息",
      }
    }else{
      return {info:{
        id: '_avc',
        // 医院
        hospital: '小姐姐厉害哟',
        // 科室
        office: '厉害',
        // 医生姓名
        name: '科室',
      }}
    }
  }
}

