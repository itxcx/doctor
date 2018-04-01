import { api } from './api/index.js';
export const dict = {
  //登陆test
  [api.login()]: (params) => {
    if (params && params.code != 1) {
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
  [api.bind()]: (params, header) => {
    if (params && params.regCode == 123) {
      return {
        code: "1",
        errMsg: "regCode错误",
      }
    } else if (header && !header.token) {
      return {
        code: '0',
        errMsg: "没有找到相关信息",
      }
    } else {
      return {
        info: {
          id: '_avc',
          // 医院
          hospital: '小姐姐厉害哟',
          // 科室
          office: '厉害',
          // 医生姓名
          name: '科室',
        }
      }
    }
  },

  [api.doctorList()]: (params, header) => {
    if (header && header.token) {
      return {
        list: [{
          id: 1,
          hospital: '医院一',
          office: '科室一',
          name: '医生一'
        }, {
          id: 2,
          hospital: '医院二',
          office: '科室二',
          name: '医生二'
        }, {
          id: 1,
          hospital: '医院一',
          office: '科室一',
          name: '医生二'
        }]
      }
    } else {
      return {
        code: "1",
        errMsg: "regCode错误",
      }
    }
  },

  [api.calendar()]: (params, header) => {
    if (params && params.month <= 12 && params.month > 0 && header && header.token) {
      return {
        info: {
          // 工作日
          workDay: [1, 2, 3, 4, 5, 28]
        }
      }
    } else if (params && params.month > 12 && params.month <= 0) {
      return {
        code: '0',
        errMsg: '非法的日期',
      }
    }
  },

  [api.orderList()]: (params, header) => {
    if (params && params.type && header && header.token) {
      return {
        list: [{
          id: 1,
          // 医院
          hospital: '仁爱医院',
          // 科室
          office: '眼科',
          // 医生姓名
          name: '吴爱国',
          year: 2018,
          month: 4,
          day: 1,
          type: 1,
        }, {
          id: 1,
          // 医院
          hospital: '仁爱医院',
          // 科室
          office: '眼科',
          // 医生姓名
          name: '吴爱国',
          year: 2018,
          month: 4,
          day: 1,
          type: 0,
        }, {
          id: 1,
          // 医院
          hospital: '仁爱医院',
          // 科室
          office: '眼科',
          // 医生姓名
          name: '吴爱国',
          year: 2018,
          month: 4,
          day: 1,
          type: 1,
        }]
      }
    } else {
      return {
        code: '0',
        errMsg: '非法预约类型'
      }
    }
  }
}

