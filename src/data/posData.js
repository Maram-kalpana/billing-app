export const categories = [
  { id: '1', name: 'Meat', icon: '🥩' },
  { id: '2', name: 'Rice', icon: '🍚' },
  { id: '3', name: 'Grits', icon: '🌾' },
  { id: '4', name: 'Salad', icon: '🥗' },
  { id: '5', name: 'Other', icon: '📦' },
];

export const productsData = [
  { id: '1', name: 'Egg Chicken Red', price: 1.99, image: '🥚', category: 'Other', stock: 100 },
  { id: '2', name: 'Egg Chicken White', price: 1.50, image: '🥚', category: 'Other', stock: 120 },
  { id: '3', name: 'Banana', price: 50.00, image: '🍌', category: 'Other', stock: 100 },
  { id: '4', name: 'Apple', price: 120.00, image: '🍎', category: 'Other', stock: 50 },
  { id: '5', name: 'Potato', price: 30.00, image: '🥔', category: 'Other', stock: 200 },
  { id: '6', name: 'Tomato', price: 40.00, image: '🍅', category: 'Other', stock: 150 },
];

export const cartItemsData = [
  { id: 'c1', name: 'Banana', type: 'qty', value: 12, total: 60.00 },
  { id: 'c2', name: 'Potato', type: 'KG', value: 1, total: 50.00 },
  { id: 'c3', name: 'Apple', type: 'qty', value: 6, total: 60.00 },
  { id: 'c4', name: 'Potato2', type: 'KG', value: 1, total: 50.00 },
  { id: 'c5', name: 'Curry Leaves', type: 'KG', value: 1, total: 50.00 },
  { id: 'c6', name: 'Tomato', type: 'KG', value: 1, total: 50.00 },
  { id: 'c7', name: 'Mirchi', type: 'KG', value: 1, total: 50.00 },
];

export const transactionsData = [
  { id: 'TXN001', type: 'Sale', date: '2024-01-15', amount: 1250, status: 'Completed' },
  { id: 'TXN002', type: 'Refund', date: '2024-01-15', amount: 200, status: 'Processed' },
  { id: 'TXN003', type: 'Sale', date: '2024-01-14', amount: 890, status: 'Completed' },
  { id: 'TXN004', type: 'Sale', date: '2024-01-14', amount: 2100, status: 'Completed' },
];
