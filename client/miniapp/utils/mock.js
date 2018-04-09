import {api} from './api/index.js';
import {dict} from './dict.js';
export const mock = {
  test(){
    this.request = (options)=>{
      let {data,url,success,header} = options;
        success(dict[url](data,header));
    }
  },
  request(options){
    wx.request(options)
  }
}