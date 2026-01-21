import React from 'react';
import {
    Building2,
    Target,
    Award,
    Users,
    History,
    Trophy,
    Briefcase,
    GraduationCap,
    Heart,
    TrendingUp,
    Globe,
    Handshake,
    Calendar
} from 'lucide-react';
import Navbar from './Navbar';

const AboutPage = () => {
    return (
        <>
            <Navbar />

            <main className="page-content">
                {/* Page Header */}
                <section className="page-header">
                    <div className="container">
                        <h1>О Компании</h1>
                        <p>Узнайте больше о CuratioPharm</p>
                    </div>
                </section>

                {/* Company Info */}
                <section className="section">
                    <div className="container">
                        <div className="about-full-grid">
                            <div className="about-text">
                                <h2>Кто мы</h2>
                                <p>
                                    <strong>MCHJ «Curatio Pharm»</strong> — институциональный импортер и ведущий дистрибьютор фармацевтической продукции в Республике Узбекистан. 
                                    С годовым оборотом, превышающим <strong>34,8 миллиона долларов США</strong>, мы являемся фундаментальным связующим звеном между глобальными производителями и системой здравоохранения страны.
                                </p>
                                <p>
                                    Компания оперирует в строгом соответствии с международными стандартами качества <strong>GDP (Good Distribution Practice)</strong>. 
                                    Мы тесно сотрудничаем с международными партнерами, включая <strong>Delfield Marketing Limited</strong>, что позволяет нам выступать эксклюзивным представителем ряда зарубежных брендов.
                                </p>
                            </div>
                            <div className="about-stats">
                                <div className="about-stat">
                                    <History size={32} />
                                    <div>
                                        <strong>$34.8M+</strong>
                                        <span>Годовой оборот</span>
                                    </div>
                                </div>
                                <div className="about-stat">
                                    <Users size={32} />
                                    <div>
                                        <strong>1200+</strong>
                                        <span>клиентов</span>
                                    </div>
                                </div>
                                <div className="about-stat">
                                    <Trophy size={32} />
                                    <div>
                                        <strong>GDP</strong>
                                        <span>стандарт</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Company History */}
                <section className="section section-alt">
                    <div className="container">
                        <h2 className="section-title">История компании</h2>
                        <p className="section-subtitle">Путь развития CuratioPharm</p>

                        <div className="history-timeline">
                            <div className="history-item">
                                <div className="history-year">
                                    <Calendar size={20} />
                                    <span>2008</span>
                                </div>
                                <div className="history-content">
                                    <h3>Основание компании</h3>
                                    <p>Компания CuratioPharm была основана группой специалистов с многолетним опытом в фармацевтической отрасли. Начали работу с небольшого склада и штатом из 5 человек.</p>
                                </div>
                            </div>
                            <div className="history-item">
                                <div className="history-year">
                                    <Calendar size={20} />
                                    <span>2012</span>
                                </div>
                                <div className="history-content">
                                    <h3>Расширение географии</h3>
                                    <p>Открытие филиалов в ключевых регионах Узбекистана. Расширение складских площадей до 2000 кв.м. Начало работы с крупными аптечными сетями.</p>
                                </div>
                            </div>
                            <div className="history-item">
                                <div className="history-year">
                                    <Calendar size={20} />
                                    <span>2016</span>
                                </div>
                                <div className="history-content">
                                    <h3>Сертификация GDP</h3>
                                    <p>Получение сертификата надлежащей дистрибьюторской практики (GDP). Внедрение системы контроля качества на всех этапах логистики.</p>
                                </div>
                            </div>
                            <div className="history-item">
                                <div className="history-year">
                                    <Calendar size={20} />
                                    <span>2020</span>
                                </div>
                                <div className="history-content">
                                    <h3>Цифровая трансформация</h3>
                                    <p>Запуск современной IT-инфраструктуры, личного кабинета для клиентов и системы автоматизации заказов. Переход на электронный документооборот.</p>
                                </div>
                            </div>
                            <div className="history-item">
                                <div className="history-year">
                                    <Calendar size={20} />
                                    <span>Сегодня</span>
                                </div>
                                <div className="history-content">
                                    <h3>Лидер отрасли</h3>
                                    <p>Более 5000 наименований продукции, 1200+ активных клиентов, доставка в 7+ регионов Узбекистана. Продолжаем расти и развиваться.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="section">
                    <div className="container">
                        <h2 className="section-title">Наша команда</h2>
                        <p className="section-subtitle">Профессионалы, на которых можно положиться</p>

                        <div className="team-stats">
                            <div className="team-stat-card">
                                <div className="team-stat-number">85+</div>
                                <div className="team-stat-label">Сотрудников</div>
                                <div className="team-stat-desc">Профессиональная команда специалистов</div>
                            </div>
                            <div className="team-stat-card">
                                <div className="team-stat-number">12</div>
                                <div className="team-stat-label">Менеджеров по работе с клиентами</div>
                                <div className="team-stat-desc">Персональный подход к каждому</div>
                            </div>
                            <div className="team-stat-card">
                                <div className="team-stat-number">25</div>
                                <div className="team-stat-label">Водителей-экспедиторов</div>
                                <div className="team-stat-desc">Собственный автопарк</div>
                            </div>
                            <div className="team-stat-card">
                                <div className="team-stat-number">8</div>
                                <div className="team-stat-label">Провизоров</div>
                                <div className="team-stat-desc">Контроль качества продукции</div>
                            </div>
                        </div>

                        <div className="team-departments">
                            <div className="department-card">
                                <Briefcase size={28} />
                                <h4>Отдел продаж</h4>
                                <p>Консультации и оформление заказов</p>
                            </div>
                            <div className="department-card">
                                <GraduationCap size={28} />
                                <h4>Отдел качества</h4>
                                <p>Контроль и сертификация</p>
                            </div>
                            <div className="department-card">
                                <Heart size={28} />
                                <h4>Служба поддержки</h4>
                                <p>Помощь клиентам 24/7</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Goals Section */}
                <section className="section section-alt">
                    <div className="container">
                        <h2 className="section-title">Наши цели</h2>
                        <p className="section-subtitle">Стратегические направления развития</p>

                        <div className="goals-grid">
                            <div className="goal-card">
                                <div className="goal-icon">
                                    <TrendingUp size={32} />
                                </div>
                                <h3>Рост ассортимента</h3>
                                <p>Расширение каталога до 10 000 наименований к 2025 году. Включение новых категорий товаров для здоровья.</p>
                                <div className="goal-progress">
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '50%' }}></div>
                                    </div>
                                    <span>50% выполнено</span>
                                </div>
                            </div>
                            <div className="goal-card">
                                <div className="goal-icon">
                                    <Globe size={32} />
                                </div>
                                <h3>География присутствия</h3>
                                <p>Охват всех регионов Узбекистана. Открытие региональных складов для ускорения доставки.</p>
                                <div className="goal-progress">
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '70%' }}></div>
                                    </div>
                                    <span>70% выполнено</span>
                                </div>
                            </div>
                            <div className="goal-card">
                                <div className="goal-icon">
                                    <Handshake size={32} />
                                </div>
                                <h3>Партнерская сеть</h3>
                                <p>Развитие отношений с 2000+ клиентами. Специальные программы для постоянных партнеров.</p>
                                <div className="goal-progress">
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: '60%' }}></div>
                                    </div>
                                    <span>60% выполнено</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Mission, Vision, Values */}
                <section className="section">
                    <div className="container">
                        <div className="values-grid">
                            <div className="value-card">
                                <div className="icon-wrapper">
                                    <Building2 size={32} />
                                </div>
                                <h3>Наша Компания</h3>
                                <p>
                                    CuratioPharm — это команда профессионалов с многолетним опытом
                                    в фармацевтической отрасли. Мы понимаем специфику рынка и
                                    предлагаем оптимальные решения для наших партнеров.
                                </p>
                            </div>
                            <div className="value-card">
                                <div className="icon-wrapper">
                                    <Target size={32} />
                                </div>
                                <h3>Наша Миссия</h3>
                                <p>
                                    Обеспечить доступность качественных лекарственных средств для
                                    каждого жителя Узбекистана. Мы работаем с проверенными производителями
                                    и гарантируем подлинность всей продукции.
                                </p>
                            </div>
                            <div className="value-card">
                                <div className="icon-wrapper">
                                    <Award size={32} />
                                </div>
                                <h3>Наши Ценности</h3>
                                <p>
                                    Качество, надежность и ответственность — основа нашей работы.
                                    Мы соблюдаем все стандарты хранения и транспортировки
                                    фармацевтической продукции.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Licenses */}
                <section className="section section-alt">
                    <div className="container">
                        <h2 className="section-title">Лицензии и сертификаты</h2>
                        <div className="licenses-grid">
                            <div className="license-card">
                                <h4>Лицензия на фармацевтическую деятельность</h4>
                                <p>№ ЛО-77-02-010123 от 01.01.2020</p>
                            </div>
                            <div className="license-card">
                                <h4>Сертификат ISO 9001:2015</h4>
                                <p>Система менеджмента качества</p>
                            </div>
                            <div className="license-card">
                                <h4>Сертификат GDP</h4>
                                <p>Надлежащая дистрибьюторская практика</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default AboutPage;

