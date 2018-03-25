/*
    *********************************************  
                       _ooOoo_  
                      o8888888o  
                      88" . "88  
                      (| -_- |)  
                      O\  =  /O  
                   ____/`---'\____  
                 .'  \|     |//  `.  
                /  \|||  :  |||//  \  
               /  _||||| -:- |||||-  \  
               |   | \\  -  /// |   |  
               | \_|  ''\---/''  |   |  
               \  .-\__  `-`  ___/-. /  
             ___`. .'  /--.--\  `. . __  
          ."" '<  `.___\_<|>_/___.'  >'"".  
         | | :  `- \`.;`\ _ /`;.`/ - ` : | |  
         \  \ `-.   \_ __\ /__ _/   .-` /  /  
    ======`-.____`-.___\_____/___.-`____.-'======  
                       `=---='  
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  
               佛祖保佑       永无BUG  
*/
import * as Struct from './struct';

// *** 基础response格式
// *** 带有code[错误码]和msg[错误信息]
// *** 当code===undefined的时候,表示正确
interface IResBase {
  // 错误码
  code?: number,
  // 错误信息
  errMsg?: string,
};

export interface IReqToken {
  code: string,
}
export interface IResToken extends IResBase {
  token?: string,
}

export interface IReqOpenId {
}
export interface IResOpenId extends IResBase {
  openId?: string,
}


// 绑定医生
export interface IReqBind {
  regCode:string,
}


export interface IResBind extends IResBase {
  info?: {
    // 医生编号,唯一
    id: string,
    // 医院
    hospital: string,
    // 科室
    office: string,
    // 医生姓名
    name: string,
  },
}


// 绑定患者
export interface IReqBindPatient {
  name:string,
}


export interface IResBindPatient extends IResBase {

}

// 获取医生列表
export interface IReqDoctorList {

}


export interface IResDoctorList extends IResBase {
  list: {
    id: string,
    hospital: string,
    office: string,
    name: string,
  }[],
}

// 获取日历
export interface IReqCalendar {
  doctorId: string,
  year: number,
  month: number,
}


export interface IResCalendar extends IResBase {
  info: {
    // 工作日
    workDay: number,
  }[],
}

// 工作日时间细节
export interface IReqWorkDay {

  doctorId: string,
  year: number,
  month: number,
  day: number,
}


export interface IResWorkDay extends IResBase {
  intervalList: {
    // 上午/下午
    // 0 表示上午
    // 1 表示下午
    type: number,
    // 工作时间区间,数组长度2,表示从开始到结束
    interval: {
      // 小时
      hour: number,
      // 分钟
      minute: number,
    }[],

  }[],
}


// 医生设置时间
export interface IReqSetWorktime {
  // time为undefined为全局设置
  // 否者为某一天的特定设置
  time?: {
    year: number,
    month: number,
    day: number,
  },

  // 上午/下午
  // 0 表示上午
  // 1 表示下午
  type: number,
  // 工作时间区间,数组长度2,表示从开始到结束
  start: {
    // 小时
    hour: number,
    // 分钟
    minute: number,
  },
  end: {
    // 小时
    hour: number,
    // 分钟
    minute: number,

  }

}


export interface IResSetWorktime extends IResBase {
  // 0 表示非法的日期设定
  // 1 表示非法的上下午设定
  // 2 表示非法的工作时间区间设定
  // 3 过去的日子无法设定
}


// 获取预约列表
export interface IReqPatientList {
  year: number,
  month: number,
  day: number,
}


export interface IResPatientList extends IResBase {
  list: { name: string, }[][],

}

// 病人预约
export interface IReqOrder {
  // 医生编号,唯一
  id: string,

  year: number,
  month: number,
  day: number,
  type: number,

  // 特殊的或者操作code,用以信息模板
  userCode: string,

}


export interface IResOrder extends IResBase {
  // 0 非法的日期信息
  // 1 重复预约申请
  // 2 不存在的医生编号
}


// 病人取消预约
export interface IReqOrderCancel {
  // 预约编号
  id: string,
}


export interface IResOrderCancel extends IResBase {
  // 0 该预约编号不存在
}

// 病人查看自己的所有预约
export interface IReqOrderList {
  // 0 所有的预约
  // 1 今天以及将来
  type: number,
}


export interface IResOrderList extends IResBase {
  list?: {
    // 预约编号
    id: string,

    // 医院
    hospital: string,
    // 科室
    office: string,
    // 医生姓名
    name: string,

    year: number,
    month: number,
    day: number,
    type: number,
  }[]
}
