import { get, post, put, del } from '../client';
import { unwrap } from '../../http/responseInterceptor';

export const getCategories = () => unwrap(get('categories'));
export const createCategory = (data) => unwrap(post('categories', data));
export const updateCategory = (id, data) => unwrap(put(`categories/${id}`, data));
export const deleteCategory = (id) => unwrap(del(`categories/${id}`));