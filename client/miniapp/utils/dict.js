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
          id: '1',
          // 医院
          hospital: '仁爱医院',
          // 科室
          office: '眼科',
          // 医生姓名
          name: '吴爱国',
        }
      }
    }
  },

  [api.categoryList()]: (params, header) => {
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

  [api.patientList()]: (params, header) => {
    if (params && params.type == 1 && header && header.token) {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth()+1;
      let day  =date.getDate();
      return {
        list: [{
          id: 1,
          // 医院
          hospital: '仁爱医院',
          // 科室
          office: '眼科',
          // 医生姓名
          name: '吴爱国',
          year: year,
          month: month,
          day: day,
          type: 1,
        }, {
          id: 1,
          // 医院
          hospital: '仁爱医院',
          // 科室
          office: '眼科',
          // 医生姓名
          name: '吴爱国',
          year: year,
          month: month,
          day: day+1,
          type: 0,
        }, {
          id: 1,
          // 医院
          hospital: '仁爱医院',
          // 科室
          office: '眼科',
          // 医生姓名
          name: '吴爱国',
          year: year,
          month: month,
          day: day+2,
          type: 1,
        }]
      }
    } else if (params && params.type == 0) {
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
  },
  [api.workData()]: (params, header) => {
    if (!params || !params.doctorId) {
      return {
        code: '01',
        returnMsg: '医生id是必填参数'
      }
    } else {
      return {
        intervalList: [{
          type: 0,
          interval: [{
            hour: 9,
            minute: 30,
          }, {
            hour: 11,
            minute: 0,
          }]
        }, {
          type: 1,
          interval: [{
            hour: 13,
            minute: 30,
          }, {
            hour: 18,
            minute: 0,
          }]
        }]
      }
    }
  },
  [api.setWorkTime()]: (params, header) => {
    if (params && params.type > 1 && params.type < 0) {
      return {
        code: 1,
        errMsg: '非法上下午设定'
      }
    } else {
      return {
        data: '设置成功'
      }
    }
  },

  [api.doctorList()]: (params, header) => {
    if (params && params.data < 0) {
      return {
        code: 0,
        errMsg: '非法日期'
      }
    } else {
      return {
        list: [[
          { name: '扑小满' }, { name: '扑大满' },
          { name: '扑小满' }, { name: '扑大满' },
          { name: '扑小满' }, { name: '扑大满' },
          { name: '扑小满' }, { name: '扑大满' },
          { name: '扑小满' }, { name: '扑大满' },
          { name: '扑小满' }, { name: '扑大满' },
          { name: '扑小满' }, { name: '扑大满' },
          { name: '扑小满' }, { name: '扑大满' }
        ], [
          { name: '扑小满' }, { name: '扑大满' },
          { name: '扑小满' }, { name: '扑大满' },
          { name: '扑小满' }, { name: '扑大满' },
          { name: '扑小满' }, { name: '扑大满' },
          { name: '扑小满' }, { name: '扑大满' },
          { name: '扑小满' }, { name: '扑大满' },
          { name: '扑小满' }, { name: '扑大满' },
          { name: '扑小满' }, { name: '扑大满' }
        ]]
      }
    }
  },

  [api.patientOrder()]: (params, header)=>{
    if(params&&!params.day){
      return {
        code:'0',
        errMsg:"非法日期"
      }
    }else if(params&&!params.id){
      return {
        code: '2',
        errMsg: "不存在的医生编号"
      }
    }else{
      return {
        id:'00001'
      }
    }
  },

  [api.patientReg()]: (params, header)=>{
    if (params && !params.name){
      return {
        code: '0',
        errMsg: "请输入用户名"
      }
    }else{
      return {
        message:'绑定成功'
      }
    }
  }
}

