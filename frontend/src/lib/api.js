const API_BASE = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api`
  : '/api';

function sanitizeUrls(obj) {
  if (typeof obj === 'string') {
    return obj.replace(/^hthttps:\/\//i, 'https://');
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeUrls);
  }
  if (obj && typeof obj === 'object') {
    const result = {};
    for (const key of Object.keys(obj)) {
      result[key] = sanitizeUrls(obj[key]);
    }
    return result;
  }
  return obj;
}

async function getToken() {
  const { supabase } = await import('./supabase');
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token || '';
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const token = await getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const res = await fetch(url, config);
  if (!res.ok) {
    if (res.status === 401) {
      const { supabase } = await import('./supabase');
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.auth.signOut();
        window.dispatchEvent(new CustomEvent('authExpired'));
      }
    }
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  return sanitizeUrls(await res.json());
}

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

  orders: {
    getAll: () => request('/orders'),
    getConfirmedCount: () => request('/orders/confirmed-count'),
    create: (orderData) => request('/orders', { method: 'POST', body: orderData }),
    updateStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PATCH', body: { status } }),
    delete: (id) => request(`/orders/${id}`, { method: 'DELETE' }),
  },

  reviews: {
    getByProduct: (productId) => request(`/reviews/${productId}`),
    create: (reviewData) => request('/reviews', { method: 'POST', body: reviewData }),
  },

  deals: {
    getAll: () => request('/deals'),
  },

  recommendedItems: {
    getAll: () => request('/recommended-items'),
  },

  supplierInquiries: {
    getAll: () => request('/supplier-inquiries'),
    create: (data) => request('/supplier-inquiries', { method: 'POST', body: data }),
    updateStatus: (id, status, adminNotes, supplierRef) =>
      request(`/supplier-inquiries/${id}/status`, { method: 'PATCH', body: { status, admin_notes: adminNotes, supplier_ref: supplierRef } }),
    delete: (id) => request(`/supplier-inquiries/${id}`, { method: 'DELETE' }),
  },

  upload: {
    paymentScreenshot: async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      const token = await getToken();
      const headers = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      return request('/upload/payment-screenshot', {
        method: 'POST',
        body: formData,
        headers,
      });
    },
  },

  favorites: {
    getAll: () => request('/favorites'),
    toggle: (productId, productData) =>
      request('/favorites/toggle', { method: 'POST', body: { product_id: productId, product_data: productData } }),
    add: (productId, productData) =>
      request('/favorites/add', { method: 'POST', body: { product_id: productId, product_data: productData } }),
    remove: (productId) => request(`/favorites/${productId}`, { method: 'DELETE' }),
  },

  cart: {
    getAll: () => request('/cart'),
    add: (productId, qty = 1, productData) =>
      request('/cart/add', { method: 'POST', body: { product_id: productId, qty, product_data: productData } }),
    updateQty: (productId, qty) =>
      request('/cart/update-qty', { method: 'PATCH', body: { product_id: productId, qty } }),
    remove: (productId) => request(`/cart/${productId}`, { method: 'DELETE' }),
    clear: () => request('/cart', { method: 'DELETE' }),
  },

  notifications: {
    getAll: () => request('/notifications'),
    getUnreadCount: () => request('/notifications/unread-count'),
    create: (type, title, message, data) =>
      request('/notifications', { method: 'POST', body: { type, title, message, data } }),
    markAsRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
    markAllAsRead: () => request('/notifications/read-all', { method: 'PATCH' }),
    delete: (id) => request(`/notifications/${id}`, { method: 'DELETE' }),
  },

  messages: {
    getAll: () => request('/messages'),
    create: (sender, message) =>
      request('/messages', { method: 'POST', body: { sender, message } }),
    clear: () => request('/messages/clear', { method: 'DELETE' }),
    remove: (id) => request(`/messages/${id}`, { method: 'DELETE' }),
  },

  discountMessages: {
    getAll: () => request('/discount-messages'),
    create: (userEmail, userName, message) =>
      request('/discount-messages', { method: 'POST', body: { user_email: userEmail, user_name: userName, message } }),
    updateStatus: (id, status, adminReply) =>
      request(`/discount-messages/${id}/status`, { method: 'PATCH', body: { status, admin_reply: adminReply } }),
    delete: (id) => request(`/discount-messages/${id}`, { method: 'DELETE' }),
  },
};
