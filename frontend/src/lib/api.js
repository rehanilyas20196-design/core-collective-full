const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const res = await fetch(url, config);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

// Auth
export const api = {
  auth: {
    signup: (email, password, fullName, joiningDate) =>
      request('/auth/signup', { method: 'POST', body: { email, password, full_name: fullName, joiningDate } }),
    login: (email, password) =>
      request('/auth/login', { method: 'POST', body: { email, password } }),
    logout: () =>
      request('/auth/logout', { method: 'POST' }),
    getSession: () =>
      request('/auth/session'),
    googleSignIn: () =>
      request('/auth/google', { method: 'POST' }),
  },

  // Products
  products: {
    getAll: (search) =>
      request(`/products${search ? `?search=${encodeURIComponent(search)}` : ''}`),
    getOne: (id) =>
      request(`/products/${id}`),
    getCategories: () =>
      request('/products/categories'),
    getRelated: (category, productId) =>
      request(`/products/related/${encodeURIComponent(category)}/${productId}`),
    getSellerProducts: (limit = 12) =>
      request(`/products/seller?limit=${limit}`),
    getMinimal: (limit = 200) =>
      request(`/products/minimal?limit=${limit}`),
  },

  // Orders
  orders: {
    getAll: () =>
      request('/orders'),
    getConfirmedCount: () =>
      request('/orders/confirmed-count'),
    create: (orderData) =>
      request('/orders', { method: 'POST', body: orderData }),
    updateStatus: (id, status) =>
      request(`/orders/${id}/status`, { method: 'PATCH', body: { status } }),
    delete: (id) =>
      request(`/orders/${id}`, { method: 'DELETE' }),
  },

  // Reviews
  reviews: {
    getByProduct: (productId) =>
      request(`/reviews/${productId}`),
    create: (reviewData) =>
      request('/reviews', { method: 'POST', body: reviewData }),
  },

  // Deals
  deals: {
    getAll: () =>
      request('/deals'),
  },

  // Recommended Items
  recommendedItems: {
    getAll: () =>
      request('/recommended-items'),
  },

  // Supplier Inquiries
  supplierInquiries: {
    create: (data) =>
      request('/supplier-inquiries', { method: 'POST', body: data }),
  },

  // Upload
  upload: {
    paymentScreenshot: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      return request('/upload/payment-screenshot', {
        method: 'POST',
        body: formData,
        headers: {},
      });
    },
  },
};
