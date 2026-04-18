import request from '@/utils/request';

export function getMenus() {
  return request.get('/menus');
}

export function createMenu(data: any) {
  return request.post('/menus', data);
}

export function updateMenu(id: number, data: any) {
  return request.put(`/menus/${id}`, data);
}

export function deleteMenu(id: number) {
  return request.delete(`/menus/${id}`);
}
