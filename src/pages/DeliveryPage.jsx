import React from 'react';
import { Truck, Package, Thermometer, Clock, MapPin, Shield } from 'lucide-react';
import Navbar from './Navbar';

const DeliveryPage = () => {
    return (
        <>
            <Navbar />

            <main className="page-content">
                {/* Page Header */}
                <section className="page-header">
                    <div className="container">
                        <h1>Доставка</h1>
                        <p>Оперативная логистика по всему Узбекистану</p>
                    </div>
                </section>

                {/* Delivery Options */}
                <section className="section">
                    <div className="container">
                        <div className="delivery-page-grid">
                            <div className="delivery-feature">
                                <div className="delivery-icon">
                                    <Truck size={40} />
                                </div>
                                <h3>Быстрая доставка</h3>
                                <p>
                                    Отправка заказов в течение 24 часов после подтверждения.
                                    Собственный автопарк для оперативной доставки в регионы.
                                </p>
                            </div>

                            <div className="delivery-feature">
                                <div className="delivery-icon">
                                    <Package size={40} />
                                </div>
                                <h3>Надежная упаковка</h3>
                                <p>
                                    Специализированная тара для безопасной транспортировки
                                    медицинских препаратов. Защита от повреждений и внешних воздействий.
                                </p>
                            </div>

                            <div className="delivery-feature">
                                <div className="delivery-icon">
                                    <Thermometer size={40} />
                                </div>
                                <h3>Температурный режим</h3>
                                <p>
                                    Соблюдение холодовой цепи +2...+8°C для термолабильных препаратов.
                                    Рефрижераторный транспорт и термоконтейнеры.
                                </p>
                            </div>

                            <div className="delivery-feature">
                                <div className="delivery-icon">
                                    <Clock size={40} />
                                </div>
                                <h3>Точно в срок</h3>
                                <p>
                                    Четкое соблюдение сроков поставки. Отслеживание груза
                                    на всех этапах доставки.
                                </p>
                            </div>

                            <div className="delivery-feature">
                                <div className="delivery-icon">
                                    <MapPin size={40} />
                                </div>
                                <h3>Весь Узбекистан</h3>
                                <p>
                                    Доставка в любой регион Узбекистана. Работаем с транспортными
                                    компаниями и собственной логистической сетью.
                                </p>
                            </div>

                            <div className="delivery-feature">
                                <div className="delivery-icon">
                                    <Shield size={40} />
                                </div>
                                <h3>Страхование груза</h3>
                                <p>
                                    Все грузы застрахованы. Полная материальная ответственность
                                    до момента передачи товара.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Delivery Terms */}
                <section className="section section-alt">
                    <div className="container">
                        <h2 className="section-title">Условия доставки</h2>
                        <div className="terms-grid">
                            <div className="term-card">
                                <h4>Ташкент и область</h4>
                                <p className="term-time">День в день</p>
                                <p>Бесплатная доставка при заказе от 5 000 000 сум</p>
                            </div>
                            <div className="term-card">
                                <h4>Самарканд, Бухара, Навои</h4>
                                <p className="term-time">1-2 рабочих дня</p>
                                <p>Бесплатная доставка при заказе от 10 000 000 сум</p>
                            </div>
                            <div className="term-card">
                                <h4>Другие регионы</h4>
                                <p className="term-time">2-3 рабочих дня</p>
                                <p>Стоимость рассчитывается индивидуально</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default DeliveryPage;
