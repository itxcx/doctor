/*
    *********************************************  
                       _ooOoo_  
                      o8888888o  
                      88" . "88  
                      (| -_- |)  
                      O\  =  /O  
                   ____/`---'\____  
                 .'  \|     |//  `.  
                /  \|||  :  |||//  \  
               /  _||||| -:- |||||-  \  
               |   | \\  -  /// |   |  
               | \_|  ''\---/''  |   |  
               \  .-\__  `-`  ___/-. /  
             ___`. .'  /--.--\  `. . __  
          ."" '<  `.___\_<|>_/___.'  >'"".  
         | | :  `- \`.;`\ _ /`;.`/ - ` : | |  
         \  \ `-.   \_ __\ /__ _/   .-` /  /  
    ======`-.____`-.___\_____/___.-`____.-'======  
                       `=---='  
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  
               佛祖保佑       永无BUG  
*/

import config from './config';
import Database from './db';

// *** 存放一些通用方法 ***


// 检测是否合法日期
let checkDate = (year: number, month: number, day: number, ): boolean => {
  return (/^\d{4}$/.test(year + '')) &&
    (/^(1-9|1[0-2])$/.test(month + '')) &&
    (/^\d{1,2}$/.test(day + '')) &&
    (new Date(year, month - 1, day)).getMonth() + 1 == month &&
    (new Date(year, month - 1, day)).getDate() == day
    ;

};

let utils = {
  checkDate,
};



export default utils;
