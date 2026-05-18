export const parseApiError = (errBody) => {
  if (!errBody) return 'Something went wrong';
  return (
    errBody.message ||
    errBody.error ||
    (Array.isArray(errBody.errors) ? errBody.errors[0] : null) ||
    'Something went wrong'
  );
};