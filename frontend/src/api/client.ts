import axios, { AxiosError, AxiosResponse } from 'axios';

import {
  errorResponseHandler,
  successResponseHandler,
} from '../lib/api/ResponseHandler';
import { ResponseError } from './types';

const MainAPIHost = 'http://localhost:8000';

const MainAPIClient = axios.create({
  baseURL: MainAPIHost,
});

MainAPIClient.interceptors.request.use((request) => request);

MainAPIClient.interceptors.response.use(
  (response: AxiosResponse) => {
    successResponseHandler(response);
    return Promise.resolve(response);
  },
  (error: AxiosError<ResponseError>) => {
    errorResponseHandler(error);
    return Promise.reject(error);
  },
);

export default MainAPIClient;
