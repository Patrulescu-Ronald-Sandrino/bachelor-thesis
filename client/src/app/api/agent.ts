import axios, { AxiosError, AxiosResponse } from 'axios';
import { store } from '../store/configureStore.ts';
import { toast } from 'react-toastify';
import { router } from '../router/Routes.tsx';
import { User } from '../models/user.ts';
import { Attraction, AttractionFormData } from '../models/attraction.ts';
import { PageResponse } from '../models/pagination.ts';
import { AttractionType } from '../models/attractionType.ts';

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

function createFormData(item: object) {
  const formData = new FormData();
  for (const key in item) {
    formData.append(key, item[key as keyof object]);
  }
  return formData;
}

axios.defaults.baseURL = import.meta.env.VITE_APP_URL + 'api/';

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use((config) => {
  const token = store.getState().account.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    if (import.meta.env.DEV) await sleep();

    const pagination = response.headers['pagination'];
    if (pagination) {
      response.data = new PageResponse(response.data, JSON.parse(pagination));
    }

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
  get: <T>(url: string, params?: URLSearchParams) =>
    axios.get<T>(url, { params }).then(responseBody<T>),
  post: <T>(url: string, body: object) =>
    axios.post<T>(url, body).then(responseBody<T>),
  put: <T>(url: string, body: object) =>
    axios.put<T>(url, body).then(responseBody<T>),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody<T>),
};

const Account = {
  login: (body: object) => requests.post<User>('account/login', body),
  register: (values: object) => requests.post<User>('account/register', values),
  currentUser: () => requests.get<User>('account'),
};

const Attractions = {
  list: (params: URLSearchParams) =>
    requests.get<PageResponse<Attraction>>('attractions', params),
  fetch: (id: string) => requests.get<Attraction>(`attractions/${id}`),
  getFormData: (id?: string) =>
    requests.get<AttractionFormData>(`attractions/form-data/${id ?? ''}`),
  add: (data: object) =>
    requests.post<AttractionFormData>('attractions', createFormData(data)),
  update: (data: object) =>
    requests.put<AttractionFormData>('attractions', createFormData(data)),
  delete: (id: string) => requests.delete(`attractions/${id}`),
};

const AttractionTypes = {
  list: () => requests.get<AttractionType[]>('attractionTypes'),
};

const agent = {
  Account,
  Attractions,
  AttractionTypes,
};

export default agent;
