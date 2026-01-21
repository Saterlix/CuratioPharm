import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.scss';
import navbarVideo from '../assets/Navber-video.mp4';

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

    // Opacity для видео - начинает исчезать только после 70% скролла
    const videoOpacity = scrollProgress < 0.7 ? 1 : 1 - ((scrollProgress - 0.7) / 0.3);

    return (
        <>
            {/* Navbar с видео внутри */}
            <nav
                ref={navRef}
                className={`navbar ${isFullyCollapsed || !isHomePage ? 'scrolled' : ''} ${isHomePage ? 'hero-navbar' : ''}`}
                style={{
                    height: isHomePage ? `${currentHeight}px` : `${minHeight}px`,
                }}
            >
                {/* Video Background - Only on Home Page */}
                {isHomePage && (
                    <>
                        <video
                            className="navbar-video"
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{ opacity: videoOpacity }}
                        >
                            <source src={navbarVideo} type="video/mp4" />
                        </video>
                        <div
                            className="navbar-video-overlay"
                            style={{ opacity: videoOpacity }}
                        ></div>

                        {/* Hero Content - фейдится при скролле */}
                        <div
                            className="hero-content"
                            style={{
                                opacity: 1 - scrollProgress * 1.5,
                                transform: `translate(-50%, calc(-50% + ${scrollProgress * 50}px))`,
                                pointerEvents: scrollProgress > 0.5 ? 'none' : 'auto',
                            }}
                        >
                            <h1>Curatio Pharm</h1>
                            <p>Оптовая фармацевтическая компания</p>
                            <Link to="/about" className="hero-cta">Подробнее</Link>
                        </div>
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

                    <div className="navbar-actions">
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
