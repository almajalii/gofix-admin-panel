import { get } from '../client';
import { unwrap } from '../../http/responseInterceptor';

export const getStats = () => unwrap(get('stats'));
export const getActivityFeed = () => unwrap(get('stats/activity'));