import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Handshake,
    Building2,
    Truck,
    FileText,
    CheckCircle,
    ArrowRight,
    Users,
    Package,
    Clock,
    Shield,
    Send,
    Globe
} from 'lucide-react';
import Navbar from './Navbar';

const CooperationPage = () => {
    const [supplierForm, setSupplierForm] = useState({
        company: '',
        contact: '',
        phone: '',
        email: '',
        products: '',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.');
    };

    return (
        <>
            <Navbar />

            <main className="page-content">
                {/* Page Header */}
                <section className="page-header">
                    <div className="container">
                        <h1>Сотрудничество</h1>
                        <p>Станьте нашим партнером</p>
                    </div>
                </section>

                {/* Cooperation Types */}
                <section className="section">
                    <div className="container">
                        <h2 className="section-title">Формы сотрудничества</h2>
                        <p className="section-subtitle">Выберите подходящий вариант партнерства</p>

                        <div className="cooperation-cards">
                            <div className="cooperation-card">
                                <div className="cooperation-icon">
                                    <Users size={40} />
                                </div>
                                <h3>Для клиентов</h3>
                                <p>Аптеки и медицинские учреждения</p>
                                <ul className="cooperation-benefits">
                                    <li><CheckCircle size={18} /> Личный кабинет с каталогом</li>
                                    <li><CheckCircle size={18} /> Онлайн заказ и отслеживание</li>
                                    <li><CheckCircle size={18} /> Индивидуальные условия</li>
                                    <li><CheckCircle size={18} /> Доставка день в день</li>
                                </ul>
                                <Link to="/login" className="btn-primary">
                                    Войти в кабинет <ArrowRight size={18} />
                                </Link>
                            </div>

                            <div className="cooperation-card featured">
                                <div className="cooperation-badge">Для поставщиков</div>
                                <div className="cooperation-icon">
                                    <Handshake size={40} />
                                </div>
                                <h3>Для поставщиков</h3>
                                <p>Производители и дистрибьюторы</p>
                                <ul className="cooperation-benefits">
                                    <li><CheckCircle size={18} /> Широкая клиентская база</li>
                                    <li><CheckCircle size={18} /> Профессиональное хранение</li>
                                    <li><CheckCircle size={18} /> Маркетинговая поддержка</li>
                                    <li><CheckCircle size={18} /> Прозрачная отчетность</li>
                                </ul>
                                <a href="#supplier-form" className="btn-primary">
                                    Стать партнером <ArrowRight size={18} />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Partner With Us */}
                <section className="section section-alt">
                    <div className="container">
                        <h2 className="section-title">Почему стоит работать с нами</h2>
                        <div className="partner-benefits-grid">
                            <div className="partner-benefit">
                                <Package size={32} />
                                <h4>5000+ товаров</h4>
                                <p>Широкий ассортимент для ваших клиентов</p>
                            </div>
                            <div className="partner-benefit">
                                <Truck size={32} />
                                <h4>7+ регионов</h4>
                                <p>Доставка по всему Узбекистану</p>
                            </div>
                            <div className="partner-benefit">
                                <Clock size={32} />
                                <h4>15+ лет опыта</h4>
                                <p>Надежный и проверенный партнер</p>
                            </div>
                            <div className="partner-benefit">
                                <Shield size={32} />
                                <h4>GDP сертификат</h4>
                                <p>Соответствие всем стандартам</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Strategic Partners */}
                <section className="section">
                    <div className="container">
                        <h2 className="section-title">Стратегическое партнерство</h2>
                        <div className="cooperation-cards" style={{ justifyContent: 'center' }}>
                            <div className="cooperation-card featured" style={{ maxWidth: '600px', width: '100%' }}>
                                <div className="cooperation-icon">
                                    <Globe size={40} />
                                </div>
                                <h3>Delfield Marketing Limited</h3>
                                <p>Наш ключевой международный партнер. Совместно мы реализуем стратегию по выводу на рынок Узбекистана инновационных лекарственных средств и обеспечению их доступности для населения.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Supplier Form */}
                <section className="section" id="supplier-form">
                    <div className="container">
                        <div className="supplier-form-wrapper">
                            <div className="supplier-form-info">
                                <h2>Станьте нашим поставщиком</h2>
                                <p>Заполните форму, и мы свяжемся с вами для обсуждения условий сотрудничества</p>

                                <div className="supplier-contacts">
                                    <div className="supplier-contact-item">
                                        <FileText size={24} />
                                        <div>
                                            <strong>Коммерческий отдел</strong>
                                            <span>+998 71 207-88-99</span>
                                        </div>
                                    </div>
                                    <div className="supplier-contact-item">
                                        <Building2 size={24} />
                                        <div>
                                            <strong>Email для партнеров</strong>
                                            <span>partners@cpharm.uz</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <form className="supplier-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Название компании *</label>
                                    <input
                                        type="text"
                                        required
                                        value={supplierForm.company}
                                        onChange={(e) => setSupplierForm({ ...supplierForm, company: e.target.value })}
                                        placeholder="ООО «Ваша компания»"
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Контактное лицо *</label>
                                        <input
                                            type="text"
                                            required
                                            value={supplierForm.contact}
                                            onChange={(e) => setSupplierForm({ ...supplierForm, contact: e.target.value })}
                                            placeholder="Иван Иванов"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Телефон *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={supplierForm.phone}
                                            onChange={(e) => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                                            placeholder="+998 (99) 123-45-67"
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={supplierForm.email}
                                        onChange={(e) => setSupplierForm({ ...supplierForm, email: e.target.value })}
                                        placeholder="email@company.ru"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Категории продукции</label>
                                    <input
                                        type="text"
                                        value={supplierForm.products}
                                        onChange={(e) => setSupplierForm({ ...supplierForm, products: e.target.value })}
                                        placeholder="Лекарственные средства, БАДы и т.д."
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Сообщение</label>
                                    <textarea
                                        rows="4"
                                        value={supplierForm.message}
                                        onChange={(e) => setSupplierForm({ ...supplierForm, message: e.target.value })}
                                        placeholder="Дополнительная информация о вашем предложении"
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn-primary btn-large">
                                    <Send size={20} />
                                    Отправить заявку
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default CooperationPage;
