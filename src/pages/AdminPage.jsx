import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import {
    Users,
    UserPlus,
    LogOut,
    Search,
    Edit,
    Trash2,
    Check,
    X,
    Shield,
    BarChart3,
    Activity,
    RefreshCw,
    Eye,
    EyeOff,
    Loader2,
    Package,
    Plus,
    Tag,
    AlertCircle,
    LayoutGrid
} from 'lucide-react';
import Navbar from './Navbar';
import './AdminPage.css';

const AdminPage = () => {
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const navigate = useNavigate();

    // State
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);

    // Search
    const [searchTerm, setSearchTerm] = useState('');

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // For details popup


    // Messages
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Forms
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        companyName: '',
        contactPerson: '',
        phone: '',
        address: '',
        role: 'client' // client, admin, developer
    });



    // Check admin access
    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            navigate('/login');
        }
    }, [isAuthenticated, isAdmin, navigate]);

    // Load data
    useEffect(() => {
        if (isAdmin) {
            loadData();
        }
    }, [isAdmin]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes] = await Promise.all([
                adminAPI.getStats(),
                adminAPI.getUsers()
            ]);

            setStats(statsRes.stats);
            setUsers(usersRes.users || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // User Actions
    const handleCreateUser = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await adminAPI.createUser(newUser);
            setSuccessMessage('Пользователь успешно создан!');
            setShowCreateModal(false);
            setNewUser({ email: '', password: '', companyName: '', contactPerson: '', phone: '', address: '', role: 'client' });
            loadData();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleToggleUserActive = async (userId, currentState) => {
        try {
            await adminAPI.updateUser(userId, { isActive: !currentState });
            loadData();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Вы уверены, что хотите деактивировать этого пользователя?')) {
            try {
                await adminAPI.deleteUser(userId);
                loadData();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Filtering
    const filteredUsers = users.filter(u =>
        u.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );



    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin':
                return <span className="role-badge admin"><Shield size={14} /> Администратор</span>;
            case 'developer':
                return <span className="role-badge manager"><Activity size={14} /> Разработчик</span>;
            default:
                return <span className="role-badge client"><Users size={14} /> Клиент</span>;
        }
    };

    if (!isAdmin) return null;

    return (
        <>
            <Navbar />
            <main className="page-content admin-page">
                {/* Admin Header */}
                <section className="admin-header">
                    <div className="container">
                        <div className="admin-header-content">
                            <div className="admin-title">
                                <Shield size={32} />
                                <div>
                                    <h1>Панель управления</h1>
                                    <p>
                                        {user?.role === 'admin' && 'Полный доступ'}
                                        {user?.role === 'manager' && 'Управление контентом'}
                                        {user?.role === 'hr' && 'Управление пользователями'}
                                    </p>
                                </div>
                            </div>
                            <div className="admin-header-actions">
                                <div className="admin-user-info">
                                    <span className="admin-email">{user?.email}</span>
                                    <span className="admin-role-chip">Администратор</span>
                                </div>
                                <button onClick={handleLogout} className="admin-logout-btn">
                                    <LogOut size={18} />
                                    Выйти
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Cards */}
                {stats && (
                    <section className="admin-stats">
                        <div className="container">
                            <div className="stats-cards">
                                <div className="stat-card">
                                    <Users size={24} />
                                    <div>
                                        <span className="stat-value">{stats.totalPartners}</span>
                                        <span className="stat-label">Клиентов</span>
                                    </div>
                                </div>
                                <div className="stat-card active">
                                    <Package size={24} />
                                    <div>
                                        <span className="stat-value">{stats.totalProducts}</span>
                                        <span className="stat-label">Товаров</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {/* Main Content Area */}
                <section className="admin-content">
                    <div className="container">
                        {/* Messages */}
                        {error && <div className="admin-error">{error}</div>}
                        {successMessage && <div className="admin-success">{successMessage}</div>}

                        {/* Tabs */}
                        {/* Tabs Removed - Only Users */}
                        <div className="admin-tabs">
                            <button className="admin-tab active">
                                <Users size={18} />
                                Пользователи
                            </button>
                        </div>

                        {/* Toolbar */}
                        <div className="admin-toolbar">
                            <div className="search-box">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Поиск пользователей..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button onClick={loadData} className="refresh-btn" title="Обновить">
                                <RefreshCw size={18} />
                            </button>

                            <button onClick={() => setShowCreateModal(true)} className="create-btn">
                                <UserPlus size={18} />
                                Добавить пользователя
                            </button>
                        </div>

                        {/* Content */}
                        {loading ? (
                            <div className="loading-state">
                                <Loader2 size={48} className="spin" />
                                <p>Загрузка данных...</p>
                            </div>
                        ) : (
                            <div className="admin-table-wrapper">
                                <table className="users-table">
                                    <thead>
                                        <tr>
                                            <th>Роль</th>
                                            <th>Компания / Имя</th>
                                            <th>Email</th>
                                            <th>Контакты</th>
                                            <th>Статус</th>
                                            <th>Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.length === 0 ? (
                                            <tr><td colSpan="6" className="empty-state">Пользователи не найдены</td></tr>
                                        ) : (
                                            filteredUsers.map(u => (
                                                <tr key={u.id}>
                                                    <td>{getRoleBadge(u.role)}</td>
                                                    <td>
                                                        <div className="user-name">{u.companyName}</div>
                                                        {u.contactPerson && <div className="user-sub">{u.contactPerson}</div>}
                                                    </td>
                                                    <td>{u.email}</td>
                                                    <td>{u.phone || '-'}</td>
                                                    <td>
                                                        <span className={`status-badge ${u.isActive ? 'active' : 'inactive'}`}>
                                                            {u.isActive ? 'Активен' : 'Отключен'}
                                                        </span>
                                                    </td>
                                                    <td className="actions-cell">
                                                        <button
                                                            className="action-btn edit"
                                                            onClick={() => setSelectedUser(u)}
                                                            title="Подробнее"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleUserActive(u.id, u.isActive)}
                                                            className={`action-btn ${u.isActive ? 'deactivate' : 'activate'}`}
                                                            title={u.isActive ? 'Отключить' : 'Включить'}
                                                        >
                                                            {u.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(u.id)}
                                                            className="action-btn delete"
                                                            title="Удалить"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>


                            </div>
                        )}
                    </div>
                </section>

                {/* Create User Modal */}
                {showCreateModal && (
                    <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Новый пользователь</h3>
                                <button onClick={() => setShowCreateModal(false)} className="close-btn"><X size={24} /></button>
                            </div>
                            <form onSubmit={handleCreateUser} className="modal-form">
                                <div className="form-group">
                                    <label>Роль доступа *</label>
                                    <select
                                        value={newUser.role}
                                        onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                        className="role-select"
                                    >
                                        <option value="client">Клиент</option>
                                        <option value="developer">Разработчик</option>
                                        <option value="admin">Администратор</option>
                                    </select>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Email *</label>
                                        <input
                                            type="email"
                                            required
                                            value={newUser.email}
                                            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                            placeholder="user@example.com"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Пароль *</label>
                                        <input
                                            type="text"
                                            required
                                            value={newUser.password}
                                            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                            placeholder="Пароль"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Название / Имя *</label>
                                    <input
                                        type="text"
                                        required
                                        value={newUser.companyName}
                                        onChange={e => setNewUser({ ...newUser, companyName: e.target.value })}
                                        placeholder="Название компании или Имя"
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Контактное лицо</label>
                                        <input
                                            type="text"
                                            value={newUser.contactPerson}
                                            onChange={e => setNewUser({ ...newUser, contactPerson: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Телефон</label>
                                        <input
                                            type="tel"
                                            value={newUser.phone}
                                            onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" onClick={() => setShowCreateModal(false)} className="btn-cancel">Отмена</button>
                                    <button type="submit" className="btn-create"><UserPlus size={18} /> Создать</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}


                {/* User Details Modal */}
                {selectedUser && (
                    <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Информация о пользователе</h3>
                                <button onClick={() => setSelectedUser(null)} className="close-btn"><X size={24} /></button>
                            </div>
                            <div className="modal-body user-details">
                                <div className="detail-row">
                                    <strong>ID:</strong> <span>{selectedUser.id}</span>
                                </div>
                                <div className="detail-row">
                                    <strong>Роль:</strong> <span>{getRoleBadge(selectedUser.role)}</span>
                                </div>
                                <div className="detail-row">
                                    <strong>Email:</strong> <span>{selectedUser.email}</span>
                                </div>
                                <div className="detail-row">
                                    <strong>Компания:</strong> <span>{selectedUser.companyName}</span>
                                </div>
                                <div className="detail-row">
                                    <strong>Контакт:</strong> <span>{selectedUser.contactPerson}</span>
                                </div>
                                <div className="detail-row">
                                    <strong>Телефон:</strong> <span>{selectedUser.phone}</span>
                                </div>
                                <div className="detail-row">
                                    <strong>Адрес:</strong> <span>{selectedUser.address || '-'}</span>
                                </div>
                                <div className="detail-row">
                                    <strong>Регистрация:</strong> <span>{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-row">
                                    <strong>Последний вход:</strong> <span>{selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Никогда'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
};

export default AdminPage;