import API from "./api";

export const getCategories = (token) => {
  return API.get("/categories", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createCategory = (category, token) => {
  return API.post(
    "/categories",
    {
      name: category.name,
      image: category.image || "",
      status: category.status || "Active",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateCategory = (id, category, token) => {
  return API.put(
    `/categories/${id}`,
    {
      name: category.name,
      image: category.image || "",
      status: category.status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteCategory = (id, token) => {
  return API.delete(`/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};