import { buildHeaders } from '../http/requestInterceptor';
import { handleResponse } from '../http/responseInterceptor';
import { API_BASE_URL } from '../config/apiConfig';

const BASE = `${API_BASE_URL}/admin`;

export const get = (path) =>
  handleResponse(
    fetch(`${BASE}/${path}`, {
      method: 'GET',
      headers: buildHeaders(true),
    })
  );

export const post = (path, body) =>
  handleResponse(
    fetch(`${BASE}/${path}`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: body ? JSON.stringify(body) : undefined,
    })
  );

export const put = (path, body) =>
  handleResponse(
    fetch(`${BASE}/${path}`, {
      method: 'PUT',
      headers: buildHeaders(true),
      body: body ? JSON.stringify(body) : undefined,
    })
  );

export const del = (path) =>
  handleResponse(
    fetch(`${BASE}/${path}`, {
      method: 'DELETE',
      headers: buildHeaders(true),
    })
  );
