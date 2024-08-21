import axios, { AxiosError, AxiosResponse } from 'axios';
import { store } from '../store/configureStore.ts';
import { toast } from 'react-toastify';
import { router } from '../router/Routes.tsx';
import { UserDto, UserProfile } from '../models/user.ts';
import {
  Attraction,
  AttractionAddOrEditDto,
  AttractionFormData,
  Reaction,
} from '../models/attraction.ts';
import { PageResponse } from '../models/pagination.ts';
import { AttractionType } from '../models/attractionType.ts';
import { AttractionCollection, Item } from '../models/attractionCollection.ts';

const HEADERS_CONTENT_TEXT = { headers: { 'Content-Type': 'text/plain' } };

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
    if (import.meta.env.DEV) {
      console.log('[agent.ts] response', response);
      await sleep();
    }

    const pagination = response.headers['pagination'];
    if (pagination) {
      response.data = new PageResponse(response.data, JSON.parse(pagination));
    }

    return response;
  },
  (error: AxiosError) => {
    if (import.meta.env.DEV) {
      console.log('[agent.ts] response error', error);
    }

    const { data, status } = error.response as AxiosResponse;
    switch (status) {
      case 422:
        toast.error(data.title);
        if (data.errors) throw data.errors;
        break;
      case 401:
        if (typeof data === 'string' && data.length > 0) {
          toast.error(data);
        }
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
    return Promise.reject(data.title);
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
  login: (body: object) => requests.post<UserDto>('account/login', body),
  register: (values: object) =>
    requests.post<string>('account/register', values),
  currentUser: () => requests.get<UserDto>('account'),
  verifyEmail: (email: string, token: string) =>
    requests.post<string>(
      `account/verify-email?email=${email}&token=${token}`,
      {},
    ),
  resendEmailVerification: (email: string) =>
    requests.get<string>(`account/resend-email-verification?email=${email}`),
  forgotPassword: (email: string) =>
    requests.post<string>(`account/forgot-password?email=${email}`, {}),
  resetPassword: (email: string, password: string, token: string) =>
    requests.post<string>(`account/reset-password`, { email, password, token }),
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
  react: (id: string, reaction: Reaction) =>
    requests.put(`attractions/${id}/react?reactionType=${reaction}`, {}),
  created: (username: string, page: number) =>
    requests.get<PageResponse<Attraction>>(
      `attractions/${username}?pageNumber=${page}`,
    ),
};

const AttractionTypes = {
  list: () => requests.get<AttractionType[]>('attractionTypes'),
};

const AttractionsCollections = {
  getAll: (username: string) =>
    requests.get<AttractionCollection[]>(`attractions/${username}/collections`),
  get: (username: string, id: string) =>
    requests.get<AttractionCollection>(
      `attractions/${username}/collections/${id}`,
    ),
  add: (username: string, data: AttractionCollection) =>
    requests.post<AttractionCollection>(
      `attractions/${username}/collections`,
      data,
    ),
  update: (username: string, data: AttractionCollection) =>
    requests.put<AttractionCollection>(
      `attractions/${username}/collections`,
      data,
    ),
  updateOrder: (username: string, ids: string[]) =>
    requests.put(`attractions/${username}/collections/order`, ids),
  updateCollectionThumbnail: (
    username: string,
    id: string,
    thumbnail: string,
  ) =>
    requests.put<AttractionCollection>(
      `attractions/${username}/collections/${id}/thumbnail?thumbnail=${thumbnail}`,
      {},
    ),
  delete: (username: string, id: string) =>
    requests.delete(`attractions/${username}/collections/${id}`),
  addItem: (
    username: string,
    id: string,
    attractionId: string,
    note?: string,
  ) =>
    requests.post<AttractionCollection>(
      `attractions/${username}/collections/${id}/items`,
      { attractionId, note } as Item,
    ),
  updateItemNote: (
    username: string,
    id: string,
    attractionId: string,
    note: string | null,
  ) =>
    axios
      .put<AttractionCollection>(
        `attractions/${username}/collections/${id}/items/${attractionId}/note`,
        note,
        HEADERS_CONTENT_TEXT,
      )
      .then(responseBody),
  updateItemsOrder: (username: string, collectionId: string, ids: string[]) =>
    requests.put(
      `attractions/${username}/collections/${collectionId}/items/order`,
      ids,
    ),
  deleteItem: (username: string, collectionId: string, attractionId: string) =>
    requests.delete<AttractionCollection>(
      `attractions/${username}/collections/${collectionId}/items/${attractionId}`,
    ),
};

const User = {
  profile: (username: string) => requests.get<UserProfile>(`users/${username}`),
  changePhoto: (photo: Blob) =>
    requests.post<string>('users/photo', createFormData({ photo })),
  deletePhoto: () => requests.delete('users/photo'),
  updateBio: (bio: string) => axios.put('users/bio', bio, HEADERS_CONTENT_TEXT),
};

const agent = {
  Account,
  Attractions,
  AttractionTypes,
  AttractionsCollections,
  User,
};

export default agent;
