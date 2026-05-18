import { post } from '../client';
import { unwrap } from '../../http/responseInterceptor';

export const broadcastNotification = (data) => unwrap(post('notifications/broadcast', data));