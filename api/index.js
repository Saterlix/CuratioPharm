import express from 'express';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const { Pool } = pg;

const app = express();

// --- ENV ---
const JWT_SECRET = process.env.JWT_SECRET || 'CtP2024@SecureKeyRandom987XyZ';
const ADMIN_SECRET_URL = process.env.ADMIN_SECRET_URL || 'cp-admin-2024';
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'AdminAccess@2024';
const DATABASE_URL = process.env.DATABASE_URL;

// --- DB ---
// --- DB ---
const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000 // 5s timeout
});

// Verify connection on startup (log only)
pool.connect().then(client => {
    console.log('✅ Connected to Database');
    client.release();
}).catch(e => console.error('❌ Database Connection Error:', e.message));

// SQL helper: convert ? to $1,$2,...
const q = (sql, params = []) => {
    let i = 1;
    const pgSql = sql.replace(/\?/g, () => `$${i++}`);
    return pool.query(pgSql, params);
};
const dbRun = async (sql, params = []) => { const r = await q(sql, params); return { lastID: 0, changes: r.rowCount }; };
const dbGet = async (sql, params = []) => { const r = await q(sql, params); return r.rows[0]; };
const dbAll = async (sql, params = []) => { const r = await q(sql, params); return r.rows; };

// Test DB Endpoint
app.get('/api/test-db', async (req, res) => {
    try {
        if (!DATABASE_URL) throw new Error('DATABASE_URL is not defined');
        const result = await pool.query('SELECT NOW() as now');
        res.json({
            status: 'ok',
            time: result.rows[0].now,
            message: '✅ Connection to Neon DB successful!'
        });
    } catch (e) {
        res.status(500).json({
            status: 'error',
            message: '❌ Database connection failed',
            error: e.message
        });
    }
});

// --- MIDDLEWARE ---
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Требуется авторизация' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') return res.status(401).json({ error: 'Сессия истекла' });
        return res.status(403).json({ error: 'Недействительный токен' });
    }
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Доступ запрещён' });
    next();
};

const requireActiveAccount = async (req, res, next) => {
    try {
        const user = await dbGet('SELECT is_active FROM users WHERE id = ?', [req.user.id]);
        if (!user || !user.is_active) return res.status(403).json({ error: 'Аккаунт деактивирован' });
        next();
    } catch (e) { res.status(500).json({ error: 'Ошибка сервера' }); }
};

// --- HEALTH ---
app.get('/health', (req, res) => res.json({ status: 'ok', path: 'root-health', db: !!DATABASE_URL }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', path: 'api-health', db: !!DATABASE_URL }));

// ===================== AUTH =====================
app.post('/api/auth/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password) return res.status(400).json({ error: 'Логин и пароль обязательны' });

        const user = await dbGet('SELECT * FROM users WHERE email = ?', [login.toLowerCase()]);
        if (!user) return res.status(401).json({ error: 'Неверный логин или пароль' });
        if (!user.is_active) return res.status(403).json({ error: 'Аккаунт деактивирован' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Неверный логин или пароль' });

        await dbRun('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, company: user.company_name },
            JWT_SECRET, { expiresIn: '24h' }
        );

        res.json({
            success: true, token,
            user: {
                id: user.id, email: user.email, role: user.role,
                companyName: user.company_name, contactPerson: user.contact_person, phone: user.phone
            }
        });
    } catch (e) { console.error('Login error:', e); res.status(500).json({ error: 'Ошибка сервера' }); }
});

app.post('/api/auth/verify', async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ valid: false });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await dbGet('SELECT is_active FROM users WHERE id = ?', [decoded.id]);
        if (!user || !user.is_active) return res.status(401).json({ valid: false });
        res.json({ valid: true, user: decoded });
    } catch (e) { res.status(401).json({ valid: false }); }
});

// ===================== ADMIN =====================
app.post('/api/admin/:secret/login', async (req, res) => {
    try {
        if (req.params.secret !== ADMIN_SECRET_URL) return res.status(404).json({ error: 'Endpoint не найден' });
        const { login, password } = req.body;
        if (!login || !password) return res.status(400).json({ error: 'Логин и пароль обязательны' });

        const user = await dbGet("SELECT * FROM users WHERE email = ? AND role = 'admin'", [login.toLowerCase()]);
        if (!user) return res.status(401).json({ error: 'Доступ запрещён' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Доступ запрещён' });

        await dbRun('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

        const token = jwt.sign(
            { id: user.id, email: user.email, role: 'admin', isAdmin: true },
            JWT_SECRET, { expiresIn: '8h' }
        );

        res.json({ success: true, token, user: { id: user.id, email: user.email, role: 'admin' } });
    } catch (e) { console.error('Admin login error:', e); res.status(500).json({ error: 'Ошибка сервера' }); }
});

// Admin stats
app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const totalPartners = await dbGet("SELECT COUNT(*) as count FROM users WHERE role = 'partner'");
        const activePartners = await dbGet("SELECT COUNT(*) as count FROM users WHERE role = 'partner' AND is_active = 1");
        const totalOrders = await dbGet('SELECT COUNT(*) as count FROM orders');
        const pendingOrders = await dbGet("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'");
        const totalProducts = await dbGet('SELECT COUNT(*) as count FROM products');

        res.json({
            stats: {
                totalPartners: totalPartners?.count || 0,
                activePartners: activePartners?.count || 0,
                inactivePartners: (totalPartners?.count || 0) - (activePartners?.count || 0),
                totalOrders: totalOrders?.count || 0,
                pendingOrders: pendingOrders?.count || 0,
                totalProducts: totalProducts?.count || 0
            }
        });
    } catch (e) { res.status(500).json({ error: 'Ошибка сервера' }); }
});

// Admin users CRUD
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const users = await dbAll("SELECT id, email, company_name, contact_person, phone, is_active, created_at, last_login FROM users WHERE role IN ('partner','client','manager') ORDER BY created_at DESC");
        res.json({ users: users.map(u => ({ id: u.id, email: u.email, companyName: u.company_name, contactPerson: u.contact_person, phone: u.phone, isActive: !!u.is_active, createdAt: u.created_at, lastLogin: u.last_login })) });
    } catch (e) { res.status(500).json({ error: 'Ошибка сервера' }); }
});

app.post('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { email, password, companyName, contactPerson, phone } = req.body;
        if (!email || !password || !companyName) return res.status(400).json({ error: 'Email, пароль и название компании обязательны' });
        const existing = await dbGet('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
        if (existing) return res.status(400).json({ error: 'Этот email уже используется' });
        const hash = await bcrypt.hash(password, 12);
        await dbRun("INSERT INTO users (email, password, role, company_name, contact_person, phone, is_active, created_by) VALUES (?, ?, 'partner', ?, ?, ?, 1, ?)",
            [email.toLowerCase(), hash, companyName, contactPerson || null, phone || null, req.user.id]);
        res.json({ success: true, message: 'Партнёр создан' });
    } catch (e) { res.status(500).json({ error: 'Ошибка сервера' }); }
});

app.put('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { companyName, contactPerson, phone, isActive, newPassword } = req.body;
        const updates = []; const params = [];
        if (companyName !== undefined) { updates.push('company_name = ?'); params.push(companyName); }
        if (contactPerson !== undefined) { updates.push('contact_person = ?'); params.push(contactPerson); }
        if (phone !== undefined) { updates.push('phone = ?'); params.push(phone); }
        if (isActive !== undefined) { updates.push('is_active = ?'); params.push(isActive ? 1 : 0); }
        if (newPassword) { updates.push('password = ?'); params.push(await bcrypt.hash(newPassword, 12)); }
        if (updates.length === 0) return res.status(400).json({ error: 'Нет данных' });

        // Convert ? to $N for the dynamic query
        let i = 1;
        const pgUpdates = updates.map(u => u.replace('?', `$${i++}`));
        params.push(id);
        await pool.query(`UPDATE users SET ${pgUpdates.join(', ')} WHERE id = $${i}`, params);
        res.json({ success: true, message: 'Обновлено' });
    } catch (e) { res.status(500).json({ error: 'Ошибка сервера' }); }
});

app.delete('/api/admin/users/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await dbRun('UPDATE users SET is_active = 0 WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Деактивирован' });
    } catch (e) { res.status(500).json({ error: 'Ошибка сервера' }); }
});

// Admin products
app.get('/api/admin/products', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const products = await dbAll('SELECT * FROM products ORDER BY name ASC');
        res.json({ products });
    } catch (e) { res.status(500).json({ error: 'Ошибка' }); }
});

app.post('/api/admin/products', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { name, price, stock, manufacturer, category } = req.body;
        await dbRun('INSERT INTO products (guid, name, price, stock, manufacturer, category, is_active) VALUES (?, ?, ?, ?, ?, ?, 1)',
            ['prod-' + Date.now(), name, price, stock, manufacturer, category]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/admin/products/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, stock, is_active } = req.body;
        if (is_active !== undefined) {
            await dbRun('UPDATE products SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, id]);
        } else {
            await dbRun('UPDATE products SET name=?, price=?, stock=? WHERE id=?', [name, price, stock, id]);
        }
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// ===================== PRODUCTS =====================
app.get('/api/products', async (req, res) => {
    try {
        const { category, search } = req.query;
        let sql = 'SELECT id, guid, name, price, stock, manufacturer, category, description FROM products WHERE is_active = 1';
        const params = [];
        if (category) { sql += ' AND category = ?'; params.push(category); }
        if (search) { sql += ' AND (name ILIKE ? OR manufacturer ILIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
        sql += ' ORDER BY name';
        const products = await dbAll(sql, params);
        res.json({ success: true, products });
    } catch (e) { res.status(500).json({ error: 'Ошибка' }); }
});

app.get('/api/products/category/:category', async (req, res) => {
    try {
        const products = await dbAll('SELECT id, guid, name, price, stock, manufacturer, category, description FROM products WHERE category = ? AND is_active = 1 ORDER BY name', [req.params.category]);
        res.json({ success: true, products });
    } catch (e) { res.status(500).json({ error: 'Ошибка' }); }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await dbGet('SELECT * FROM products WHERE id = ? AND is_active = 1', [req.params.id]);
        if (!product) return res.status(404).json({ error: 'Товар не найден' });
        res.json({ success: true, product });
    } catch (e) { res.status(500).json({ error: 'Ошибка' }); }
});

// ===================== USERS =====================
app.get('/api/users/me', authenticateToken, requireActiveAccount, async (req, res) => {
    try {
        const user = await dbGet('SELECT id, email, role, company_name, contact_person, phone, address, created_at, last_login FROM users WHERE id = ?', [req.user.id]);
        if (!user) return res.status(404).json({ error: 'Не найден' });
        res.json({ id: user.id, email: user.email, role: user.role, companyName: user.company_name, contactPerson: user.contact_person, phone: user.phone, address: user.address });
    } catch (e) { res.status(500).json({ error: 'Ошибка' }); }
});

app.put('/api/users/me', authenticateToken, requireActiveAccount, async (req, res) => {
    try {
        const { contactPerson, phone, address } = req.body;
        await dbRun('UPDATE users SET contact_person = COALESCE(?, contact_person), phone = COALESCE(?, phone), address = COALESCE(?, address) WHERE id = ?',
            [contactPerson, phone, address, req.user.id]);
        res.json({ success: true, message: 'Профиль обновлён' });
    } catch (e) { res.status(500).json({ error: 'Ошибка' }); }
});

// ===================== ORDERS =====================
app.get('/api/orders', authenticateToken, requireActiveAccount, async (req, res) => {
    try {
        const orders = await dbAll('SELECT id, order_number, status, total_amount, items_count, created_at, updated_at FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json({ success: true, orders: orders.map(o => ({ id: o.id, orderNumber: o.order_number, status: o.status, totalAmount: o.total_amount, itemsCount: o.items_count, createdAt: o.created_at, updatedAt: o.updated_at })) });
    } catch (e) { res.status(500).json({ error: 'Ошибка' }); }
});

app.get('/api/orders/:id', authenticateToken, requireActiveAccount, async (req, res) => {
    try {
        const order = await dbGet('SELECT o.*, u.email as user_email, u.company_name FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ? AND o.user_id = ?', [req.params.id, req.user.id]);
        if (!order) return res.status(404).json({ error: 'Заказ не найден' });
        const items = await dbAll('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
        res.json({ success: true, order: { ...order, items } });
    } catch (e) { res.status(500).json({ error: 'Ошибка' }); }
});

app.post('/api/orders', authenticateToken, requireActiveAccount, async (req, res) => {
    try {
        const { deliveryAddress, contactPhone, notes } = req.body;
        const cartItems = await dbAll('SELECT * FROM cart_items WHERE user_id = ?', [req.user.id]);
        if (!cartItems || cartItems.length === 0) return res.status(400).json({ error: 'Корзина пуста' });
        const totalAmount = cartItems.reduce((s, i) => s + (i.price * i.quantity), 0);
        const itemsCount = cartItems.reduce((s, i) => s + i.quantity, 0);
        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // Use RETURNING id to get the order ID
        const result = await q("INSERT INTO orders (user_id, order_number, status, total_amount, items_count, delivery_address, contact_phone, notes) VALUES ($1, $2, 'pending', $3, $4, $5, $6, $7) RETURNING id",
            [req.user.id, orderNumber, totalAmount, itemsCount, deliveryAddress, contactPhone, notes]);
        const orderId = result.rows[0].id;

        for (const item of cartItems) {
            await q('INSERT INTO order_items (order_id, product_id, product_name, quantity, price, total) VALUES ($1, $2, $3, $4, $5, $6)',
                [orderId, item.product_id, item.product_name, item.quantity, item.price, item.price * item.quantity]);
        }
        await dbRun('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);
        res.status(201).json({ success: true, message: 'Заказ создан', order: { id: orderId, orderNumber, totalAmount, itemsCount } });
    } catch (e) { console.error(e); res.status(500).json({ error: 'Ошибка' }); }
});

app.put('/api/orders/:id/cancel', authenticateToken, requireActiveAccount, async (req, res) => {
    try {
        const order = await dbGet('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (!order) return res.status(404).json({ error: 'Заказ не найден' });
        if (order.status !== 'pending') return res.status(400).json({ error: 'Можно отменить только ожидающий заказ' });
        await dbRun("UPDATE orders SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = ?", [req.params.id]);
        res.json({ success: true, message: 'Заказ отменен' });
    } catch (e) { res.status(500).json({ error: 'Ошибка' }); }
});

// ===================== CART =====================
app.get('/api/cart', authenticateToken, requireActiveAccount, async (req, res) => {
    try {
        const items = await dbAll('SELECT * FROM cart_items WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        const total = items.reduce((s, i) => s + (i.price * i.quantity), 0);
        const totalItems = items.reduce((s, i) => s + i.quantity, 0);
        res.json({ success: true, items: items.map(i => ({ id: i.id, productId: i.product_id, productName: i.product_name, quantity: i.quantity, price: i.price, total: i.price * i.quantity })), total, totalItems });
    } catch (e) { res.status(500).json({ error: 'Ошибка' }); }
});

app.post('/api/cart', authenticateToken, requireActiveAccount, async (req, res) => {
    try {
        const { productId, productName, quantity, price } = req.body;
        if (!productId || !productName || !quantity || !price) return res.status(400).json({ error: 'Все поля обязательны' });
        const existing = await dbGet('SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?', [req.user.id, productId]);
        if (existing) {
            await dbRun('UPDATE cart_items SET quantity = quantity + ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND product_id = ?', [quantity, req.user.id, productId]);
        } else {
            await dbRun('INSERT INTO cart_items (user_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)', [req.user.id, productId, productName, quantity, price]);
        }
        res.json({ success: true, message: 'Товар добавлен' });
    } catch (e) { res.status(500).json({ error: 'Ошибка' }); }
});

app.put('/api/cart/:id', authenticateToken, requireActiveAccount, async (req, res) => {
    try {
        const { quantity } = req.body;
        await dbRun('UPDATE cart_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?', [quantity, req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Ошибка' }); }
});

app.delete('/api/cart/:id', authenticateToken, requireActiveAccount, async (req, res) => {
    try {
        await dbRun('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: 'Ошибка' }); }
});

app.delete('/api/cart', authenticateToken, requireActiveAccount, async (req, res) => {
    try {
        await dbRun('DELETE FROM cart_items WHERE user_id = ?', [req.user.id]);
        res.json({ success: true, message: 'Корзина очищена' });
    } catch (e) { res.status(500).json({ error: 'Ошибка' }); }
});

// ===================== CABINET =====================
app.get('/api/cabinet/debts', authenticateToken, requireActiveAccount, async (req, res) => {
    try {
        const debt = await dbGet('SELECT * FROM debts WHERE user_id = ?', [req.user.id]);
        if (!debt) return res.json({ success: true, debt: { amount: 0, creditLimit: 0, overdueAmount: 0, currency: 'UZS', updatedAt: null } });
        res.json({ success: true, debt: { amount: debt.amount, creditLimit: debt.credit_limit, overdueAmount: debt.overdue_amount, currency: debt.currency, updatedAt: debt.updated_at } });
    } catch (e) { res.status(500).json({ error: 'Ошибка' }); }
});

app.get('/api/cabinet/documents', authenticateToken, requireActiveAccount, async (req, res) => {
    try {
        const { type, status, startDate, endDate } = req.query;
        let sql = 'SELECT * FROM documents WHERE user_id = ?';
        const params = [req.user.id];
        if (type) { sql += ' AND type = ?'; params.push(type); }
        if (status) { sql += ' AND status = ?'; params.push(status); }
        if (startDate) { sql += ' AND date >= ?'; params.push(startDate); }
        if (endDate) { sql += ' AND date <= ?'; params.push(endDate); }
        sql += ' ORDER BY date DESC';
        const documents = await dbAll(sql, params);
        res.json({ success: true, documents: documents.map(d => ({ id: d.id, number: d.number, type: d.type, date: d.date, amount: d.amount, status: d.status, fileUrl: d.file_url })) });
    } catch (e) { res.status(500).json({ error: 'Ошибка' }); }
});

app.get('/api/cabinet/claims', authenticateToken, requireActiveAccount, async (req, res) => {
    try {
        const claims = await dbAll('SELECT c.*, p.name as product_name FROM claims c LEFT JOIN products p ON c.product_id = p.id WHERE c.user_id = ? ORDER BY c.created_at DESC', [req.user.id]);
        res.json({ success: true, claims: claims.map(c => ({ id: c.id, type: c.type, status: c.status, description: c.description, adminComment: c.admin_comment, productName: c.product_name, createdAt: c.created_at, updatedAt: c.updated_at })) });
    } catch (e) { res.status(500).json({ error: 'Ошибка' }); }
});

app.post('/api/cabinet/claims', authenticateToken, requireActiveAccount, async (req, res) => {
    try {
        const { orderId, productId, type, description } = req.body;
        if (!type || !description) return res.status(400).json({ error: 'Тип и описание обязательны' });
        await dbRun("INSERT INTO claims (user_id, order_id, product_id, type, description, status) VALUES (?, ?, ?, ?, ?, 'new')",
            [req.user.id, orderId || null, productId || null, type, description]);
        res.status(201).json({ success: true, message: 'Претензия создана' });
    } catch (e) { res.status(500).json({ error: 'Ошибка' }); }
});

app.get('/api/cabinet/certificates', authenticateToken, requireActiveAccount, async (req, res) => {
    try {
        const { productId } = req.query;
        let sql = 'SELECT * FROM certificates WHERE 1=1';
        const params = [];
        if (productId) { sql += ' AND product_id = ?'; params.push(productId); }
        else { sql += ' ORDER BY created_at DESC LIMIT 20'; }
        const certificates = await dbAll(sql, params);
        res.json({ success: true, certificates });
    } catch (e) { res.status(500).json({ error: 'Ошибка' }); }
});

// ===================== INIT DB (one-time) =====================
app.get('/api/init-db', async (req, res) => {
    try {
        // Create tables
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'client' CHECK(role IN ('admin','manager','client','partner')),
            company_name TEXT, contact_person TEXT, phone TEXT, address TEXT,
            is_active INTEGER DEFAULT 1, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP, created_by INTEGER
        )`);
        await pool.query(`CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY, guid TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
            manufacturer TEXT, category TEXT, price DECIMAL(10,2) NOT NULL DEFAULT 0,
            stock INTEGER NOT NULL DEFAULT 0, description TEXT, is_active INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, synced_at TIMESTAMP
        )`);
        await pool.query(`CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id),
            order_number TEXT UNIQUE NOT NULL, status TEXT DEFAULT 'pending', total_amount DECIMAL(15,2) NOT NULL,
            items_count INTEGER NOT NULL, delivery_address TEXT, contact_phone TEXT, notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        await pool.query(`CREATE TABLE IF NOT EXISTS order_items (
            id SERIAL PRIMARY KEY, order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
            product_id INTEGER NOT NULL, product_name TEXT NOT NULL, quantity INTEGER NOT NULL,
            price DECIMAL(10,2) NOT NULL, total DECIMAL(15,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        await pool.query(`CREATE TABLE IF NOT EXISTS cart_items (
            id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            product_id INTEGER NOT NULL, product_name TEXT NOT NULL, quantity INTEGER NOT NULL DEFAULT 1,
            price DECIMAL(10,2) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, UNIQUE(user_id, product_id)
        )`);
        await pool.query(`CREATE TABLE IF NOT EXISTS debts (
            id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
            amount DECIMAL(15,2) NOT NULL DEFAULT 0, credit_limit DECIMAL(15,2) NOT NULL DEFAULT 0,
            overdue_amount DECIMAL(15,2) NOT NULL DEFAULT 0, currency TEXT DEFAULT 'UZS',
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        await pool.query(`CREATE TABLE IF NOT EXISTS documents (
            id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            number TEXT NOT NULL, type TEXT NOT NULL, date DATE NOT NULL,
            amount DECIMAL(15,2) NOT NULL DEFAULT 0, status TEXT DEFAULT 'unpaid',
            file_url TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        await pool.query(`CREATE TABLE IF NOT EXISTS claims (
            id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            order_id INTEGER, product_id INTEGER, type TEXT NOT NULL,
            status TEXT DEFAULT 'new', description TEXT, admin_comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        await pool.query(`CREATE TABLE IF NOT EXISTS certificates (
            id SERIAL PRIMARY KEY, product_id INTEGER, name TEXT NOT NULL,
            file_url TEXT NOT NULL, expiration_date DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        await pool.query(`CREATE TABLE IF NOT EXISTS login_attempts (
            id SERIAL PRIMARY KEY, ip_address TEXT NOT NULL, email TEXT,
            success INTEGER DEFAULT 0, attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
        await pool.query(`CREATE TABLE IF NOT EXISTS admin_logs (
            id SERIAL PRIMARY KEY, admin_id INTEGER NOT NULL, action TEXT NOT NULL,
            target_user_id INTEGER, details TEXT, ip_address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        // Seed admin
        const admin = await dbGet("SELECT id FROM users WHERE email = 'admincp'");
        if (!admin) {
            const hash = await bcrypt.hash('#wtkm999$', 12);
            await dbRun("INSERT INTO users (email, password, role, company_name, contact_person, is_active) VALUES (?, ?, 'admin', 'CuratioPharm', 'Super Administrator', 1)", ['admincp', hash]);
        }

        // Seed products
        const pc = await dbGet('SELECT count(*) as c FROM products');
        if (parseInt(pc.c) === 0) {
            const prods = [
                ['prod-001', 'Амоксициллин 500 мг', 'Узфарм', 'Антибиотики', 15000, 1200],
                ['prod-002', 'Азитромицин 500 мг', 'Узфарм', 'Антибиотики', 25000, 800],
                ['prod-003', 'Цефтриаксон 1.0 г', 'Фармстандарт', 'Антибиотики', 18000, 1500],
                ['prod-006', 'Витамин C 500 мг', 'Витамакс', 'Витамины', 8000, 2000],
                ['prod-007', 'Комплекс Витавит', 'Витамакс', 'Витамины', 35000, 750],
                ['prod-008', 'Витамин D3 2000 IU', 'Витамакс', 'Витамины', 22000, 1100],
                ['prod-011', 'Ибупрофен 400 мг', 'Узфарм', 'Обезболивающие', 7000, 2500],
                ['prod-012', 'Парацетамол 500 мг', 'Узфарм', 'Обезболивающие', 5000, 3000],
                ['prod-016', 'Натрия хлорид 0.9%', 'Узфарм', 'Растворы', 4500, 5000],
                ['prod-020', 'Лоратадин 10 мг', 'Узфарм', 'Антигистаминные', 6000, 2200],
            ];
            for (const p of prods) {
                await q('INSERT INTO products (guid, name, manufacturer, category, price, stock) VALUES ($1,$2,$3,$4,$5,$6)', p);
            }
        }

        // Seed client
        const client = await dbGet("SELECT id FROM users WHERE email = 'client1@apteka1.uz'");
        if (!client) {
            const hash = await bcrypt.hash('Client2024!', 12);
            await dbRun("INSERT INTO users (email, password, role, company_name, contact_person, phone, is_active) VALUES (?, ?, 'client', 'Аптека №1', 'Тошкент Фармация', '+998 71 123-45-67', 1)", ['client1@apteka1.uz', hash]);
            // Add debt for client
            const u = await dbGet("SELECT id FROM users WHERE email = 'client1@apteka1.uz'");
            if (u) await dbRun('INSERT INTO debts (user_id, amount, credit_limit) VALUES (?, 4500000, 10000000)', [u.id]);
            // Add a document
            if (u) await dbRun("INSERT INTO documents (user_id, number, type, date, amount, status) VALUES (?, 'INV-2024-001', 'invoice', '2024-12-15', 1200000, 'unpaid')", [u.id]);
        }

        // Seed more clients
        const clients = [
            ['client2@apteka2.uz', 'Client2024!', 'Аптека №2', 'Самарканд Мед', '+998 66 234-56-78'],
            ['client3@apteka3.uz', 'Client2024!', 'Аптека №3', 'Бухара Фарм', '+998 65 345-67-89'],
        ];
        for (const c of clients) {
            const ex = await dbGet('SELECT id FROM users WHERE email = ?', [c[0]]);
            if (!ex) {
                const hash = await bcrypt.hash(c[1], 12);
                await dbRun("INSERT INTO users (email, password, role, company_name, contact_person, phone, is_active) VALUES (?, ?, 'client', ?, ?, ?, 1)", [c[0], hash, c[2], c[3], c[4]]);
            }
        }

        res.json({ success: true, message: '✅ Database initialized!' });
    } catch (e) {
        console.error('Init DB error:', e);
        res.status(500).json({ error: e.message });
    }
});

// 404 catch-all
app.all('/api/*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint не найден',
        debug: {
            url: req.url,
            originalUrl: req.originalUrl,
            params: req.params
        }
    });
});

export default (req, res) => {
    return app(req, res);
};
