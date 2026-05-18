import { get } from '../client';
import { unwrap } from '../../http/responseInterceptor';

export const getReports = () => unwrap(get('reports'));