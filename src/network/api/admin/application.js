import { get, post } from '../client';
import { unwrap } from '../../http/responseInterceptor';

export const getApplications = () => unwrap(get('professionals'));
export const getApplicationDetail = (id) => unwrap(get(`professionals/${id}`));
export const approveApplication = (id) => post(`professionals/${id}/approve`);
export const rejectApplication = (id, reason) => post(`professionals/${id}/reject`, { reason });