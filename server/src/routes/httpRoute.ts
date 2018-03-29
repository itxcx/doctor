import * as express from 'express';

import config from '../config';
import loger from '../logIns';
import TokenMgr from '../tokenMgr';
import AdminMgr from '../adminMgr';
import Database from '../db';

// 路由
import testHandle from './testHandle';
import tokenHandle from './tokenHandle';
import commonHandle from './commonHandle';
import doctorHandle from './doctorHandle';
import orderHandle from './orderHandle';


const { rege } = config;

export default function handler(app: express.Express) {
  // bind需要token
  app.use(async (req, res, next) => {
    if (/\/info$|\/patientInfo$|\/bind$|\/bindPatient$|\/getOpenId|\/doctor\/|\/patient\/|\/auth\/|\/admin\/(?!login)/.test(req.path)) {
      let token: string = req.headers['token'] as string;
      let openId: string = req.headers['openId'] = TokenMgr.getIns().get(token);

      if (!TokenMgr.getIns().check(token)) {
        res.json({ code: config.commonErrCode.tokenInvalid, });
        return;
      }

    }
    next();
  });


  // 检测/doctor/路由下的访问权限
  // 错误码 100
  app.use(async (req, res, next) => {
    if (/doctor\//.test(req.path)) {
      let openId: string = req.headers['openId'] as string;
      console.log('doctor path :: openId ::', openId);

      let db = await Database.getIns();
      let list = await db.query('doctor', { openId, });
      if (list.length > 0) {
        req.headers['doctorId'] = list[0]._id.toString();
      } else {
        res.json({ code: 100, errMsg: '没有doctor的访问权限', });
        return;
      }
    }


    next();
  });

  // 检测/patient/路由下的访问权限
  // 错误码 200
  app.use(async (req, res, next) => {
    if (/patient\//.test(req.path)) {
      let openId: string = req.headers['openId'] as string;

      let db = await Database.getIns();
      let list = await db.query('patient', { openId, });
      if (list.length > 0) {
        req.headers['patientId'] = list[0]._id.toString();
      } else {
        console.error('通过openId找不到patient:',openId);
        res.json({ code: 200, errMsg: '没有patient的访问权限', });
        return;
      }
    }


    next();
  });



  // 错误码500
  app.use(async (req, res, next) => {
    let matchList = [
      /\/admin\/(?!login)/,
    ];

    if (matchList.some(n => n.test(req.path))) {
      let db = await Database.getIns();
      let token: string = req.headers['token'] as string;

      let userName: string = TokenMgr.getIns().get(token);


      if (!(userName && config.adminList.some(n => n.userName == userName))) {
        let code: number = config.commonErrCode.notAdmin;
        res.json({ code, });
        return;
      }
    }
    next();
  });

  // common
  commonHandle(app);

  // doctor
  doctorHandle(app);

  // patient
  orderHandle(app);


  // token
  tokenHandle(app);

  // 测试
  testHandle(app);



}