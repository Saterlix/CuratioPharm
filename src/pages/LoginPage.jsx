import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, LogIn, Mail, Loader2 } from 'lucide-react';
import Navbar from './Navbar';
import './LoginPage.css';

const LoginPage = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login: loginUser, isAuthenticated, user, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    // If already logged in, redirect to cabinet
    React.useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'admin') {
                navigate('/cp-admin-panel');
            } else if (user.role === 'developer') {
                navigate('/developer-panel');
            } else {
                navigate('/cabinet');
            }
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await loginUser(login, password);

        if (result.success) {
            // Navigation handled by useEffect
        } else {
            setError(result.error || 'Неверный логин или пароль');
        }

        setLoading(false);
    };

    if (authLoading) {
        return (
            <>
                <Navbar />
                <main className="page-content">
                    <section className="login-section">
                        <div className="login-container">
                            <div className="login-card">
                                <div className="login-loading">
                                    <Loader2 size={48} className="spin" />
                                    <p>Загрузка...</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="page-content">
                <section className="login-section">
                    <div className="login-container">
                        <div className="login-card">
                            <div className="login-header">
                                <div className="login-icon">
                                    <Lock size={32} />
                                </div>
                                <h1>Личный кабинет</h1>
                                <p>Введите логин и пароль для входа</p>
                            </div>

                            <form onSubmit={handleSubmit} className="login-form" autoComplete="off">
                                {error && (
                                    <div className="login-error">
                                        {error}
                                    </div>
                                )}

                                <div className="login-field">
                                    <label>
                                        <Lock size={18} />
                                        Логин
                                    </label>
                                    <input
                                        type="text"
                                        value={login}
                                        onChange={(e) => setLogin(e.target.value)}
                                        placeholder="demo@apteka.uz"
                                        required
                                        disabled={loading}
                                        autoComplete="new-password"
                                        name="login_field_random"
                                    />
                                </div>

                                <div className="login-field">
                                    <label>
                                        <Lock size={18} />
                                        Пароль
                                    </label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Введите пароль"
                                        required
                                        disabled={loading}
                                        autoComplete="new-password"
                                        name="password_field_random"
                                    />
                                </div>

                                <button type="submit" className="login-button" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 size={20} className="spin" />
                                            Вход...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn size={20} />
                                            Войти
                                        </>
                                    )}
                                </button>

                                <div className="login-help">
                                    <p>Нет учетной записи?</p>
                                    <div className="contact-support">
                                        <p>Для получения доступа свяжитесь с нами:</p>
                                        <a href="tel:+998712078899">+998 71 207-88-99</a>
                                    </div>
                                </div>

                                <p className="login-demo-hint">
                                    Демо: demo@apteka.uz / Demo2024!
                                </p>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default LoginPage;
