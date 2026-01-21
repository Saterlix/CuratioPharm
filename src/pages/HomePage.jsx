import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Building2,
    Target,
    Award,
    CheckCircle,
    ArrowRight,
    Thermometer,
    Snowflake,
    Shield,
    Clock,
    Truck,
    MapPin,
    Phone,
    Mail,
    Microscope,
    Users,
    Globe
} from 'lucide-react';
import Navbar from './Navbar';

const ActivitiesCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            id: 1,
            title: "Современный складской комплекс",
            description: "Наш логистический центр площадью 5000 кв.м. оснащен передовыми системами климат-контроля и автоматизированного учета, что гарантирует сохранность и быструю обработку продукции.",
            icon: <Building2 size={64} />,
            color: "#3b82f6"
        },
        {
            id: 2,
            title: "Собственный автопарк",
            description: "Более 20 современных автомобилей, оборудованных рефрижераторами, обеспечивают оперативную доставку лекарственных средств с соблюдением температурного режима в любую точку страны.",
            icon: <Truck size={64} />,
            color: "#10b981"
        },
        {
            id: 3,
            title: "Контроль качества",
            description: "Многоступенчатая система контроля качества на всех этапах: от приемки товара до отгрузки клиенту. Мы строго следуем стандартам GDP и требованиям Минздрава.",
            icon: <Shield size={64} />,
            color: "#8b5cf6"
        },
        {
            id: 4,
            title: "Команда профессионалов",
            description: "В нашей команде работают высококвалифицированные специалисты с многолетним опытом в фармацевтической сфере, готовые решить любые задачи наших партнеров.",
            icon: <Users size={64} />,
            color: "#f59e0b"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className="activities-carousel">
            <div 
                className="carousel-track" 
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {slides.map((slide) => (
                    <div key={slide.id} className="carousel-slide">
                        <div className="slide-icon" style={{ backgroundColor: slide.color }}>
                            {slide.icon}
                        </div>
                        <div className="slide-content">
                            <h3>{slide.title}</h3>
                            <p>{slide.description}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="carousel-dots">
                {slides.map((_, index) => (
                    <div 
                        key={index} 
                        className={`dot ${currentSlide === index ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                    />
                ))}
            </div>
        </div>
    );
};

const HomePage = () => {
    return (
        <>
            <Navbar />

            <main>
                {/* Statistics Section */}
                <section className="section stats-section">
                    <div className="container">
                        <div className="stats-grid">
                            <div className="stat-item">
                                <span className="stat-number">15+</span>
                                <span className="stat-label">Лет на рынке</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">5000+</span>
                                <span className="stat-label">Наименований</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">1200+</span>
                                <span className="stat-label">Клиентов</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">7+</span>
                                <span className="stat-label">Регионов</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Preview Section */}
                <section className="section section-alt">
                    <div className="container">
                        <h2 className="section-title">О Компании</h2>
                        <p className="section-subtitle">Надежный партнер в сфере фармацевтической дистрибуции</p>
                        
                        {/* Activities Carousel Inserted Here */}
                        <div style={{ marginBottom: '60px' }}>
                            <ActivitiesCarousel />
                        </div>

                        <div className="about-grid">
                            <div className="about-card">
                                <div className="icon-wrapper">
                                    <Building2 size={32} />
                                </div>
                                <h3>Наша Компания</h3>
                                <p>MCHJ «Curatio Pharm» — институциональный импортер, осуществляющий оптовую торговлю лекарственными средствами в соответствии со стандартами GDP.</p>
                            </div>
                            <div className="about-card">
                                <div className="icon-wrapper">
                                    <Target size={32} />
                                </div>
                                <h3>Наша Миссия</h3>
                                <p>Обеспечить доступность качественных лекарственных средств для каждого.</p>
                            </div>
                            <div className="about-card">
                                <div className="icon-wrapper">
                                    <Award size={32} />
                                </div>
                                <h3>Наши Ценности</h3>
                                <p>Качество, надежность и ответственность — основа нашей работы.</p>
                            </div>
                        </div>
                        <div className="section-cta">
                            <Link to="/about" className="btn-primary">
                                Подробнее о компании <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Storage Conditions Section */}
                <section className="section">
                    <div className="container">
                        <h2 className="section-title">Условия хранения</h2>
                        <p className="section-subtitle">Современные складские помещения с соблюдением всех требований</p>
                        <div className="storage-grid">
                            <div className="storage-card">
                                <div className="storage-icon">
                                    <Thermometer size={36} />
                                </div>
                                <h3>Температурный контроль</h3>
                                <p>Постоянный мониторинг температуры во всех зонах хранения. Автоматическая система климат-контроля.</p>
                                <div className="storage-badge">+15°C до +25°C</div>
                            </div>
                            <div className="storage-card">
                                <div className="storage-icon cold">
                                    <Snowflake size={36} />
                                </div>
                                <h3>Холодильные камеры</h3>
                                <p>Специальные холодильные камеры для термолабильных препаратов с резервным питанием.</p>
                                <div className="storage-badge cold">+2°C до +8°C</div>
                            </div>
                            <div className="storage-card">
                                <div className="storage-icon">
                                    <Shield size={36} />
                                </div>
                                <h3>Безопасность</h3>
                                <p>Круглосуточная охрана, видеонаблюдение и противопожарная система.</p>
                                <div className="storage-badge">24/7</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Same-Day Delivery Section */}
                <section className="section delivery-demo-section">
                    <div className="container">
                        <div className="delivery-demo">
                            <div className="delivery-demo-content">
                                <div className="delivery-badge-large">
                                    <Clock size={32} />
                                    <span>День в День</span>
                                </div>
                                <h2>Доставка в день заказа</h2>
                                <p>Заказы, оформленные до 12:00, доставляются в тот же день по городу и области. Собственный автопарк обеспечивает надежную и быструю логистику.</p>
                                <ul className="delivery-features">
                                    <li><CheckCircle size={20} /> Заказ до 12:00 — доставка сегодня</li>
                                    <li><CheckCircle size={20} /> Собственный автопарк 20+ машин</li>
                                    <li><CheckCircle size={20} /> Термоконтейнеры для препаратов</li>
                                    <li><CheckCircle size={20} /> SMS-уведомления о доставке</li>
                                </ul>
                                <Link to="/delivery" className="btn-primary">
                                    Подробнее о доставке <ArrowRight size={18} />
                                </Link>
                            </div>
                            <div className="delivery-demo-visual">
                                <div className="delivery-timeline">
                                    <div className="timeline-item active">
                                        <div className="timeline-icon"><Clock size={20} /></div>
                                        <div className="timeline-text">
                                            <strong>До 12:00</strong>
                                            <span>Оформление заказа</span>
                                        </div>
                                    </div>
                                    <div className="timeline-line"></div>
                                    <div className="timeline-item active">
                                        <div className="timeline-icon"><Shield size={20} /></div>
                                        <div className="timeline-text">
                                            <strong>12:00 - 14:00</strong>
                                            <span>Сборка и проверка</span>
                                        </div>
                                    </div>
                                    <div className="timeline-line"></div>
                                    <div className="timeline-item active">
                                        <div className="timeline-icon"><Truck size={20} /></div>
                                        <div className="timeline-text">
                                            <strong>14:00 - 18:00</strong>
                                            <span>Доставка</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="section section-alt">
                    <div className="container">
                        <h2 className="section-title">Почему выбирают нас</h2>
                        <div className="advantages-grid">
                            <div className="advantage-item">
                                <CheckCircle size={24} className="advantage-icon" />
                                <span>Сертифицированная продукция</span>
                            </div>
                            <div className="advantage-item">
                                <CheckCircle size={24} className="advantage-icon" />
                                <span>Прямые контракты с производителями</span>
                            </div>
                            <div className="advantage-item">
                                <CheckCircle size={24} className="advantage-icon" />
                                <span>Конкурентные цены</span>
                            </div>
                            <div className="advantage-item">
                                <CheckCircle size={24} className="advantage-icon" />
                                <span>Быстрая доставка по Узбекистану</span>
                            </div>
                            <div className="advantage-item">
                                <CheckCircle size={24} className="advantage-icon" />
                                <span>Соблюдение холодовой цепи</span>
                            </div>
                            <div className="advantage-item">
                                <CheckCircle size={24} className="advantage-icon" />
                                <span>Персональный менеджер</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default HomePage;
