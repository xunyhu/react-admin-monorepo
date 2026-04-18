export const success = <T>(data: T, message = 'success') => {
  return {
    code: 0,
    message,
    data,
  };
};

export const fail = (message = 'error', code = 1) => {
  return {
    code,
    message,
    data: null,
  };
};
