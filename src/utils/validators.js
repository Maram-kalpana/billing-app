export const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const validateAuthFields = ({ fullName, shopName,shopType, mobile, email, password, confirmPassword }) => {
  const errors = {};

  if (fullName !== undefined && !fullName.trim()) {
    errors.fullName = 'Full name is required';
  }

  if (shopName !== undefined && !shopName.trim()) {
    errors.shopName = 'Shop name is required';
  }
if (shopType !== undefined && !shopType.trim()) {
  errors.shopType = 'Shop Type is required';
}
  if (mobile !== undefined && !mobile.trim()) {
    errors.mobile = 'Mobile number is required';
  }

  if (!email || !isValidEmail(email)) {
    errors.email = 'Enter a valid email';
  }

  if (!password || password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};
