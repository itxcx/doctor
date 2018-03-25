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

  // 绑定医生
  {

  }

  // 绑定患者

  // 医生列表
  {
    let route = apiPrefix + 'common/doctorList';
    let { data, } = await axi.get(route) as { data: Protocol.IResDoctorList };
    ret.push({ title: '获取医生列表', expect: [, true], calc: [data.code, data.list.length != 0], });
  }



  // 获取医生的日历
  {
    await clearCalendar();
    let db = await Database.getIns();

    let doctorId: string = 'a12345678';
    let otherDoctorId: string = 'b12345678';
    await db.insertCalendar({ doctorId: otherDoctorId, year: 2018, month: 1, day: 9, type: 0, start: { hour: 9, minute: 0, }, end: { hour: 11, minute: 0, }, });
    await db.insertCalendar({ doctorId, year: 2018, month: 1, day: 10, type: 0, start: { hour: 9, minute: 0, }, end: { hour: 11, minute: 0, }, });
    await db.insertCalendar({ doctorId, year: 2018, month: 1, day: 10, type: 1, start: { hour: 12, minute: 0, }, end: { hour: 16, minute: 30, } });
    await db.insertCalendar({ doctorId, year: 2018, month: 1, day: 11, type: 0, start: { hour: 7, minute: 0, }, end: { hour: 11, minute: 30, } });
    await db.insertCalendar({ doctorId, year: 2018, month: 2, day: 12, type: 0, start: { hour: 7, minute: 0, }, end: { hour: 11, minute: 30, } });

    let route = apiPrefix + 'common/calendar';

    {
      let params = { doctorId, year: 2018, month: 1 };
      let { data, } = await axi.get(route, { params, }) as { data: Protocol.IResCalendar };
      let workDayList = data.info.map(n => n.workDay);
      ret.push({ title: '获取某月日历', expect: [10, 11,], calc: workDayList, });

    }

    {
      let params = { doctorId, year: 2018, month: 2 };
      let { data, } = await axi.get(route, { params, }) as { data: Protocol.IResCalendar };
      let workDayList = data.info.map(n => n.workDay);
      ret.push({ title: '获取某月日历', expect: [12,], calc: workDayList, });

    }

    await clearCalendar();

  };

  // 获取医生某天的工作时间
  {
    await clearCalendar();
    let db = await Database.getIns();

    let doctorId: string = 'a12345678';
    let otherDoctorId: string = 'b12345678';
    await db.insertCalendar({ doctorId: otherDoctorId, year: 2018, month: 1, day: 9, type: 0, start: { hour: 9, minute: 0, }, end: { hour: 11, minute: 0, }, });
    await db.insertCalendar({ doctorId, year: 2018, month: 1, day: 10, type: 0, start: { hour: 9, minute: 0, }, end: { hour: 11, minute: 0, }, });
    await db.insertCalendar({ doctorId, year: 2018, month: 1, day: 10, type: 1, start: { hour: 12, minute: 0, }, end: { hour: 16, minute: 30, } });
    await db.insertCalendar({ doctorId, year: 2018, month: 1, day: 11, type: 0, start: { hour: 7, minute: 0, }, end: { hour: 11, minute: 30, } });
    await db.insertCalendar({ doctorId, year: 2018, month: 2, day: 12, type: 0, start: { hour: 7, minute: 0, }, end: { hour: 11, minute: 30, } });

    let route = apiPrefix + 'common/workDay';
    {
      let params: Protocol.IReqWorkDay = { doctorId, year: 2018, month: 1, day: 10, };
      let { data, } = await axi.get(route, { params, }) as { data: Protocol.IResWorkDay };
      let interval: string[] = data.intervalList.reduce((curr, n) => {
        let time2str = (n: { hour: number, minute: number, }) => n.hour + ':' + n.minute;
        curr[n.type] = [n.type, time2str(n.interval[0]), time2str(n.interval[1]),].join('-');
        return curr;
      }, []);
      ret.push({ title: '获取医生某天的工作时间', expect: ['0-9:0-11:0', '1-12:0-16:30'], calc: interval, });
    }

    {
      let params: Protocol.IReqWorkDay = { doctorId, year: 2018, month: 2, day: 12, };
      let { data, } = await axi.get(route, { params, }) as { data: Protocol.IResWorkDay };
      let interval: string[] = data.intervalList.reduce((curr, n) => {
        let time2str = (n: { hour: number, minute: number, }) => n.hour + ':' + n.minute;
        curr[n.type] = [n.type, time2str(n.interval[0]), time2str(n.interval[1]),].join('-');
        return curr;
      }, []);
      ret.push({ title: '获取医生某天的工作时间', expect: ['0-7:0-11:30'], calc: interval, });
    }



    await clearCalendar();

  }

  return ret;
};
export default fn;