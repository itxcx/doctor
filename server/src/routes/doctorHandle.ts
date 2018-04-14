import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';
import Database from '../db';
import utils from '../utils';

export default function handle(app: express.Express) {
  // 取消工作时间
  app.post('/doctor/unset/worktime', async (req, res) => {
    let resData: Protocol.IResUnsetWorktime;
    let db = await Database.getIns();
    let doctorId: string = req.headers['doctorId'] as string;
    let { year, month, day, type, } = req.body as Protocol.IReqUnsetWorktime;
    {

      let flag = utils.checkDate(year, month, day);
      if (!flag) {
        resData = { code: 0, errMsg: '非法的日期设定', };
        res.json(resData);
        return;
      }

    }

    {
      let flag = [0, 1].indexOf(type) >= 0;
      if (!flag) {
        resData = { code: 1, errMsg: '非法的上下午设定', };
        res.json(resData);
        return;
      }
    }



    {
      {
        // 取今天零点
        if (utils.isPastTime(year, month, day)) {
          resData = { code: 3, errMsg: '过去的日子无法设定', };
          res.json(resData);
          return;
        }
      }
    }

    let { flag, } = await db.removeCalendar({ doctorId, year, month, day, type, });

    res.json({});

  });

  // 设置工作时间
  app.post('/doctor/set/worktime', async (req, res) => {
    let resData: Protocol.IResSetWorktime;
    let db = await Database.getIns();
    let doctorId: string = req.headers['doctorId'] as string;
    let { time, type, start, end, } = req.body as Protocol.IReqSetWorktime;

    let year: number;
    let month: number;
    let day: number;
    if (time) {
      year = time.year;
      month = time.month;
      day = time.day;
      let flag = utils.checkDate(year, month, day);
      if (!flag) {
        resData = { code: 0, errMsg: '非法的日期设定', };
        res.json(resData);
        return;
      }

    }

    {
      let flag = [0, 1].indexOf(type) >= 0;
      if (!flag) {
        resData = { code: 1, errMsg: '非法的上下午设定', };
        res.json(resData);
        return;
      }
    }

    {
      // 分钟在0或者30
      // 上午时钟在0-12
      // 下午时钟在12-24
      // 上午时间在00:00 - 12:00
      // 下午时间在12:00 - 24:00
      type timeType = { hour: number, minute: number, };
      let calc = (val: timeType): number => val.hour * 100 + val.minute;
      let check = (start: timeType, end: timeType, min: timeType, max: timeType): boolean => {
        let startValue = calc(start);
        let endValue = calc(end);
        let minValue = calc(min);
        let maxValue = calc(max);
        return minValue <= startValue &&
          startValue < endValue &&
          endValue <= maxValue;

      };
      let flag = [start.minute, end.minute].every(n => n >= 0 && n <= 59) &&
        (type == 0 ? [start.hour, end.hour].every(n => n >= 0 && n <= 12) : true) &&
        (type == 1 ? [start.hour, end.hour].every(n => n >= 12 && n <= 24) : true) &&
        (type == 0 ? check(start, end, { hour: 0, minute: 0 }, { hour: 12, minute: 0 }, ) : true) &&
        (type == 1 ? check(start, end, { hour: 12, minute: 0 }, { hour: 24, minute: 0 }, ) : true)
        ;
      if (!flag) {
        resData = { code: 2, errMsg: '非法的工作时间区间设定' };
        res.json(resData);
        return;
      }
    }

    {
      if (time) {
        // 取今天零点
        if (utils.isPastTime(time.year, time.month, time.day)) {
          resData = { code: 3, errMsg: '过去的日子无法设定', };
          res.json(resData);
          return;
        }
      }
    }

    console.log({ doctorId, year, month, day, type, start, end, });
    let { flag, } = await db.insertCalendar({ doctorId, year, month, day, type, start, end, });

    res.json({});
  });

  // 获取病人列表
  app.get('/doctor/list', async (req, res) => {
    let resData: Protocol.IResPatientList;
    let doctorId: string = req.headers['doctorId'] as string;

    let year = req.query['year'] - 0;
    let month = req.query['month'] - 0;
    let day = req.query['day'] - 0;

    let db = await Database.getIns();
    let list: any[] = await db.queryPatientList({ doctorId, year, month, day, });
    for (let i = 0; i < list.length; i++) {
      let li = list[i];
      let patient = await db.queryPatient({ patientId: li.patientId, });
      li.name = patient.name;
    }


    let list0 = list.filter(n => n.type == 0).map(n => ({ name: n.name }));
    let list1 = list.filter(n => n.type == 1).map(n => ({ name: n.name }));
    resData = { list: [list0, list1,] };
    res.json(resData);

  });
};