import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.scss';

const Navbar = () => {
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user } = useAuth();
    const canAccessAdmin = ['admin', 'manager', 'hr'].includes(user?.role);
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const navRef = useRef(null);

    // Высота навбара: от 80vh до 70px
    const maxHeight = typeof window !== 'undefined' ? window.innerHeight * 0.8 : 600;
    const minHeight = 80;
    const scrollThreshold = maxHeight - minHeight;

    useEffect(() => {
        if (!isHomePage) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            // Прогресс от 0 до 1
            const progress = Math.min(scrollY / scrollThreshold, 1);
            setScrollProgress(progress);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Инициализация

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHomePage, scrollThreshold]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Вычисляем текущую высоту навбара
    const currentHeight = isHomePage
        ? maxHeight - (scrollProgress * (maxHeight - minHeight))
        : minHeight;

    // Определяем, когда навбар полностью свёрнут (для фона навбара)
    const isFullyCollapsed = scrollProgress > 0.95;

    // Opacity для фона - начинает исчезать только после 70% скролла
    const bgOpacity = scrollProgress < 0.7 ? 1 : 1 - ((scrollProgress - 0.7) / 0.3);

    // Pre-compute particle data ONCE so they don't re-randomize on every render
    const leafParticles = useMemo(() => {
        const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 15 : 30;
        return [...Array(count)].map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 15}s`,   // stagger over full 15s cycle
            animationDuration: `${12 + Math.random() * 8}s`, // 12-20s
            opacity: 0.3 + Math.random() * 0.4,
            className: `leaf-particle leaf-${i % 3}`
        }));
    }, []);

    return (
        <>
            {/* Import Elegant Fonts */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
                `}
            </style>

            {/* Navbar с видео внутри */}
            <nav
                ref={navRef}
                className={`navbar ${isFullyCollapsed || !isHomePage ? 'scrolled' : ''} ${isHomePage ? 'hero-navbar' : ''}`}
                style={{
                    height: isHomePage ? `${currentHeight}px` : `${minHeight}px`,
                    overflow: 'hidden', // КРИТИЧНО: ничего не должно выходить за край навбара
                }}
            >
                {/* Hero Background - Only on Home Page */}
                {isHomePage && (
                    <>
                        <div
                            className="navbar-animated-bg"
                            style={{
                                opacity: bgOpacity,
                                height: `${maxHeight}px`, // Фиксируем высоту! Не зависит от сжатия навбара
                                top: 0,
                            }}
                            aria-hidden="true"
                        >
                            {/* Animated Logo Container */}
                            <div className="hero-logo-container">
                                <div className="logo-wrapper">
                                    <img
                                        src="/logo.png"
                                        alt="CuratioPharm Logo"
                                        className="hero-logo-img"
                                    />
                                    {/* Shine removed */}
                                </div>

                                <div
                                    className="leaf-particles"
                                    style={{
                                        /* Убрали параллакс - он сдвигал контейнер за пределы навбара */
                                        opacity: Math.max(0, 1 - scrollProgress * 1.5)
                                    }}
                                >
                                    {leafParticles.map((p) => (
                                        <div
                                            key={p.id}
                                            className={p.className}
                                            style={{
                                                left: p.left,
                                                top: p.top,
                                                animationDelay: p.animationDelay,
                                                animationDuration: p.animationDuration,
                                                opacity: p.opacity
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid-overlay"></div>
                        </div>
                        <div
                            className="navbar-video-overlay"
                            style={{ opacity: bgOpacity }}
                        ></div>

                        {/* Hero Content - фейдится при скролле */}
                        {/* Hero Content removed to prevent overlap with Logo Animation */}
                        {/* <div className="hero-content">...</div> */}
                    </>
                )}

                {/* Navigation Bar */}
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo">
                        <span className="logo-text">Curatio</span>
                        <span className="logo-highlight">Pharm</span>
                    </Link>

                    <div className={`navbar-links ${isMobileMenuOpen ? 'active' : ''}`}>
                        <Link to="/about" onClick={() => setIsMobileMenuOpen(false)}>О нас</Link>
                        <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>Продукция</Link>
                        <Link to="/delivery" onClick={() => setIsMobileMenuOpen(false)}>Доставка</Link>
                        <Link to="/cooperation" onClick={() => setIsMobileMenuOpen(false)}>Сотрудничество</Link>
                        <Link to="/contacts" onClick={() => setIsMobileMenuOpen(false)}>Контакты</Link>
                        {canAccessAdmin && <Link to="/cp-admin-panel" onClick={() => setIsMobileMenuOpen(false)}>Админ панель</Link>}
                        <Link to="/login" className="cta-button mobile-only" onClick={() => setIsMobileMenuOpen(false)}>Личный кабинет</Link>
                    </div>

                    <div className="navbar-actions" style={{ zIndex: 1001 }}>
                        <Link to="/login" className="cta-button desktop-only">Личный кабинет</Link>
                        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
                            <div className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Spacer для контента - чтобы он не перекрывался навбаром */}
            {isHomePage && (
                <div
                    className="navbar-spacer"
                    style={{ height: `${maxHeight}px` }}
                />
            )}
        </>
    );
};

export default Navbar;
