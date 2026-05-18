import { toast } from 'react-toastify';
import { setToken } from './tokenHelper';
import { parseApiError } from '../utils/errorUtils';
//checks for errors, shows toast, throws error. Also unwraps json response.
//takes the result of fetch which is a promise
export const handleResponse = async (responsePromise) => {
  // Wait for the response to resolve
  const response = await responsePromise;
  // 1 unauthorized, token is invalid, log out
  if (response.status === 401) setToken(null);
  // 2 response is not ok, show error toast and throw error
  if (!response.ok) {
    let errBody;
    try {
      errBody = await response.json();
    } catch {
      errBody = {};
    }
    const msg = parseApiError(errBody) || `HTTP ${response.status}`;
    toast.error(msg);
    throw new Error(msg);
  }
  // 3 response is ok, try to parse json, if fails return null
  try {
    return await response.json();
  } catch {
    return null;
  }
};

// Unwrap the standard { data: ... } envelope
export const unwrap = (promise) => promise.then((r) => r?.data ?? r);