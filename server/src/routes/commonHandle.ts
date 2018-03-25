import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';
import Database from '../db';


export default function handle(app: express.Express) {
  // 获取医生列表
  app.get('/common/doctorList', async (req, res) => {
    let resData: Protocol.IResDoctorList;
    let db = await Database.getIns();
    let list = (await db.queryDoctorList()).map(n => {
      return {
        id: n._id,
        hospital: n.hospital,
        office: n.office,
        name: n.name,
      };
    });
    resData = { list, };
    res.json(resData);
  });

  // 获取某月日历信息
  app.get('/common/calendar', async (req, res) => {
    let resData: Protocol.IResCalendar;
    // let { doctorId, year, month, } = req.query as Protocol.IReqCalendar;
    let doctorId = req.query['doctorId'];
    let year = req.query['year'] - 0;
    let month = req.query['month'] - 0;
    let db = await Database.getIns();
    let list = await db.queryCalendar({ doctorId, year, month, });

    let info: { workDay: number }[] = [];

    list.forEach(n => {
      let { day, } = n;
      if (!info.some(n => n.workDay == day)) {
        info.push({ workDay: day, });
      }
    });

    resData = { info, };
    res.json(resData);
  });



  // 查看某日工作时间细节
  app.get('/common/workDay', async (req, res) => {
    let resData: Protocol.IResWorkDay;

    let doctorId = req.query['doctorId'];
    let year = req.query['year'] - 0;
    let month = req.query['month'] - 0;
    let day = req.query['day'] - 0;

    let db = await Database.getIns();
    let list = await db.queryWorkDay({ doctorId, year, month, day, });

    let intervalList = list.map(n => {
      let interval: { hour: number, minute: number, }[] = [n.start, n.end];
      return { type: n.type, interval, };
    });

    resData = { intervalList, };

    res.json(resData);
  });


  // 绑定医生信息
  app.post('/bind', async (req, res) => {
    let resData: Protocol.IResBind;
    let { regCode, } = req.body as Protocol.IReqBind;
    let openId: string = req.headers['openId'] as string;

    let db = await Database.getIns();
    let { flag, } = await db.bindDoctor({ openId, regCode, });

    if (!flag) {
      resData = { code: 0, errMsg: '不存在该医生信息', };
      res.json(resData);
      return;
    }

    res.json(resData);
  });


  // 绑定病人信息
  app.post('/bindPatient', async (req, res) => {
    let resData: Protocol.IResBindPatient;
    let { name, } = req.body as Protocol.IReqBindPatient;
    let openId: string = req.headers['openId'] as string;

    let db = await Database.getIns();

    let { flag, } = await db.insertPatient({ openId, name, });

    if (!flag) {
      resData = { code: 0, errMsg: '数据库失误', };
      res.json(resData);
      return;
    }
    
    resData = {};
    res.json(resData);

  });




};