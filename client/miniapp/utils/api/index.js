const BASE_URL = '';
export const api = {
  login: () => `${BASE_URL}/getToken`,
  bind: () => `${BASE_URL}/bind`,
  workData: () => `${BASE_URL}/common/workDay`,
  doctorList: () => `${BASE_URL}/common/doctorList`
}