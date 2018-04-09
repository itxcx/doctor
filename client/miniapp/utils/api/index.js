const BASE_URL = '';
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
  patientReg: () => `${BASE_URL}/patient/reg'`
}