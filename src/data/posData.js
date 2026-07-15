export const categories = [
  { id: '1', name: 'Fruits', icon: 'food-apple' },
  { id: '2', name: 'Vegetables', icon: 'carrot' },
  { id: '3', name: 'Meat', icon: 'food-steak' },
  { id: '4', name: 'Rice', icon: 'rice' },
  { id: '5', name: 'Dairy', icon: 'cup' },
  { id: '6', name: 'Other', icon: 'package-variant' },
];

export const productsData = [
  { id: '1', name: 'Egg Tray', price: 1.99, icon: 'egg', category: 'Eggs', stock: 100, image_url: null },
  { id: '2', name: 'Milk Packet', price: 1.5, icon: 'cup', category: 'Dairy', stock: 120, image_url: null },
  { id: '3', name: 'Banana', price: 50.0, icon: 'food-apple', category: 'Fruits', stock: 100, image_url: null },
  { id: '4', name: 'Apple', price: 120.0, icon: 'food-apple', category: 'Fruits', stock: 50, image_url: null },
  { id: '5', name: 'Potato', price: 30.0, icon: 'carrot', category: 'Vegetables', stock: 200, image_url: null },
  { id: '6', name: 'Tomato', price: 40.0, icon: 'carrot', category: 'Vegetables', stock: 150, image_url: null },
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
