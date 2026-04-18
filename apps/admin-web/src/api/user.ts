import request from '@/utils/request';

export interface GetUserRes {
  list: any[];
  total: number;
}

export const getUsers = (params: any) =>
  request.get<GetUserRes>('/users', { params });

export const addUser = (data: any) => request.post('/users', data);

export const deleteUser = (id: number) => request.delete(`/users/${id}`);

export const updateUser = (data: any) => request.put(`/users/${data.id}`, data);
