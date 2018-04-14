/*
    初始化数据库dota
    1 建立用户
    2 建立索引
    ** 因为有dropDatabase操作,所以要小心数据被清洗
*/

const mongodb = require('mongodb');

// let connectStr = 'mongodb://puman:puman@118.31.11.29:27017/doctor';
let connectStr = 'mongodb://118.31.11.29:27017/doctor';

let {
    MongoClient,
} = mongodb;

let databaseName = 'doctor';

let userInfoList = [{
    userName: 'tongjinle',
    password: 'tongjinle19840118',
}];

async function init() {
    let ins = await MongoClient.connect(connectStr);

    // await clear(ins);
    // await createUser(ins);
    await clearCollections(ins);
    await createIndex(ins);
    await initDoctorCode(ins);
    await ins.close();

}

async function clearCollections(ins) {
    let doctor = ins.db('doctor');
    let arr = ['doctor', 'patient', 'order', 'worktime'];
    await Promise.all(arr.map((n) => {
        return doctor.collection(n).remove({});
    }));
}

async function clear(ins) {
    let curr = ins.db(databaseName);
    await curr.dropDatabase();

    let admin = ins.db('admin');
    admin.collection('system.users').remove({
        db: databaseName
    });
}

// 建立用户
async function createUser(ins) {
    let admin = ins.db(databaseName);
    let fn = (userName, password, ) => {

        admin.addUser(userName, password, {
            roles: [{
                role: 'readWrite',
                db: databaseName,
            }]
        });
    }
    await Promise.all(userInfoList.map(n => {
        return fn(n.userName, n.password, );
    }));
}

// 初始化医院
async function initDoctorCode(ins) {
    let table = ins.db('doctor');
    let data = [{
            hospital: '湖州医院',
            office: '外科',
            name: '童扑满',
            code: 'a12345678',
        }, {
            hospital: '上海医院',
            office: '内科',
            name: '张晶杰',
            code: 'b12345678',
        }, {
            hospital: '杭州医院',
            office: '外科',
            name: '张建良',
            code: 'c12345678',
        }, {
            hospital: '杭州医院',
            office: '内科',
            name: '钱骏',
            code: 'd12345678',
        }, {
            hospital: '公立医院',
            office: '神经科',
            name: '吴俊',
            code: 'e12345678',
        },

    ];

    await Promise.all(data.map(n => {
        return table.collection('doctor').insert(n);
    }));
}

// 建立数据库索引
async function createIndex(ins) {
    let curr = ins.db(databaseName);
    await curr.collection('doctor').createIndex({
        openId: 1,
    });
    await curr.collection('order').createIndex({
        patientId: 1,
        doctorId: 1,
    });
    await curr.collection('worktime').createIndex({
        doctorId: 1,
        isCommon: 1,
    });
    await curr.collection('patient').createIndex({
        openId: 1,
    });

}

init();