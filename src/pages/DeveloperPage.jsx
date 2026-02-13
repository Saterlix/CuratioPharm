import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { developerAPI, adminAPI } from '../services/api'; // Reuse adminAPI for user management if allowed
import {
    Users,
    LogOut,
    Search,
    Shield,
    Settings,
    Save,
    Bot,
    Loader2,
    Eye,
    EyeOff,
    CheckCircle,
    Activity,
    Database,
    FileText,
    Clock
} from 'lucide-react';
import Navbar from './Navbar';
import './AdminPage.css'; // Reuse Admin styles

const DeveloperPage = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users'); // 'users', 'integrations', 'system', 'logs'

    // Data
    const [users, setUsers] = useState([]);
    const [systemInfo, setSystemInfo] = useState(null);
    const [logs, setLogs] = useState([]);
    const [settings, setSettings] = useState({
        telegram_bot_token: '',
        telegram_support_chat_id: ''
    });

    // Search
    const [searchTerm, setSearchTerm] = useState('');

    // Messages
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [saving, setSaving] = useState(false);

    // Selected User for details
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'developer') {
            navigate('/login');
        } else {
            loadData();
        }
    }, [isAuthenticated, user, navigate, activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'users') {
                const data = await developerAPI.getUsers(); // Get all users
                setUsers(data.users || []);
            } else if (activeTab === 'integrations') {
                const data = await developerAPI.getSettings();
                const newSettings = {};
                data.settings.forEach(s => {
                    newSettings[s.key] = s.value;
                });
                setSettings(prev => ({ ...prev, ...newSettings }));
            } else if (activeTab === 'system') {
                const data = await developerAPI.getSystemInfo();
                setSystemInfo(data);
            } else if (activeTab === 'logs') {
                const data = await developerAPI.getLogs();
                setLogs(data.logs || []);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccessMessage('');

        try {
            const settingsToSave = [
                { key: 'telegram_bot_token', value: settings.telegram_bot_token },
                { key: 'telegram_support_chat_id', value: settings.telegram_support_chat_id }
            ];

            await developerAPI.updateSettings(settingsToSave);
            setSuccessMessage('Настройки сохранены. Бот перезапускается...');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Filter Users
    const filteredUsers = users.filter(u =>
        u.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleBadge = (role) => {
        if (role === 'admin') return <span className="role-badge admin"><Shield size={14} /> Администратор</span>;
        if (role === 'developer') return <span className="role-badge manager"><Bot size={14} /> Разработчик</span>;
        return <span className="role-badge client"><Users size={14} /> Клиент</span>;
    };

    return (
        <>
            <Navbar />
            <main className="page-content admin-page">
                {/* Header */}
                <section className="admin-header" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}>
                    <div className="container">
                        <div className="admin-header-content">
                            <div className="admin-title">
                                <Settings size={32} />
                                <div>
                                    <h1>Панель разработчика</h1>
                                    <p>Техническое управление и интеграции</p>
                                </div>
                            </div>
                            <div className="admin-header-actions">
                                <div className="admin-user-info">
                                    <span className="admin-email">{user?.email}</span>
                                    <span className="admin-role-chip">Разработчик</span>
                                </div>
                                <button onClick={handleLogout} className="admin-logout-btn">
                                    <LogOut size={18} /> Выйти
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="admin-content">
                    <div className="container">
                        {error && <div className="admin-error">{error}</div>}
                        {successMessage && <div className="admin-success">{successMessage}</div>}

                        {/* Tabs */}
                        <div className="admin-tabs">
                            <button
                                className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
                                onClick={() => setActiveTab('users')}
                            >
                                <Users size={18} /> Пользователи
                            </button>
                            <button
                                className={`admin-tab ${activeTab === 'integrations' ? 'active' : ''}`}
                                onClick={() => setActiveTab('integrations')}
                            >
                                <Bot size={18} /> Интеграции
                            </button>
                            <button
                                className={`admin-tab ${activeTab === 'system' ? 'active' : ''}`}
                                onClick={() => setActiveTab('system')}
                            >
                                <Activity size={18} /> Система
                            </button>
                            <button
                                className={`admin-tab ${activeTab === 'logs' ? 'active' : ''}`}
                                onClick={() => setActiveTab('logs')}
                            >
                                <FileText size={18} /> Логи
                            </button>
                        </div>

                        {loading ? (
                            <div className="loading-state">
                                <Loader2 size={48} className="spin" />
                                <p>Загрузка...</p>
                            </div>
                        ) : (
                            <>
                                {activeTab === 'users' && (
                                    <div className="admin-table-wrapper">
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
                                        </div>
                                        <table className="users-table">
                                            <thead>
                                                <tr>
                                                    <th>Роль</th>
                                                    <th>Компания</th>
                                                    <th>Email</th>
                                                    <th>Контакты</th>
                                                    <th>Действия</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredUsers.map(u => (
                                                    <tr key={u.id}>
                                                        <td>{getRoleBadge(u.role)}</td>
                                                        <td>{u.companyName}</td>
                                                        <td>{u.email}</td>
                                                        <td>{u.phone || '-'}</td>
                                                        <td className="actions-cell">
                                                            <button
                                                                className="action-btn edit"
                                                                onClick={() => setSelectedUser(u)}
                                                                title="Подробнее"
                                                            >
                                                                <Eye size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {activeTab === 'integrations' && (
                                    <div className="integration-card">
                                        <div className="card-header">
                                            <h3><Bot size={24} /> Telegram Бот Поддержки</h3>
                                            <p>Настройте бота для автоматической обработки запросов и пересылки сообщений в группу поддержки.</p>
                                        </div>
                                        <form onSubmit={handleSaveSettings} className="integration-form">
                                            <div className="form-group">
                                                <label>Token Бота</label>
                                                <input
                                                    type="text"
                                                    value={settings.telegram_bot_token}
                                                    onChange={e => setSettings({ ...settings, telegram_bot_token: e.target.value })}
                                                    placeholder="123456789:ABCdefGHIjklMNOpqrs..."
                                                />
                                                <small>Получите токен у @BotFather</small>
                                            </div>
                                            <div className="form-group">
                                                <label>Chat ID Группы Поддержки</label>
                                                <input
                                                    type="text"
                                                    value={settings.telegram_support_chat_id}
                                                    onChange={e => setSettings({ ...settings, telegram_support_chat_id: e.target.value })}
                                                    placeholder="-100123456789"
                                                />
                                                <small>ID группы, куда будут пересылаться сообщения (добавьте бота в группу и сделайте админом)</small>
                                            </div>
                                            <button type="submit" className="save-btn" disabled={saving}>
                                                {saving ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
                                                Сохранить настройки
                                            </button>
                                        </form>
                                    </div>
                                )}

                                {activeTab === 'system' && systemInfo && (
                                    <div className="system-info-grid">
                                        <div className="system-card">
                                            <div className="sys-icon"><Activity size={24} /></div>
                                            <div className="sys-data">
                                                <span className="sys-label">Node версия</span>
                                                <span className="sys-value">{systemInfo.nodeVersion}</span>
                                            </div>
                                        </div>
                                        <div className="system-card">
                                            <div className="sys-icon"><Settings size={24} /></div>
                                            <div className="sys-data">
                                                <span className="sys-label">Платформа</span>
                                                <span className="sys-value">{systemInfo.platform} ({systemInfo.arch})</span>
                                            </div>
                                        </div>
                                        <div className="system-card">
                                            <div className="sys-icon"><Clock size={24} /></div>
                                            <div className="sys-data">
                                                <span className="sys-label">Uptime сервера</span>
                                                <span className="sys-value">{Math.floor(systemInfo.uptime / 60)} мин.</span>
                                            </div>
                                        </div>
                                        <div className="system-card">
                                            <div className="sys-icon"><Database size={24} /></div>
                                            <div className="sys-data">
                                                <span className="sys-label">Память (Heap)</span>
                                                <span className="sys-value">{systemInfo.memory?.heapUsed} / {systemInfo.memory?.heapTotal}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'logs' && (
                                    <div className="admin-table-wrapper">
                                        <table className="users-table">
                                            <thead>
                                                <tr>
                                                    <th>Время</th>
                                                    <th>Действие</th>
                                                    <th>Admin/Dev Email</th>
                                                    <th>IP</th>
                                                    <th>Детали</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {logs.length === 0 ? (
                                                    <tr><td colSpan="5" className="empty-state">Логов пока нет</td></tr>
                                                ) : (
                                                    logs.map(log => (
                                                        <tr key={log.id}>
                                                            <td>{new Date(log.created_at).toLocaleString()}</td>
                                                            <td><span className="log-action">{log.action}</span></td>
                                                            <td>{log.admin_email}</td>
                                                            <td>{log.ip_address}</td>
                                                            <td>{log.details}</td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </section>

                {/* User Details Modal */}
                {selectedUser && (
                    <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Информация о пользователе</h3>
                                <button onClick={() => setSelectedUser(null)} className="close-btn">×</button>
                            </div>
                            <div className="modal-body user-details">
                                <div className="detail-row">
                                    <strong>ID:</strong> <span>{selectedUser.id}</span>
                                </div>
                                <div className="detail-row">
                                    <strong>Роль:</strong> <span>{selectedUser.role}</span>
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
            <style jsx>{`
                .integration-card {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    max-width: 600px;
                }
                .card-header { margin-bottom: 2rem; }
                .card-header h3 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
                .card-header p { color: #64748b; }
                .integration-form { display: flex; flex-direction: column; gap: 1.5rem; }
                .save-btn {
                    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                    background: #3b82f6; color: white; padding: 0.75rem; border-radius: 8px;
                    border: none; font-weight: 500; cursor: pointer; transition: all 0.2s;
                }
                .save-btn:hover { background: #2563eb; }
                .user-details .detail-row {
                    display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9;
                }
                .user-details .detail-row:last-child { border-bottom: none; }

                .system-info-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 1.5rem;
                }
                .system-card {
                    background: white; padding: 1.5rem; border-radius: 12px;
                    display: flex; align-items: center; gap: 1rem;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }
                .sys-icon {
                    width: 48px; height: 48px; border-radius: 12px; background: #f0f9ff; color: #0284c7;
                    display: flex; align-items: center; justify-content: center;
                }
                .sys-data { display: flex; flex-direction: column; }
                .sys-label { font-size: 0.875rem; color: #64748b; }
                .sys-value { font-size: 1.125rem; font-weight: 600; color: #0f172a; }
                .log-action { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.85rem; }
            `}</style>
        </>
    );
};

export default DeveloperPage;
