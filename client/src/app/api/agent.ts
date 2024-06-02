import axios, { AxiosResponse } from 'axios';

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500));

axios.defaults.baseURL = 'http://localhost:7000/api/';

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(async (response) => {
  if (import.meta.env.DEV) await sleep();

  return response;
});

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
};

const Attractions = {
  list: () => requests.get('attractions'),
};

const agent = {
  Attractions,
};

export default agent;
