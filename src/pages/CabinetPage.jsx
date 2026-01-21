import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme, themes } from '../context/ThemeContext';
import { ordersAPI, cartAPI } from '../services/api';
import {
    User,
    LogOut,
    Package,
    FileText,
    Settings,
    X,
    Palette,
    Bell,
    Shield,
    ChevronRight,
    Check,
    Mail,
    Phone,
    Building,
    ShoppingBag,
    ShoppingCart,
    Percent,
    CreditCard,
    FileCheck,
    AlertCircle,
    Loader2
} from 'lucide-react';
import Navbar from './Navbar';
import './CabinetPage.css';

const CabinetPage = () => {
    const { isAuthenticated, user, logout, loading: authLoading } = useAuth();
    const { theme, setTheme } = useTheme();
    const navigate = useNavigate();
    const [showSettings, setShowSettings] = useState(false);
    const [activeSettingsTab, setActiveSettingsTab] = useState('profile');
    
    // State for active section modal
    const [activeSection, setActiveSection] = useState(null);

    // Profile form state - initialized from user data
    const [profile, setProfile] = useState({
        name: '',
        company: '',
        email: '',
        phone: '',
    });

    // Real data state
    const [orders, setOrders] = useState([]);
    const [cart, setCart] = useState({ items: [], total: 0, totalItems: 0 });
    const [loadingData, setLoadingData] = useState(false);

    // Load profile data when user changes
    useEffect(() => {
        if (user) {
            setProfile({
                name: user.contactPerson || user.email || '',
                company: user.companyName || '',
                email: user.email || '',
                phone: user.phone || '',
            });
        }
    }, [user]);

    // Load orders and cart data
    useEffect(() => {
        if (isAuthenticated) {
            loadOrders();
            loadCart();
        }
    }, [isAuthenticated]);

    const loadOrders = async () => {
        try {
            const data = await ordersAPI.getOrders();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Error loading orders:', error);
        }
    };

    const loadCart = async () => {
        try {
            const data = await cartAPI.getCart();
            if (data.success) {
                setCart(data);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    };

    // Redirect to login if not authenticated
    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleProfileChange = (field, value) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const renderSectionContent = () => {
        switch (activeSection) {
            case 'orders':
                return (
                    <div className="modal-table-container">
                        <table className="modal-table">
                            <thead>
                                <tr>
                                    <th>№ Заказа</th>
                                    <th>Дата</th>
                                    <th>Статус</th>
                                    <th>Сумма</th>
                                    <th>Позиций</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length === 0 ? (
                                    <tr><td colSpan="5" className="empty-state">Заказов нет</td></tr>
                                ) : (
                                    orders.map(order => (
                                        <tr key={order.id}>
                                            <td>{order.orderNumber}</td>
                                            <td>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</td>
                                            <td>
                                                <span className={`status-badge ${order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}`}>
                                                    {order.status === 'pending' && 'Ожидает'}
                                                    {order.status === 'processing' && 'В обработке'}
                                                    {order.status === 'shipped' && 'Отправлен'}
                                                    {order.status === 'delivered' && 'Доставлен'}
                                                    {order.status === 'cancelled' && 'Отменен'}
                                                </span>
                                            </td>
                                            <td>{Number(order.totalAmount).toLocaleString()} сум</td>
                                            <td>{order.itemsCount}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                );
            case 'documents':
                return (
                    <div className="modal-list">
                        <div className="empty-state">
                            <p>Документы будут доступны после интеграции с 1С</p>
                        </div>
                    </div>
                );
            case 'debts':
                return (
                    <div className="debt-dashboard">
                        <div className="debt-card danger">
                            <h3>Текущий долг</h3>
                            <p className="amount">0 сум</p>
                        </div>
                        <div className="debt-card">
                            <h3>Кредитный лимит</h3>
                            <p className="amount">0 сум</p>
                        </div>
                        <div className="debt-info">
                            <p><strong>Просрочено:</strong> 0 сум</p>
                            <p><strong>Примечание:</strong> Информация о задолженности будет доступна после интеграции с 1С</p>
                        </div>
                    </div>
                );
            case 'certificates':
                return (
                    <div className="modal-list">
                        <div className="empty-state">
                            <p>Сертификаты будут доступны после интеграции с 1С</p>
                        </div>
                    </div>
                );
            case 'catalog':
                return (
                    <div className="catalog-info">
                        <p>Перейдите в каталог для просмотра и заказа товаров</p>
                        <button className="btn-primary" onClick={() => navigate('/catalog')}>
                            Перейти в каталог
                        </button>
                    </div>
                );
            case 'promotions':
                return (
                    <div className="promo-list">
                        <div className="empty-state">
                            <p>Акции и специальные предложения будут доступны позже</p>
                        </div>
                    </div>
                );
            case 'cart':
                return (
                    <div className="cart-view">
                        <div className="modal-list">
                            {cart.items.length === 0 ? (
                                <div className="empty-state">Корзина пуста</div>
                            ) : (
                                cart.items.map((item, idx) => (
                                    <div key={item.id} className="modal-list-item">
                                        <div className="item-info">
                                            <h4>{item.productName}</h4>
                                            <p>{item.quantity} шт. x {Number(item.price).toLocaleString()} сум</p>
                                        </div>
                                        <div className="item-total">{Number(item.total).toLocaleString()} сум</div>
                                    </div>
                                ))
                            )}
                        </div>
                        {cart.items.length > 0 && (
                            <div className="cart-total">
                                <h3>Итого: {Number(cart.total).toLocaleString()} сум</h3>
                                <button className="checkout-btn" onClick={() => navigate('/cart')}>Оформить заказ</button>
                            </div>
                        )}
                    </div>
                );
            case 'claims':
                return (
                    <div className="claims-form">
                        <div className="form-group">
                            <label>Тип претензии</label>
                            <select><option>Недовоз</option><option>Брак</option><option>Пересорт</option></select>
                        </div>
                        <div className="form-group">
                            <label>Номер накладной</label>
                            <input type="text" placeholder="Введите номер" />
                        </div>
                        <div className="form-group">
                            <label>Комментарий</label>
                            <textarea rows="3"></textarea>
                        </div>
                        <button className="submit-claim-btn">Отправить претензию</button>
                    </div>
                );
            default:
                return null;
        }
    };

    const getSectionTitle = () => {
        const titles = {
            orders: 'Мои заказы',
            documents: 'Документы',
            debts: 'Дебиторская задолженность',
            certificates: 'Сертификаты качества',
            catalog: 'Каталог товаров',
            promotions: 'Акции',
            cart: 'Корзина',
            claims: 'Оформление претензий'
        };
        return titles[activeSection] || '';
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <>
            <Navbar />
            <main className="page-content">
                <section className="cabinet-header">
                    <div className="container">
                        <div className="cabinet-welcome">
                            <div className="cabinet-avatar">
                                <User size={40} />
                            </div>
                            <div>
                                <h1>Добро пожаловать, {profile.name}!</h1>
                                <p>{profile.company}</p>
                            </div>
                            <button onClick={handleLogout} className="logout-btn">
                                <LogOut size={18} />
                                Выйти
                            </button>
                        </div>
                    </div>
                </section>

                <section className="section">
                    <div className="container">
                        <div className="cabinet-grid">
                            {/* Catalog */}
                            <div className="cabinet-card" onClick={() => setActiveSection('catalog')}>
                                <div className="cabinet-card-icon"><ShoppingBag size={32} /></div>
                                <h3>Каталог</h3>
                                <p>Поиск и заказ лекарственных средств</p>
                            </div>

                            {/* Cart */}
                            <div className="cabinet-card" onClick={() => setActiveSection('cart')}>
                                <div className="cabinet-card-icon"><ShoppingCart size={32} /></div>
                                <h3>Корзина</h3>
                                <p>Текущий заказ</p>
                            </div>

                             {/* Orders */}
                             <div className="cabinet-card" onClick={() => setActiveSection('orders')}>
                                <div className="cabinet-card-icon"><Package size={32} /></div>
                                <h3>Мои заказы</h3>
                                <p>История и статус заказов</p>
                            </div>

                            {/* Debts */}
                            <div className="cabinet-card" onClick={() => setActiveSection('debts')}>
                                <div className="cabinet-card-icon"><CreditCard size={32} /></div>
                                <h3>Задолженность</h3>
                                <p>Баланс и лимиты (1C)</p>
                            </div>

                            {/* Documents */}
                            <div className="cabinet-card" onClick={() => setActiveSection('documents')}>
                                <div className="cabinet-card-icon"><FileText size={32} /></div>
                                <h3>Документы</h3>
                                <p>Счета и накладные</p>
                            </div>

                            {/* Certificates */}
                            <div className="cabinet-card" onClick={() => setActiveSection('certificates')}>
                                <div className="cabinet-card-icon"><FileCheck size={32} /></div>
                                <h3>Сертификаты</h3>
                                <p>Скачать сертификаты качества</p>
                            </div>

                            {/* Promotions */}
                            <div className="cabinet-card" onClick={() => setActiveSection('promotions')}>
                                <div className="cabinet-card-icon"><Percent size={32} /></div>
                                <h3>Акции</h3>
                                <p>Специальные предложения</p>
                            </div>

                            {/* Claims */}
                            <div className="cabinet-card" onClick={() => setActiveSection('claims')}>
                                <div className="cabinet-card-icon"><AlertCircle size={32} /></div>
                                <h3>Претензии</h3>
                                <p>Оформить возврат или брак</p>
                            </div>

                            {/* Settings */}
                            <div
                                className="cabinet-card cabinet-card-active"
                                onClick={() => setShowSettings(true)}
                            >
                                <div className="cabinet-card-icon">
                                    <Settings size={32} />
                                </div>
                                <h3>Настройки</h3>
                                <p>Профиль и оформление</p>
                                <ChevronRight className="card-arrow" size={20} />
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* General Section Modal */}
            {activeSection && (
                <div className="settings-overlay" onClick={() => setActiveSection(null)}>
                    <div className="settings-modal section-modal" onClick={e => e.stopPropagation()}>
                        <div className="settings-header">
                            <h2>{getSectionTitle()}</h2>
                            <button className="close-btn" onClick={() => setActiveSection(null)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="section-modal-content">
                            {renderSectionContent()}
                        </div>
                    </div>
                </div>
            )}

            {/* Settings Modal */}
            {showSettings && (
                <div className="settings-overlay" onClick={() => setShowSettings(false)}>
                    <div className="settings-modal" onClick={e => e.stopPropagation()}>
                        <div className="settings-header">
                            <h2>Настройки</h2>
                            <button className="close-btn" onClick={() => setShowSettings(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="settings-content">
                            <div className="settings-sidebar">
                                <button
                                    className={`settings-tab ${activeSettingsTab === 'profile' ? 'active' : ''}`}
                                    onClick={() => setActiveSettingsTab('profile')}
                                >
                                    <User size={20} />
                                    <span>Профиль</span>
                                </button>
                                <button
                                    className={`settings-tab ${activeSettingsTab === 'theme' ? 'active' : ''}`}
                                    onClick={() => setActiveSettingsTab('theme')}
                                >
                                    <Palette size={20} />
                                    <span>Тема оформления</span>
                                </button>
                                <button
                                    className={`settings-tab ${activeSettingsTab === 'notifications' ? 'active' : ''}`}
                                    onClick={() => setActiveSettingsTab('notifications')}
                                >
                                    <Bell size={20} />
                                    <span>Уведомления</span>
                                </button>
                                <button
                                    className={`settings-tab ${activeSettingsTab === 'security' ? 'active' : ''}`}
                                    onClick={() => setActiveSettingsTab('security')}
                                >
                                    <Shield size={20} />
                                    <span>Безопасность</span>
                                </button>
                            </div>

                            <div className="settings-main">
                                {/* Profile Tab */}
                                {activeSettingsTab === 'profile' && (
                                    <div className="settings-section">
                                        <h3>Информация профиля</h3>
                                        <p className="settings-description">
                                            Обновите информацию о вашем профиле
                                        </p>

                                        <div className="profile-form">
                                            <div className="form-group">
                                                <label>
                                                    <User size={16} />
                                                    Имя
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profile.name}
                                                    onChange={(e) => handleProfileChange('name', e.target.value)}
                                                    placeholder="Введите имя"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>
                                                    <Building size={16} />
                                                    Компания
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profile.company}
                                                    onChange={(e) => handleProfileChange('company', e.target.value)}
                                                    placeholder="Название компании"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>
                                                    <Mail size={16} />
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={profile.email}
                                                    onChange={(e) => handleProfileChange('email', e.target.value)}
                                                    placeholder="email@example.com"
                                                />
                                            </div>

                                            <div className="form-group">
                                                <label>
                                                    <Phone size={16} />
                                                    Телефон
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={profile.phone}
                                                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                                                    placeholder="+998 (99) 123-45-67"
                                                />
                                            </div>

                                            <button className="save-btn">
                                                Сохранить изменения
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Theme Tab */}
                                {activeSettingsTab === 'theme' && (
                                    <div className="settings-section">
                                        <h3>Тема оформления</h3>
                                        <p className="settings-description">
                                            Выберите тему, которая вам больше нравится
                                        </p>

                                        <div className="theme-grid">
                                            {Object.entries(themes).map(([key, value]) => (
                                                <div
                                                    key={key}
                                                    className={`theme-card ${theme === key ? 'active' : ''}`}
                                                    onClick={() => setTheme(key)}
                                                    style={{ '--theme-color': value.primary }}
                                                >
                                                    <div className="theme-preview" data-theme-preview={key}>
                                                        <div className="theme-preview-header"></div>
                                                        <div className="theme-preview-content">
                                                            <div className="theme-preview-sidebar"></div>
                                                            <div className="theme-preview-main"></div>
                                                        </div>
                                                    </div>
                                                    <div className="theme-info">
                                                        <span className="theme-icon">{value.icon}</span>
                                                        <span className="theme-name">{value.name}</span>
                                                        {theme === key && (
                                                            <Check size={18} className="theme-check" />
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Notifications Tab */}
                                {activeSettingsTab === 'notifications' && (
                                    <div className="settings-section">
                                        <h3>Уведомления</h3>
                                        <p className="settings-description">
                                            Настройте, какие уведомления вы хотите получать
                                        </p>

                                        <div className="notification-options">
                                            <div className="notification-item">
                                                <div className="notification-info">
                                                    <h4>Email уведомления</h4>
                                                    <p>Получать уведомления на email</p>
                                                </div>
                                                <label className="toggle">
                                                    <input type="checkbox" defaultChecked />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </div>

                                            <div className="notification-item">
                                                <div className="notification-info">
                                                    <h4>Новости и акции</h4>
                                                    <p>Информация о скидках и новых товарах</p>
                                                </div>
                                                <label className="toggle">
                                                    <input type="checkbox" />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </div>

                                            <div className="notification-item">
                                                <div className="notification-info">
                                                    <h4>Статус заказа</h4>
                                                    <p>Уведомления об изменении статуса заказа</p>
                                                </div>
                                                <label className="toggle">
                                                    <input type="checkbox" defaultChecked />
                                                    <span className="toggle-slider"></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Security Tab */}
                                {activeSettingsTab === 'security' && (
                                    <div className="settings-section">
                                        <h3>Безопасность</h3>
                                        <p className="settings-description">
                                            Управление паролем и безопасностью аккаунта
                                        </p>

                                        <div className="security-options">
                                            <div className="security-item">
                                                <div className="security-info">
                                                    <h4>Изменить пароль</h4>
                                                    <p>Рекомендуется менять пароль каждые 3 месяца</p>
                                                </div>
                                                <button className="security-btn">Изменить</button>
                                            </div>

                                            <div className="security-item">
                                                <div className="security-info">
                                                    <h4>Двухфакторная аутентификация</h4>
                                                    <p>Дополнительный уровень защиты аккаунта</p>
                                                </div>
                                                <span className="security-badge">Скоро</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CabinetPage;

