const BASE_URL = '';
export const api = {
  login: () => `${BASE_URL}/getToken`,
  bind: () => `${BASE_URL}/bind`
}