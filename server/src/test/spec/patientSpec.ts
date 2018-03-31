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


  // 获取病人信息
  {
    await utils.clearAll();

    // 未绑定前,患者获取不到自己的信息
    {
      let axi = await utils.getAxios();
      let route = apiPrefix + 'patientInfo';
      let { data, } = await axi.get(route) as { data: Protocol.IResPatientInfo };
      ret.push({ title: '未绑定前,患者获取不到自己的信息', expect: 0, calc: data.code, });
    }
    // 绑定后,患者可以获取到自己的信息
    {
      let axi = await utils.getAxios();
      {
        let patientInfo = { name: 'cat', };
        let route = apiPrefix + 'bindPatient';
        let body = Object.assign({}, patientInfo);
        await axi.post(route, body);
      }

      await utils.delay(2000);

      let route = apiPrefix + 'patientInfo';
      let { data, } = await axi.get(route) as { data: Protocol.IResPatientInfo };
      ret.push({ title: '绑定后,患者可以获取到自己的信息', expect: undefined, calc: data.code, });
    }

  }

  // 病人预约
  {
    await utils.clearAll();
    let doctorInfo = { hospital: '熊猫医院', office: '眼科', name: 'cat', regCode: 'a123456', };
    await db.insert('doctor', doctorInfo);
    let doctorId = (await db.queryOne('doctor', { name: 'cat', }))._id.toString();

    let doctorAxi = await utils.getAxios();
    await doctorAxi.post(apiPrefix + 'bind', { regCode: doctorInfo.regCode, });

    let validBody: Protocol.IReqSetWorktime = { time: { year: 2020, month: 1, day: 1, }, type: 0, start: { hour: 9, minute: 30, }, end: { hour: 11, minute: 0, }, };
    await doctorAxi.post(apiPrefix + 'doctor/set/worktime', validBody);

    // 绑定一个病人
    let patientAxi = await utils.getAxios();
    {
      let route = apiPrefix + 'bindPatient';
      await patientAxi.post(route, { name: 'dog' });
    }

    let route = apiPrefix + 'patient/order';
    let body: Protocol.IReqOrder;
    let validOrderBody: Protocol.IReqOrder = Object.assign({}, { id: doctorId, }, validBody.time, { type: validBody.type }) as Protocol.IReqOrder;

    // 2 不存在的医生编号
    {
      body = Object.assign({}, validOrderBody, { id: '12345678901s' }, );
      console.log(route, body);
      let { data, } = await patientAxi.post(route, body) as { data: Protocol.IResOrder };
      ret.push({ title: '预约-不存在的医生编号', expect: 2, calc: data.code });

    }
    // 0 非法的日期信息
    {
      body = Object.assign({}, validOrderBody, { year: 2010, month: 1, day: 1, }, );
      let { data, } = await patientAxi.post(route, body) as { data: Protocol.IResOrder };
      ret.push({ title: '预约-非法的日期信息', expect: 0, calc: data.code });
    }
    // 1 重复预约申请
    {

      body = Object.assign({}, validOrderBody, );
      let { data: data1, } = await patientAxi.post(route, body) as { data: Protocol.IResOrder };
      let { data: data2, } = await patientAxi.post(route, body) as { data: Protocol.IResOrder };
      ret.push({ title: '预约-重复预约申请', expect: [, 1,], calc: [data1.code, data2.code,] });

    }

    // 3 不在医生的就诊时间内预约
    {
      body = Object.assign({}, validOrderBody, { year: 3000, });
      let { data, } = await patientAxi.post(route, body) as { data: Protocol.IResOrder };
      ret.push({ title: '预约-不在医生的就诊时间内', expect: 3, calc: data.code, });
    }
  }


  // 取消预约 
  {
    await utils.clearAll();
    let doctorInfo = { hospital: '熊猫医院', office: '眼科', name: 'cat', regCode: 'a123456', };
    await db.insert('doctor', doctorInfo);
    let doctorId = (await db.queryOne('doctor', { name: 'cat', }))._id.toString();

    let doctorAxi = await utils.getAxios();
    await doctorAxi.post(apiPrefix + 'bind', { regCode: doctorInfo.regCode, });

    let validBody: Protocol.IReqSetWorktime = { time: { year: 2020, month: 1, day: 1, }, type: 0, start: { hour: 9, minute: 30, }, end: { hour: 11, minute: 0, }, };
    await doctorAxi.post(apiPrefix + 'doctor/set/worktime', validBody);

    // 绑定一个病人
    let patientAxi = await utils.getAxios();
    {
      let route = apiPrefix + 'bindPatient';
      await patientAxi.post(route, { name: 'dog' });
    }

    let route = apiPrefix + 'patient/order';
    let body: Protocol.IReqOrder;
    let validOrderBody: Protocol.IReqOrder = Object.assign({}, { id: doctorId, }, validBody.time, { type: validBody.type }) as Protocol.IReqOrder;

    {
      let route = apiPrefix + 'patient/order/cancel';
      let body: Protocol.IReqOrderCancel;
      // 取消不存在的预约
      {
        body = { id: 'a1234567890s' };
        let { data, } = await patientAxi.post(route, body) as { data: Protocol.IResOrderCancel, };
        ret.push({ title: '取消不存在的预约', expect: 0, calc: data.code, });

      }
      // 成功取消预约
      {
        // 先成功预约
        {
          await patientAxi.post(apiPrefix + 'patient/order', { id: doctorId, year: 2020, month: 1, day: 1, type: 0, });
        }
        let id = (await db.queryOne('order', {}))._id.toString();
        body = { id, };
        let { data, } = await patientAxi.post(route, body) as { data: Protocol.IResOrderCancel, };
        ret.push({ title: '成功取消预约', expect: undefined, calc: data.code, });


      }

    }

  }


  // 查看预约列表
  {
    let patientAxi = await utils.getAxios();
    // 清空
    await utils.clearAll();

    // 增加医生,设定他们的工作时间
    {
      let doctorList = [{ hospital: '熊猫医院', office: '眼科', name: '玻璃猫', regCode: 'bolimao', }, { hospital: '凤凰医院', office: '鼻科', name: '琉璃狗', regCode: 'liuligou', },];
      let worktimeList = [{ time: { year: 2020, month: 1, day: 1 }, type: 0, start: { hour: 8, minute: 0, }, end: { hour: 9, minute: 0, } }, { time: { year: 2020, month: 1, day: 2 }, type: 0, start: { hour: 8, minute: 0, }, end: { hour: 12, minute: 0, } },];

      for (let i = 0; i < doctorList.length; i++) {
        let di = doctorList[i];
        let wi = worktimeList[i];

        await db.insert('doctor', di);

        let axi = await utils.getAxios();
        await axi.post(apiPrefix + 'bind', { regCode: di.regCode, });
        await axi.post(apiPrefix + 'doctor/set/worktime', wi);
      }
    }

    // 增加预约
    {
      await patientAxi.post(apiPrefix + 'bindPatient', { name: '兔子', });

      let doctorId;
      doctorId = (await db.queryOne('doctor', { name: '玻璃猫' }))._id.toString();
      await patientAxi.post(apiPrefix + 'patient/order', { id: doctorId, year: 2020, month: 1, day: 1, type: 0, });

      doctorId = (await db.queryOne('doctor', { name: '琉璃狗' }))._id.toString();
      await patientAxi.post(apiPrefix + 'patient/order', { id: doctorId, year: 2020, month: 1, day: 2, type: 0, });

      // 增加一个过去的
      let patientId = (await db.queryOne('patient', { name: '兔子', }))._id.toString();
      await db.insert('order', { doctorId, patientId, year: 2010, month: 1, day: 1, type: 0, });
    }

    // 非法的预约查询类型
    {
      let { data, } = await patientAxi.get(apiPrefix + 'patient/list', { params: { type: 2, } }) as { data: Protocol.IResOrderList };
      ret.push({ title: '非法的预约查询类型', expect: 0, calc: data.code, });
    }

    // 查看所有预约
    {

      let { data, } = await patientAxi.get(apiPrefix + 'patient/list', { params: { type: 0, } }) as { data: Protocol.IResOrderList };;
      ret.push({ title: '查看所有预约', expect: [undefined, 3,], calc: [data.code, data.list.length,] });
    }

    // 查看今天以及以后的预约  
    {
      let { data, } = await patientAxi.get(apiPrefix + 'patient/list', { params: { type: 1, } }) as { data: Protocol.IResOrderList };;
      ret.push({ title: '查看今天以及以后的预约', expect: [undefined, 2,], calc: [data.code, data.list.length,] });
    }
  }

  return ret;
};

export default fn;