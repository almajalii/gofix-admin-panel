// reads from local storage and returns the token if it exists, otherwise returns null
export const getToken = () => localStorage.getItem('authToken');
// sets the token in local storage, if token is null or undefined, it removes the token from local storage
export const setToken = (token) => {
    if (token) localStorage.setItem('authToken', token);
    else localStorage.removeItem('authToken');
};