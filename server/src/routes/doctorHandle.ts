// import * as express from 'express';
// import * as Protocol from '../protocol';
// import config from '../config';
// import Database from '../db';


// // 设置工作时间
// // '/doctor/set/workTime'

// export default function handle(app: express.Express) {
//   // 获取医生列表
//   app.get('/common/doctorList', async (req, res) => {
//     let resData: Protocol.IResDoctorList;
//     let db = await Database.getIns();
//     let list = (await db.queryDoctorList()).map(n => {
//       return {
//         id: n._id,
//         hospital: n.hospital,
//         office: n.office,
//         name: n.name,
//       };
//     });
//     resData = { list, };
//     res.json(resData);
//   });

//   // 获取某月日历信息
//   app.get('/common/calendar', async (req, res) => {
//     let resData: Protocol.IResCalendar;
//     let { doctorId, year, month, } = req.query as Protocol.IReqCalendar;
//     let db = await Database.getIns();
//     let list = await db.queryCalendar({ doctorId, year, month, });
//     let info: { workDay: number }[] = [];

//     list.forEach(n => {
//       let { day, } = n;
//       if (!info.some(n => n.workDay == day)) {
//         info.push({ workDay: day, });
//       }
//     });

//     resData = { info, };
//     res.json(resData);
//   });
// };