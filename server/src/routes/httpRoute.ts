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
    if (/\/bind$|\/getOpenId|\/auth\/|\/admin\/(?!login)/.test(req.path)) {
      let token: string = req.headers['token'] as string;
      let openId: string = req.headers['openId'] = TokenMgr.getIns().get(token);

      if (!TokenMgr.getIns().check(token)) {
        res.json({ code: config.commonErrCode.tokenInvalid, });
        return;
      }

    }
    next();
  });


  // 检测/auth/路由下的访问权限
  // 检查有没有合法的token
  // 错误码 100
  app.use(async (req, res, next) => {
    


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