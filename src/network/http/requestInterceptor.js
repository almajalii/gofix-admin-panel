import { getToken } from './tokenHelper';
import { ContentType } from '../config/apiConstants';
//adds headers, attaches token if auth is present. 
export const buildHeaders = (auth = true, contentType = ContentType.JSON) => {
  const headers = {}; //start with an empty headers object

  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  if (auth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};