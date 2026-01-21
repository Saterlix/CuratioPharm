import React from 'react';
import { Pill, FlaskConical, Stethoscope, Leaf, ArrowRight } from 'lucide-react';
import Navbar from './Navbar';

const ProductsPage = () => {
    return (
        <>
            <Navbar />

            <main className="page-content">
                {/* Page Header */}
                <section className="page-header">
                    <div className="container">
                        <h1>Продукция</h1>
                        <p>Широкий ассортимент товаров медицинского назначения</p>
                    </div>
                </section>

                {/* Products Grid */}
                <section className="section">
                    <div className="container">
                        <div className="products-page-grid">
                            <div className="product-full-card">
                                <div className="product-icon">
                                    <Pill size={48} />
                                </div>
                                <div className="product-content">
                                    <h3>Лекарственные средства</h3>
                                    <p>
                                        Более 5000 наименований от ведущих отечественных и зарубежных
                                        производителей. Рецептурные и безрецептурные препараты всех
                                        фармакологических групп.
                                    </p>
                                    <ul>
                                        <li>Антибиотики и противомикробные</li>
                                        <li>Сердечно-сосудистые препараты</li>
                                        <li>Обезболивающие и противовоспалительные</li>
                                        <li>Витамины и минералы</li>
                                        <li>Препараты для ЖКТ</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="product-full-card">
                                <div className="product-icon">
                                    <FlaskConical size={48} />
                                </div>
                                <div className="product-content">
                                    <h3>Медицинская косметика</h3>
                                    <p>
                                        Профессиональная дерматологическая и космецевтическая
                                        продукция от ведущих брендов.
                                    </p>
                                    <ul>
                                        <li>Аптечная косметика</li>
                                        <li>Дерматологические средства</li>
                                        <li>Средства по уходу за кожей</li>
                                        <li>Солнцезащитные средства</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="product-full-card">
                                <div className="product-icon">
                                    <Stethoscope size={48} />
                                </div>
                                <div className="product-content">
                                    <h3>Медицинские изделия</h3>
                                    <p>
                                        Расходные материалы и медицинское оборудование для
                                        клиник и аптек.
                                    </p>
                                    <ul>
                                        <li>Перевязочные материалы</li>
                                        <li>Шприцы и системы</li>
                                        <li>Диагностическое оборудование</li>
                                        <li>Средства реабилитации</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="product-full-card">
                                <div className="product-icon">
                                    <Leaf size={48} />
                                </div>
                                <div className="product-content">
                                    <h3>БАДы и витамины</h3>
                                    <p>
                                        Биологически активные добавки и витаминные комплексы
                                        для поддержания здоровья.
                                    </p>
                                    <ul>
                                        <li>Витаминные комплексы</li>
                                        <li>Минеральные добавки</li>
                                        <li>Пробиотики и пребиотики</li>
                                        <li>Спортивное питание</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="section section-alt">
                    <div className="container cta-container">
                        <h2>Нужна консультация?</h2>
                        <p>Наши менеджеры помогут подобрать оптимальный ассортимент для вашей аптеки</p>
                        <a href="/contacts" className="btn-primary btn-large">
                            Связаться с нами
                        </a>
                    </div>
                </section>
            </main>
        </>
    );
};

export default ProductsPage;
