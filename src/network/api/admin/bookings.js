import { get, post } from '../client';
import { unwrap } from '../../http/responseInterceptor';

export const getBookings = (status) => unwrap(get(`bookings${status ? `?status=${status}` : ''}`));
export const getBookingDetail = (id) => unwrap(get(`bookings/${id}`));
export const cancelBooking = (id, reason) => unwrap(post(`bookings/${id}/cancel`, { reason }));