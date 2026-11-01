const API_BASE = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "حصل خطأ غير متوقع");
  }
  return data;
}

export const api = {
  catalog: () => request("/api/catalog"),
  login: (username, password) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  me: () => request("/api/auth/me"),
  adminProducts: () => request("/api/admin/products"),
  createProduct: (payload) =>
    request("/api/admin/products", { method: "POST", body: JSON.stringify(payload) }),
  updateProduct: (id, payload) =>
    request(`/api/admin/products/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteProduct: (id) => request(`/api/admin/products/${id}`, { method: "DELETE" }),
  uploadProductImage: (id, file) => {
    const body = new FormData();
    body.append("image", file);
    return request(`/api/admin/products/${id}/image`, { method: "POST", body });
  },
  saveToday: (items, notices = {}) =>
    request("/api/admin/today", {
      method: "PUT",
      body: JSON.stringify({
        items,
        daily_news: notices.daily_news ?? notices,
        special_order_enabled: notices.special_order_enabled,
        special_order_note: notices.special_order_note,
        festival_enabled: notices.festival_enabled,
        festival_title: notices.festival_title,
        festival_note: notices.festival_note
      })
    }),
  categories: () => request("/api/admin/categories"),
  createCategory: (payload) =>
    request("/api/admin/categories", { method: "POST", body: JSON.stringify(payload) }),
  updateCategory: (id, payload) =>
    request(`/api/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteCategory: (id) => request(`/api/admin/categories/${id}`, { method: "DELETE" }),
  settings: () => request("/api/admin/settings"),
  saveSettings: (payload) =>
    request("/api/admin/settings", { method: "PUT", body: JSON.stringify(payload) }),
  sendFeedback: (payload) =>
    request("/api/feedback", { method: "POST", body: JSON.stringify(payload) }),
  recordOrder: (items) =>
    request("/api/orders", { method: "POST", body: JSON.stringify({ items }) }),
  analytics: () => request("/api/admin/analytics"),
  adminFeedbacks: () => request("/api/admin/feedbacks"),
  approveFeedback: (id) => request(`/api/admin/feedbacks/${id}/approve`, { method: "PUT" }),
  deleteFeedback: (id) => request(`/api/admin/feedbacks/${id}`, { method: "DELETE" })
};
