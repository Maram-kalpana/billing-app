import API from './api';

export const getDashboard = (token) => {
  return API.get('/reports/dashboard', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};