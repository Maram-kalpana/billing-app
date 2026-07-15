const categoryIconMap = {
  fruits: 'food-apple',
  vegetables: 'carrot',
  meat: 'food-steak',
  seafood: 'fish',
  eggs: 'egg',
  dairy: 'cup',
  bakery: 'bread-slice',
  rice: 'rice',
  grocery: 'basket',
  snacks: 'cookie',
  beverages: 'cup-water',
  frozen: 'snowflake',
  'personal care': 'face-man',
  cleaning: 'spray-bottle',
  medicine: 'pill',
  electronics: 'cellphone',
  stationery: 'pencil',
  other: 'package-variant',
};

export const getCategoryIconName = (categoryName) => {
  if (!categoryName) return 'package-variant';
  const key = String(categoryName).toLowerCase().trim();
  if (categoryIconMap[key]) return categoryIconMap[key];

  const normalized = key.replace(/\s+/g, ' ').trim();
  if (categoryIconMap[normalized]) return categoryIconMap[normalized];

  return 'package-variant';
};

export const getProductIconName = (product) => {
  if (product?.icon) return product.icon;
  return getCategoryIconName(product?.category);
};
