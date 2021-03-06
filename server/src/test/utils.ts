import * as axiosNs from 'axios';
import config from '../config';
import * as qs from 'querystring';
import * as Protocol from '../protocol';
import Database from '../db';
import * as Chance from 'chance';

let { apiPrefix, } = config;

export async function getAxios(code?: string, ): Promise<axiosNs.AxiosInstance> {
  code = code || new Chance().string({ length: 8 });
  let axi = axiosNs.default.create();
  let token = await getToken(axi, code);
  axi.interceptors.request.use(cfg => {
    cfg.headers['token'] = token;
    return cfg;
  });
  axi.defaults.headers['token'] = token;
  return axi;
}


export async function getToken(axi: axiosNs.AxiosInstance, code: string): Promise<string> {
  let url = apiPrefix + 'getToken' + '?' + qs.stringify({ code, });
  let { data } = await axi.get(url) as { data: { code?: number, token?: string, } };
  return data.token;
};

export async function getOpenId(axi: axiosNs.AxiosInstance, ): Promise<string> {
  let url = apiPrefix + 'getOpenId';
  let { data } = await axi.get(url) as { data: { code?: number, openId?: string, } };
  return data.openId;
}

export async function clearAll():Promise<void>{
  let db = await Database.getIns();
  await db.remove('doctor', {});
  await db.remove('worktime', {});
  await db.remove('patient', {});
  await db.remove('order', {});
}


export function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}