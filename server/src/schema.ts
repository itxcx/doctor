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


export interface IDoctor {
  _id?: string,
  hospital: string,
  office: string,
  name: string,
}

export interface IWorktime {
  doctorId: string,
  isCommon: number,
  year?: number,
  month?: number,
  day?: number,
  type: number,
  start: { hour: number, minute: number, },
  end: { hour: number, minute: number, },
}


export interface IWorkDay {
  list: { workDay: number, }[]
}


export interface IPatient {
 
  name: string,
}

export interface IOrder {
  _id: string,
  doctorId: string,
  patientId: string,

  year: number,
  month: number,
  day: number,
  type: number,
}

