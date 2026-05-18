import { get, post } from '../client';
import { unwrap } from '../../http/responseInterceptor';

export const getReports = () => unwrap(get('reports'));
export const resolveReport = (id, data) => unwrap(post(`reports/${id}/resolve`, data));