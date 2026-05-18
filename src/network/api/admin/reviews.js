import { get, del } from '../client';
import { unwrap } from '../../http/responseInterceptor';

export const getReviews = () => unwrap(get('reviews'));
export const deleteReview = (id) => unwrap(del(`reviews/${id}`));