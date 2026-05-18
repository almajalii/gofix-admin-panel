import { get, post, del } from '../client';
import { unwrap } from '../../http/responseInterceptor';

export const getUsers = (role) => unwrap(get(`users${role ? `?role=${role}` : ''}`));
export const banUser = (id) => unwrap(del(`users/${id}`));
export const unbanUser = (id) => unwrap(post(`users/${id}/unban`, {}));
