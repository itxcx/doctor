// const BASE_URL = 'http://192.168.1.102:3000';
const BASE_URL = 'http://api.puman.xyz:3000';
export const api = {
  login: () => `${BASE_URL}/getToken`,
  bind: () => `${BASE_URL}/bind`,
  setWorkTime: () => `${BASE_URL}/doctor/set/worktime`,
  doctorList: () => `${BASE_URL}/doctor/list`,
  workData: () => `${BASE_URL}/common/workDay`,
  categoryList: () => `${BASE_URL}/common/doctorList`,
  calendar: () => `${BASE_URL}/common/calendar`,
  patientList:()=>`${BASE_URL}/patient/list`,
  patientOrder: () => `${BASE_URL}/patient/order`,
  patientReg: () => `${BASE_URL}/bindPatient`,
  cancel: () => `${BASE_URL}/patient/order/cancel`,
  unsetWorkTime:()=>`${BASE_URL}/doctor/unset/worktime`
}