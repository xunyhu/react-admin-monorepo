import request from '@/utils/request';

export interface LoginParams {
  username: string;
  password: string;
}

export const loginApi = (data: LoginParams) => {
  return request.post('/login', data);
};
