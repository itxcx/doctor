import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';
import Database from '../db';
import utils from '../utils';

export default function handle(app: express.Express) {
  // 预约
  app.post('/patient/order', async (req, res) => {
    let resData: Protocol.IResOrder;
    // 医生编号,唯一
    let { id, year, month, day, type, userCode, } = req.body as Protocol.IReqOrder;
    let db = await Database.getIns();

    let doctorId: string = id;
    let patientId: string = req.headers['patientId'] as string;

    // 0 非法的日期信息
    {
      let flag = utils.checkDate(year, month, day);
      if (!flag) {
        resData = { code: 0, errMsg: '非法的日期信息', };
        res.json(resData);
        return;
      }
    }

    // 1 重复预约申请
    {
      let order = await db.queryOrder({ doctorId, patientId, year, month, day, type, });
      if (!!order) {
        resData = { code: 1, errMsg: '重复预约申请', };
        res.json(resData);
        return;
      }
    }

    // 2 不存在的医生编号
    {
      let doctor = await db.queryDoctor({ doctorId: id, });
      if (!doctor) {
        resData = { code: 2, errMsg: '不存在的医生编号' };
        res.json(resData);
        return;
      }
    }

    let { flag, } = await db.insertOrder({ doctorId, patientId, year, month, day, type, });
    resData = {};
    res.json(resData);
  });


  // 取消预约
  app.post('/patient/order/cancel', async (req, res) => {
    let resData: Protocol.IResOrderCancel;
    let { id, } = req.body as Protocol.IReqOrderCancel;
    let db = await Database.getIns();

    let orderId: string = id;

    // let order = await db.queryOrderById({ orderId, });
    let { flag, } = await db.removeOrder({ orderId, });
    if (!flag) {
      resData = { code: 0, errMsg: '不存在该预约编号', };
      res.json(resData);
      return;
    }

    resData = {};
    res.json(resData);


  });

  // 

  // 获取病人的预约列表
  app.get('/patient/list', async (req, res) => {
    let resData: Protocol.IResOrderList;
    let type: number = req.query['type'] - 0;
    let patientId: string = req.headers['patientId'] as string;

    {
      if ([0, 1].indexOf(type) < 0) {
        resData = { code: 0, errMsg: '非法的预约查询类型', };
        res.json(resData);
        return;
      }
    }

    let db = await Database.getIns();

    let list: any[] = (await db.queryOrderList({ patientId, type, }));
    for (let i = 0; i < list.length; i++) {
      let li = list[i];
      li.id = li._id;
      delete li._id;

      let doctor = await db.queryDoctor({ doctorId: li.doctorId, });
      li.hospital = doctor.hospital;
      li.office = doctor.office;
      li.name = doctor.name;
    }

    resData = { list, };
    res.json(resData);

  });
};