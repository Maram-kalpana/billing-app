export const login = async ({ email, password }) => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  return {
    user: {
      id: 'demo-user',
      fullName: 'Demo Merchant',
      shopName: 'Green Checkout',
      mobile: '+91 9876543210',
      email,
    },
    token: 'user_logged_in',
  };
};

export const register = async (payload) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    user: {
      id: 'demo-user',
      fullName: payload.fullName,
      shopName: payload.shopName,
      mobile: payload.mobile,
      email: payload.email,
    },
    token: 'user_logged_in',
  };
};

export const logout = async () => {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return true;
};
