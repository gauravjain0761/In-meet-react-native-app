import axios from 'axios';
import { get, set } from 'lodash';
import { logout } from '~/storage/userToken';
import { BASE_URL } from '../constants/config';

export const { CancelToken } = axios;
export const cancelTokenSource = CancelToken.source();

const HttpClient = axios.create({
  baseURL: BASE_URL,
});

HttpClient.interceptors.request.use(x => {
  // console.log('request: ', x.method, x.url, x.params, x.data);
  const requestObj = {
    time: new Date(),
    request: x.method?.toUpperCase(),
    url: x.url,
    data: JSON.stringify(x.data),
  };
  return x;
});

HttpClient.interceptors.response.use(
  x => {
    // console.log('response: ', x.data, x.status);

    return x;
  },
  error => {
    if (get(error, 'response.status', '') === 401) {
      logout();
    }
    return Promise.reject(get(error, 'response.data.message', ''));
  },
);

export default HttpClient;
