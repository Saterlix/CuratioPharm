import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>Curatio<span>Pharm</span></h3>
                        <p>Оптовая фармацевтическая компания с современным складским комплексом 1500 м²</p>
                        <div className="footer-badges">
                            <div className="badge">
                                <Shield size={16} />
                                <span>Лицензия</span>
                            </div>
                            <div className="badge">
                                <Award size={16} />
                                <span>ISO 9001</span>
                            </div>
                        </div>
                    </div>
                    <div className="footer-nav">
                        <h4>Навигация</h4>
                        <Link to="/about">О компании</Link>
                        <Link to="/products">Продукция</Link>
                        <Link to="/delivery">Доставка</Link>
                        <Link to="/contacts">Контакты</Link>
                    </div>
                    <div className="footer-nav">
                        <h4>Услуги</h4>
                        <Link to="/products">Оптовые поставки</Link>
                        <Link to="/contacts">Индивидуальные условия</Link>
                        <Link to="/contacts">Консультации</Link>
                        <Link to="/contacts">Личный кабинет</Link>
                    </div>
                    <div className="footer-contact">
                        <h4>Контакты</h4>
                        <p>+998 71 207-88-99</p>
                        <p>info@cpharm.uz</p>
                        <p>г. Ташкент, ул. Карим Зарипова, 3А</p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2024 ООО "Curatio Pharm". Все права защищены.</p>
                    <div className="footer-legal">
                        <a href="#">Политика конфиденциальности</a>
                        <a href="#">Пользовательское соглашение</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
