import Database from '../../db';
import axios from 'axios';
import config from '../../config';
import * as qs from 'querystring';
import * as Protocol from '../../protocol';
import { ITestFunc, IResult } from '../ItestFunc';
import { } from '../utils';


let { apiPrefix, } = config;

let clearCalendar = async function() {
  let db = await Database.getIns();
  await db.clearCalendar();
};

let fn: ITestFunc = async function({ db, axi, }) {
  let ret: IResult[] = [];

  // 医生列表
  {
    let route = apiPrefix + 'common/doctorList';
    let { data, } = await axi.get(route) as { data: Protocol.IResDoctorList };
    ret.push({ title: '获取医生列表', expect: [data.code, data.list.length != 0], calc: [, true] });
  }



  // 获取医生的日历
  {
    await clearCalendar();
    let db = await Database.getIns();

    let doctorId: string = 'a12345678';

    await db.insertCalendar({ doctorId, year: 2018, month: 1, day: 10, type: 0, start: { hour: 9, minute: 0, }, end: { hour: 11, minute: 0, }, });
    await db.insertCalendar({ doctorId, year: 2018, month: 1, day: 10, type: 1, start: { hour: 12, minute: 0, }, end: { hour: 16, minute: 30, } });
    await db.insertCalendar({ doctorId, year: 2018, month: 1, day: 11, type: 0, start: { hour: 7, minute: 0, }, end: { hour: 11, minute: 30, } });
    await db.insertCalendar({ doctorId, year: 2018, month: 2, day: 12, type: 0, start: { hour: 7, minute: 0, }, end: { hour: 11, minute: 30, } });

    let route = apiPrefix + 'common/calendar';

    {
      let params = { doctorId, year: 2018, month: 1 };
      let { data, } = await axi.get(route, { params, }) as { data: Protocol.IResCalendar };
      let workDayList = data.info.map(n => n.workDay);
      ret.push({ title: '获取某}月日历', expect: workDayList, calc: [10, 11,] });

    }

    {
      let params = { doctorId, year: 2018, month: 2 };
      let { data, } = await axi.get(route, { params, }) as { data: Protocol.IResCalendar };
      let workDayList = data.info.map(n => n.workDay);
      ret.push({ title: '获取某}月日历', expect: workDayList, calc: [12,] });

    }

    await clearCalendar();

    return ret;
  };
};
export default fn;