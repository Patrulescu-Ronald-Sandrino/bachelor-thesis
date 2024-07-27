import axios, { AxiosError, AxiosResponse } from 'axios';
import { store } from '../store/configureStore.ts';
import { toast } from 'react-toastify';
import { router } from '../router/Routes.tsx';
import { User } from '../models/user.ts';
import {
  Attraction,
  AttractionAddOrEditDto,
  AttractionFormData,
} from '../models/attraction.ts';
import { PageResponse } from '../models/pagination.ts';
import { AttractionType } from '../models/attractionType.ts';

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

function createFormData(
  data: object,
  formData = new FormData(),
  parentKey?: string,
) {
  for (const key in data) {
    const formKey = parentKey ? `${parentKey}.${key}` : key;
    const value: unknown = data[key as keyof object];
    // console.log(formKey, typeof value, value);

    if (value === null || value === undefined) {
      formData.append(formKey, '');
    } else if (value instanceof Blob) {
      formData.append(formKey, value);
    } else if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        createFormData(value[i], formData, `${formKey}[${i}]`);
      }
    } else if (typeof value === 'object') {
      createFormData(value, formData, formKey);
    } else {
      formData.append(formKey, value.toString());
    }
  }
  // console.log('finished creating form data');
  // if (!parentKey) {
  //   for (const pair of formData.entries()) {
  //     console.log(pair[0] + ', ' + pair[1]);
  //   }
  // }
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
    const { data, status } = error.response as AxiosResponse;
    switch (status) {
      case 422:
      case 400:
        if (data.errors) {
          throw data.errors;
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
        void router.navigate('/server-error', { state: { error: data } });
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
  add: (data: AttractionAddOrEditDto) =>
    requests.post<AttractionFormData>('attractions', createFormData(data)),
  update: (data: AttractionAddOrEditDto) =>
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
