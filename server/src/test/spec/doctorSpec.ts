import Database from '../../db';
import axios from 'axios';
import config from '../../config';
import * as qs from 'querystring';
import * as Protocol from '../../protocol';
import { ITestFunc, IResult } from '../ItestFunc';
import * as utils from '../utils';



let { apiPrefix, } = config;



let fn: ITestFunc = async function({ db, axi, }) {
  let ret: IResult[] = [];
  // 设定工作时间
  {
    await utils.clearAll();

    let route = apiPrefix + 'doctor/set/worktime';
    let body: Protocol.IReqSetWorktime;
    let validBody: Protocol.IReqSetWorktime = { type: 0, start: { hour: 9, minute: 30, }, end: { hour: 11, minute: 0, }, };

    let doctorInfo = { hospital: '熊猫医院', office: '眼科', name: 'tongpuman', regCode: 'tongpuman', };
    await db.insert('doctor', Object.assign({}, doctorInfo));

    // 非医生身份设定时间
    {
      let doctorAxi = await utils.getAxios('a1');
      let { data, } = await doctorAxi.post(route, validBody) as { data: Protocol.IResSetWorktime };
      ret.push({ title: '非医生身份设定时间', expect: 100, calc: data.code, });
    }

    // 绑定医生账号
    let openId: string = await utils.getOpenId(axi);
    await db.bindDoctor({ openId, regCode: 'tongpuman' });
    let doctorId: string = (await db.query('doctor', doctorInfo))[0]._id.toString();
    // 绑定之后可以正常设置
    {
      let { data, } = await axi.post(route, validBody) as { data: Protocol.IResSetWorktime };
      let doctorList = await db.query('worktime', { doctorId, });
      ret.push({ title: '成功绑定医生账号', expect: [undefined, 1,], calc: [data.code, doctorList.length,], });
      if (data.code !== undefined) {
        console.error(data.errMsg);
      }
    }
    // 0 表示非法的日期设定
    {
      body = Object.assign({}, validBody, { time: { year: 2018, month: 13, day: 1, } });
      let { data, } = await axi.post(route, body) as { data: Protocol.IResSetWorktime };
      ret.push({ title: '表示非法的日期设定', expect: [0,], calc: [data.code,], });
    }

    // 1 表示非法的上下午设定
    {
      body = Object.assign({}, validBody, { type: 2, });
      let { data, } = await axi.post(route, body) as { data: Protocol.IResSetWorktime };
      ret.push({ title: '表示非法的上下午设定', expect: [1,], calc: [data.code,], });
    }
    // 2 表示非法的工作时间区间设定
    {
      body = Object.assign({}, validBody, { type: 0, start: { hour: 13, minute: 0 }, });
      let { data, } = await axi.post(route, body) as { data: Protocol.IResSetWorktime };
      ret.push({ title: '表示非法的工作时间区间设定', expect: [2,], calc: [data.code,], });
    }
    // 3 过去的日子无法设定
    {
      body = Object.assign({}, validBody, { time: { year: 2017, month: 1, day: 1, } });
      let { data, } = await axi.post(route, body) as { data: Protocol.IResSetWorktime };
      ret.push({ title: '过去的日子无法设定', expect: [3,], calc: [data.code,], });
    }





  }


  // 查看预约列表
  {
    await utils.clearAll();
    // 增加一个doctor
    let doctorInfo = { hospital: '熊猫医院', office: '眼科', name: 'tongpuman', regCode: 'tongpuman', };
    await db.insert('doctor', Object.assign({}, doctorInfo));

    let doctorAxi = await utils.getAxios('b1');
    let openId: string = await utils.getOpenId(doctorAxi);
    await db.bindDoctor({ openId, regCode: 'tongpuman' });
    let doctorId: string = (await db.query('doctor', doctorInfo))[0]._id.toString();

    // 2020-1-1 8:00 - 12:00
    await db.insert('worktime', { doctorId, year: 2020, month: 1, day: 1, type: 0, start: { hour: 8, minute: 0, }, end: { hour: 12, minute: 0, } });

    // order
    let patientInfoList: { name: string }[] = [{ name: 'jianghuchuan-kenan', }, { name: 'maoli-lan', }, { name: 'maoli-xiaowulang', }];
    for (var i = 0; i < patientInfoList.length; i++) {
      let n = patientInfoList[i]
      let axi = await utils.getAxios(n.name);
      {
        let route = apiPrefix + 'bindPatient';
        await axi.post(route, n);
      }
      {
        let route = apiPrefix + 'patient/order';
        let body: Protocol.IReqOrder = { id: doctorId, year: 2020, month: 1, day: 1, type: i % 2, userCode: '123', };
        let { data, } = await axi.post(route, body) as { data: Protocol.IResSetWorktime };
        if (data.code !== undefined) {
          console.error(data.errMsg);
          console.log(doctorId);
        }
      }
    }



    let route = apiPrefix + 'doctor/list';
    let params: Protocol.IReqPatientList;

    // await utils.delay(5000);
    {
      params = { year: 2020, month: 1, day: 1, };
      let { data, } = await doctorAxi.get(route, { params, }) as { data: Protocol.IResPatientList, };
      ret.push({ title: '成功查询到患者列表', expect: [2, 0], calc: data.list.map(n => n.length), });
    }

    {
      params = { year: 2020, month: 2, day: 1, };
      let { data, } = await doctorAxi.get(route, { params, }) as { data: Protocol.IResPatientList, };
      ret.push({ title: '成功查询到患者列表', expect: [0, 0], calc: data.list.map(n => n.length), });
    }



  }



  return ret;
};


export default fn;