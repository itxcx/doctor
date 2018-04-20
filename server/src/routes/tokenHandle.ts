import * as express from 'express';
import * as Protocol from '../protocol';
import config from '../config';
import TokenMgr from '../tokenMgr';
import axios from 'axios';
import * as Chance from 'chance';
import wx from '../wx';



let chance = new Chance();
export default function handle(app: express.Express) {
  app.get('/getToken', async (req, res) => {
    let resData: Protocol.IResToken;
    let code: number = undefined;
    let cliCode = (req.query as Protocol.IReqToken).code;


    let openId = config.isMockOpenId ?
      cliCode + chance.string({ length: 8 }) :
      await wx.getOpenId(cliCode);

    console.log(openId, config.isMockOpenId, config.mockOpenId);

    // 获取openId失败
    if (!openId) {
      code = 0;
      resData = { code, };
      res.json(resData);
      return;
    }


    let token = TokenMgr.getIns().bind(openId);
    resData = { code, token, };
    res.json(resData);

  });

  app.get('/getOpenId', async (req, res) => {
    let resData: Protocol.IResOpenId;
    let openId: string = req.headers['openId'] as string;

    resData = { openId, };
    res.json(resData);

  });
}










