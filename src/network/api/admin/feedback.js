import { get } from '../client';
import { unwrap } from '../../http/responseInterceptor';

export const getFeedback = () => unwrap(get('feedback'));