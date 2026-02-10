import axios from 'axios';

// 1. Адрес сервера: читаем из VITE_API_BASE_URL или по умолчанию 3001
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3006/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Reminder': 'true'
    }
});

// 2. Автоматически добавляем Токен к каждому запросу (если мы вошли)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Обработка ошибок (если токен протух - выкидываем)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Можно добавить редирект на логин, если нужно
        }
        return Promise.reject(error);
    }
);

const extractPath = (config = {}) => {
    if (!config.url) return '';
    try {
        // Если абсолютный URL
        const url = new URL(config.url, config.baseURL || window.location.origin);
        return url.pathname;
    } catch (e) {
        return config.url;
    }
};

export const formatApiError = (error, action = 'Ошибка запроса') => {
    if (!error) return action;

    if (error.code === 'ERR_NETWORK') {
        return `${action}: нет соединения с сервером (возможны технические работы)`;
    }

    const method = (error.config?.method || 'GET').toUpperCase();
    const path = extractPath(error.config);
    const status = error.response?.status;
    const statusText = error.response?.statusText;
    const detail = error.response?.data?.error || error.response?.data?.message;

    let message = `${action}: ${method} ${path || ''}`.trim();

    if (status) {
        message += ` → ${status}${statusText ? ` ${statusText}` : ''}`;
    }

    if (detail) {
        message += ` — ${detail}`;
    }

    if (!status && !detail && error.message) {
        message += ` — ${error.message}`;
    }

    return message;
};

const callApi = async ({ method = 'get', url, data, params, action }) => {
    try {
        const response = await api.request({ method, url, data, params });
        return response.data;
    } catch (error) {
        throw new Error(formatApiError(error, action));
    }
};

export const authAPI = {
    // Обычный вход (для партнеров)
    async login(login, password) {
        try {
            const response = await api.post('/auth/login', { login, password });
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            return response.data;
        } catch (error) {
            throw new Error(formatApiError(error, 'Ошибка входа'));
        }
    },

    // ВХОД АДМИНА (Секретный URL из твоих логов init-db)
    async adminLogin(login, password) {
        try {
            // Важно: этот URL должен совпадать с тем, что в backend/.env или init-db
            // По умолчанию: cp-admin-2024. Можно переопределить через VITE_ADMIN_SECRET_URL
            const secretUrl = import.meta.env.VITE_ADMIN_SECRET_URL || 'cp-admin-2024';
            const response = await api.post(`/admin/${secretUrl}/login`, {
                login,
                password
            });

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('isAdmin', 'true');
            }
            return response.data;
        } catch (error) {
            throw new Error(formatApiError(error, 'Ошибка входа администратора'));
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
        window.location.href = '/login';
    }
};

export const adminAPI = {
    // Статистика для дашборда
    async getStats() {
        return callApi({ method: 'get', url: '/admin/stats', action: 'Не удалось загрузить статистику' });
    },

    // Получить пользователей
    async getUsers() {
        return callApi({ method: 'get', url: '/admin/users', action: 'Не удалось загрузить пользователей' });
    },

    // Создать пользователя
    async createUser(userData) {
        return callApi({ method: 'post', url: '/admin/users', data: userData, action: 'Не удалось создать пользователя' });
    },

    // Обновить пользователя (вкл/выкл доступ)
    async updateUser(id, data) {
        return callApi({ method: 'put', url: `/admin/users/${id}`, data, action: 'Не удалось обновить пользователя' });
    },

    async deleteUser(id) {
        return callApi({ method: 'delete', url: `/admin/users/${id}`, action: 'Не удалось удалить пользователя' });
    },

    // Получить товары
    async getProducts() {
        return callApi({ method: 'get', url: '/admin/products', action: 'Не удалось получить товары' });
    },

    // Создать товар
    async createProduct(productData) {
        return callApi({ method: 'post', url: '/admin/products', data: productData, action: 'Не удалось создать товар' });
    },

    // Обновить товар
    async updateProduct(id, data) {
        return callApi({ method: 'put', url: `/admin/products/${id}`, data, action: 'Не удалось обновить товар' });
    }
};

export const ordersAPI = {
    // Получить заказы пользователя
    async getOrders() {
        const response = await api.get('/orders');
        return response.data;
    },

    // Получить детали заказа
    async getOrderById(id) {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    // Создать заказ
    async createOrder(orderData) {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    // Отменить заказ
    async cancelOrder(id) {
        const response = await api.put(`/orders/${id}/cancel`);
        return response.data;
    }
};

export const cartAPI = {
    // Получить корзину
    async getCart() {
        const response = await api.get('/cart');
        return response.data;
    },

    // Добавить товар в корзину
    async addToCart(itemData) {
        const response = await api.post('/cart', itemData);
        return response.data;
    },

    // Обновить количество товара
    async updateItemQuantity(itemId, quantity) {
        const response = await api.put(`/cart/${itemId}`, { quantity });
        return response.data;
    },

    // Удалить товар из корзины
    async removeItem(itemId) {
        const response = await api.delete(`/cart/${itemId}`);
        return response.data;
    },

    // Очистить корзину
    async clearCart() {
        const response = await api.delete('/cart');
        return response.data;
    }
};

export const productsAPI = {
    // Получить все товары
    async getProducts() {
        const response = await api.get('/products');
        return response.data;
    },

    // Получить товар по ID
    async getProductById(id) {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    // Получить товары по категории
    async getProductsByCategory(category) {
        const response = await api.get(`/products/category/${category}`);
        return response.data;
    }
};

export const cabinetAPI = {
    // Взаиморасчеты
    async getDebts() {
        const response = await api.get('/cabinet/debts');
        return response.data;
    },

    // Документы
    async getDocuments(params) {
        const response = await api.get('/cabinet/documents', { params });
        return response.data;
    },

    // Претензии
    async getClaims() {
        const response = await api.get('/cabinet/claims');
        return response.data;
    },

    async createClaim(data) {
        const response = await api.post('/cabinet/claims', data);
        return response.data;
    },

    // Сертификаты
    async getCertificates(productId) {
        const response = await api.get('/cabinet/certificates', { params: { productId } });
        return response.data;
    }
};

export default api;