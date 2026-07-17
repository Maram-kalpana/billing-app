import API from './api';

export const registerUser = (user) => {
  return API.post('/auth/register', {
    full_name: user.fullName,
    shop_name: user.shopName,
    shop_type: user.shopType,
    email: user.email,
    mobile: user.mobile,
    password: user.password,
  });
};

export const loginUser = (user) => {
  return API.post('/auth/login', {
    email: user.email,
    password: user.password,
  });
};

export const getProfile = (token) => {
  return API.get('/auth/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};