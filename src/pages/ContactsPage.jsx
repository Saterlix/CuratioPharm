import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Navbar from './Navbar';

const ContactsPage = () => {
    return (
        <>
            <Navbar />

            <main className="page-content">
                {/* Page Header */}
                <section className="page-header">
                    <div className="container">
                        <h1>Контакты</h1>
                        <p>Свяжитесь с нами любым удобным способом</p>
                    </div>
                </section>

                {/* Contacts Grid */}
                <section className="section">
                    <div className="container">
                        <div className="contacts-page-grid">
                            <div className="contact-info-full">
                                <h3>Контактная информация</h3>

                                <div className="contact-block">
                                    <div className="contact-icon-wrapper">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4>Адрес</h4>
                                        <p>г. Ташкент, Юнус-Абадский р-н</p>
                                        <p>ул. Карим Зарипова, 3А</p>
                                    </div>
                                </div>

                                <div className="contact-block">
                                    <div className="contact-icon-wrapper">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <h4>Телефоны</h4>
                                        <p><strong>+998 71 207-88-99</strong> — Отдел продаж</p>
                                        <p>+998 71 207-01-52 — Офис</p>
                                    </div>
                                </div>

                                <div className="contact-block">
                                    <div className="contact-icon-wrapper">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h4>Email</h4>
                                        <p>info@cpharm.uz</p>
                                    </div>
                                </div>

                                <div className="contact-block">
                                    <div className="contact-icon-wrapper">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h4>Режим работы</h4>
                                        <p>Пн-Пт: 9:00 - 18:00</p>
                                        <p>Сб-Вс: Выходные дни</p>
                                    </div>
                                </div>
                            </div>

                            <div className="contact-form-full">
                                <h3>Оставить заявку</h3>
                                <p className="form-description">
                                    Заполните форму и наш менеджер свяжется с вами в течение рабочего дня
                                </p>
                                <form>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Ваше имя *</label>
                                            <input type="text" placeholder="Иван Иванов" required />
                                        </div>
                                        <div className="form-group">
                                            <label>Компания</label>
                                            <input type="text" placeholder="ООО Аптека" />
                                        </div>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label>Email *</label>
                                            <input type="email" placeholder="email@example.com" required />
                                        </div>
                                        <div className="form-group">
                                            <label>Телефон *</label>
                                            <input type="tel" placeholder="+998 (99) 123-45-67" required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Тема обращения</label>
                                        <select>
                                            <option>Общий вопрос</option>
                                            <option>Сотрудничество</option>
                                            <option>Заказ продукции</option>
                                            <option>Техническая поддержка</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Сообщение</label>
                                        <textarea rows="5" placeholder="Опишите ваш вопрос..."></textarea>
                                    </div>
                                    <button type="submit" className="btn-primary btn-large">
                                        Отправить заявку
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Map Section */}
                <section className="section section-alt">
                    <div className="container">
                        <h2 className="section-title">Наше расположение</h2>
                        <p className="section-subtitle">Приезжайте к нам по указанному адресу</p>

                        <div className="map-container">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2997.0!2d69.2289!3d41.3385!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b00e7c0a5ad%3A0x1!2zNDHCsDIwJzE4LjYiTiA2OcKwMTMnNDQuMCJF!5e0!3m2!1sru!2s!4v1702800000000"
                                width="100%"
                                height="450"
                                style={{ border: 0, borderRadius: '16px' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="CuratioPharm - Ташкент"
                            ></iframe>
                        </div>

                        <div className="map-info">
                            <div className="map-info-item">
                                <MapPin size={20} />
                                <span>г. Ташкент, Юнус-Абадский р-н, ул. Карим Зарипова, 3А</span>
                            </div>
                            <div className="map-info-item">
                                <Clock size={20} />
                                <span>Пн-Пт: 9:00 - 18:00</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default ContactsPage;

