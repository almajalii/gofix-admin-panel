import { get } from '../client';
import { unwrap } from '../../http/responseInterceptor';

export const getBookings = (status) => unwrap(get(`bookings${status ? `?status=${status}` : ''}`));
export const getBookingDetail = (id) => unwrap(get(`bookings/${id}`));