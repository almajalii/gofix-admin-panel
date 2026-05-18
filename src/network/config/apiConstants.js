//fixed values for API calls
//Object.freeze: makes object immutable.
export const Role = Object.freeze({
    CUSTOMER: 'customer',
    PRO: 'pro'
});

export const HttpMethod = Object.freeze({
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
});

export const ContentType = Object.freeze({
    JSON: 'application/json',
});