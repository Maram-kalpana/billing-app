import API from "./api";

export const createProduct = (data, token) => {
  return API.post("/products", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateProduct = (id, data, token) => {
  return API.put(`/products/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getProducts = (token) => {
  return API.get("/products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteProduct = (id, token) => {
  return API.delete(`/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};