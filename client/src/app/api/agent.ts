import axios, { AxiosError, AxiosResponse } from 'axios';
import { store } from '../store/configureStore.ts';
import { toast } from 'react-toastify';
import { router } from '../router/Routes.tsx';

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.defaults.baseURL = 'http://localhost:7000/api/';

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    if (import.meta.env.DEV) await sleep();

    return response;
  },
  (error: AxiosError) => {
    console.log(error);
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
      case 400:
        if (data.errors) {
          const modelStateErrors: string[] = [];
          for (const key in data.errors) {
            if (data.errors[key]) {
              modelStateErrors.push(data.errors[key]);
            }
          }
          throw modelStateErrors.flat();
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.title);
        break;
      case 403:
        toast.error('You are not allowed to do that!');
        break;
      case 500:
        router.navigate('/server-error', { state: { error: data } });
        break;
      default:
        break;
    }
    return Promise.reject(error.response);
  },
);

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: object) => axios.post(url, body).then(responseBody),
};

const Account = {
  login: (body: object) => requests.post('account/login', body),
  register: (values: object) => requests.post('account/register', values),
  currentUser: () => requests.get('account'),
};

const Attractions = {
  list: () => requests.get('attractions'),
  fetch: (id: string) => requests.get(`attractions/${id}`),
};

const agent = {
  Attractions,
  Account,
};

export default agent;
