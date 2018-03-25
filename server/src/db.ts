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

import * as mongodb from 'mongodb';
import config from './config';
import * as Schema from './schema';

enum eStatus {
  open, close,
};

export default class Database {
  private connectStr: string;
  private db: mongodb.Db;

  //
  private doctorCollection: mongodb.Collection<Schema.IDoctor>;
  private patientCollection: mongodb.Collection<Schema.IPatient>;
  private worktimeCollection: mongodb.Collection<Schema.IWorktime>;
  private orderCollection: mongodb.Collection<Schema.IOrder>;
  private status: eStatus;


  // 返回一个连接实例
  private static ins: Database;
  static async getIns(): Promise<Database> {
    if (!Database.ins) {
      Database.ins = new Database();
    }

    let ins: Database = Database.ins;
    if (ins.status == eStatus.close) {
      await ins.open();

    }

    return Database.ins;
  }

  private constructor() {
    this.connectStr = config.connectStr;
    this.status = eStatus.close;
  }

  async open() {
    this.db = (await mongodb.MongoClient.connect(this.connectStr));
    this.status = eStatus.open;
    // console.log({db:!!this.db});

    let currDb = this.db.db('doctor');
    //
    this.doctorCollection = currDb.collection('doctor');
    this.worktimeCollection = currDb.collection('worktime');
    this.patientCollection = currDb.collection('patient');
    this.orderCollection = currDb.collection('order');

  }

  async close() {
    await this.db.close();
    this.status = eStatus.close;
  }


  // ============ 查询 ============


  // *** common ***
  async insertDoctor({ hospital, office, name, regCode, }: { hospital: string, office: string, name: string, regCode: string, }): Promise<{ flag: boolean, }> {
    let flag = true;
    let { insertedCount } = await this.doctorCollection.insertOne({ hospital, office, name, regCode, });
    flag = insertedCount == 1;
    return { flag, };
  }

  async removeDoctor({ doctorId, }: { doctorId: string, }): Promise<{ flag: boolean, }> {
    let flag = true;
    let { ok, } = await this.doctorCollection.findOneAndDelete({ id: new mongodb.ObjectId(doctorId), });
    flag = ok === 1;
    return { flag, };
  }

  // 绑定医生
  async bindDoctor({ openId, regCode, }: { openId: string, regCode: string, }): Promise<{ flag: boolean, }> {
    let flag = true;
    let { ok, } = await this.doctorCollection.findOneAndUpdate({ code: regCode, }, { $set: { openId, } });
    flag = ok === 1;
    return { flag, };
  }

  // 绑定患者
  async insertPatient({ openId, name, }: { openId: string, name: string, }): Promise<{ flag: boolean, }> {
    let flag = true;
    let { insertedCount } = await this.patientCollection.insertOne({ name, });
    flag = insertedCount == 1;
    return { flag, };
  }

  async removePatient({ doctorId, }: { doctorId: string, }): Promise<{ flag: boolean, }> {
    let flag = true;
    let { ok, } = await this.patientCollection.findOneAndDelete({ id: new mongodb.ObjectId(doctorId), });
    flag = ok === 1;
    return { flag, };
  }


  // 获取某个医生
  async queryDoctor({ doctorId, }: { doctorId: string, }): Promise<Schema.IDoctor> {
    return this.doctorCollection.findOne({ _id: new mongodb.ObjectId(doctorId), });
  }

  // 获取医生信息列表
  async queryDoctorList(): Promise<Schema.IDoctor[]> {
    return this.doctorCollection.find().toArray();
  }

  // 获取医生某月的日历
  async queryCalendar({ doctorId, year, month, }: { doctorId: string, year: number, month: number, }): Promise<Schema.IWorktime[]> {
    return this.worktimeCollection.find({ year, month, doctorId, }).toArray();
  }

  // 清除日历
  async clearCalendar(): Promise<void> {
    await this.worktimeCollection.remove({});
  }

  // *** docotr ***
  // 设定日历
  async insertCalendar({ doctorId, year, month, day, type, start, end, }: { doctorId: string, year: number, month: number, day: number, type: number, start: { hour: number, minute: number, }, end: { hour: number, minute: number, }, }): Promise<{ flag: boolean, }> {
    await this.worktimeCollection.remove({ doctorId, year, month, day, type, });
    let { insertedCount, } = await this.worktimeCollection.insertOne({ doctorId, year, month, day, type, start, end, });
    let flag: boolean = insertedCount == 1;
    return { flag, };
  }

  // 查看医生某天的工作信息
  async queryWorkDay({ doctorId, year, month, day, }: { doctorId: string, year: number, month: number, day: number, }): Promise<Schema.IWorktime[]> {
    return this.worktimeCollection.find({ doctorId, year, month, day, }).toArray();
  }

  // 查看预约列表
  async queryPatientList({ doctorId, year, month, day, }: { doctorId: string, year: number, month: number, day: number, }): Promise<Schema.IOrder[]> {
    return this.orderCollection.find({ doctorId, year, month, day, }).toArray();
  };

  // *** order ***
  // 查看预约
  async queryOrder({ doctorId, patientId, year, month, day, type, }: { doctorId: string, patientId: string, year: number, month: number, day: number, type: number, }): Promise<Schema.IOrder> {
    return this.orderCollection.findOne({ doctorId, patientId, year, month, day, type, });
  }
  async queryOrderById({ orderId, }: { orderId: string, }): Promise<Schema.IOrder> {
    return this.orderCollection.findOne({ _id: new mongodb.ObjectId(orderId) });
  }

  // 预约
  async insertOrder({ doctorId, patientId, year, month, day, type, }: { doctorId: string, patientId: string, year: number, month: number, day: number, type: number, }): Promise<{ flag: boolean }> {
    let flag: boolean = true;
    let { insertedCount, } = await this.orderCollection.insertOne({ doctorId, patientId, year, month, day, type, });
    flag = insertedCount == 1;
    return { flag, };
  }

  // 取消预约
  async removeOrder({ orderId, }: { orderId: string, }): Promise<{ flag: boolean, }> {
    let flag: boolean = true;
    let { ok, } = await this.orderCollection.findOneAndDelete({ _id: new mongodb.ObjectId(orderId) });
    flag = ok === 1;
    return { flag, };
  }

  // 查看自己的所有预约
  async queryOrderList({ patientId, type, }: { patientId: string, type: number, }): Promise<Schema.IOrder[]> {
    return this.orderCollection.find({ patientId, type, }).toArray();
  }

  // *** patient ***
  async queryPatient({ patientId, }: { patientId: string, }): Promise<Schema.IPatient> {
    return this.patientCollection.findOne({ patientId, });
  }




}