export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 8;
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validateCsvHeaders = (headers, expectedHeaders) => {
  return expectedHeaders.every(header => 
    headers.includes(header) || headers.includes(header.toLowerCase())
  );
};