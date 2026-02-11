import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI, cartAPI } from '../services/api';
import { Search, ShoppingCart, Filter, Plus, Minus, Package, Loader2, ArrowLeft } from 'lucide-react';
import Navbar from './Navbar';
import './ProductCatalogPage.css';

const ProductCatalogPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cartCount, setCartCount] = useState(0);
    const [quantities, setQuantities] = useState({});
    const [addingToCart, setAddingToCart] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadProducts();
        loadCartCount();
    }, [isAuthenticated, navigate]);

    const loadProducts = async () => {
        try {
            const data = await productsAPI.getProducts();
            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadCartCount = async () => {
        try {
            const data = await cartAPI.getCart();
            if (data.success) {
                setCartCount(data.totalItems);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    };

    const handleQuantityChange = (productId, delta) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) + delta)
        }));
    };

    const handleAddToCart = async (product) => {
        const quantity = quantities[product.id] || 1;
        setAddingToCart(product.id);
        try {
            const data = await cartAPI.addToCart({
                productId: product.id,
                productName: product.name,
                quantity: quantity,
                price: product.price
            });
            if (data.success) {
                setCartCount(prev => prev + quantity);
                setQuantities(prev => ({ ...prev, [product.id]: 1 }));
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        } finally {
            setAddingToCart(null);
        }
    };

    const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="page-content">
                    <div className="loading-container">
                        <Loader2 size={48} className="spin" />
                        <p>Загрузка каталога...</p>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="page-content">
                <section className="catalog-header">
                    <div className="container">
                        <div className="catalog-header-row">
                            <div>
                                <h1>Каталог товаров</h1>
                                <p>Выберите необходимые препараты и добавьте в корзину</p>
                            </div>
                            <button className="back-to-cabinet" onClick={() => navigate('/cabinet')}>
                                <ArrowLeft size={18} />
                                Личный кабинет
                            </button>
                        </div>
                    </div>
                </section>

                <section className="catalog-body">
                    <div className="container">
                        <div className="catalog-toolbar">
                            <div className="search-bar">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Поиск по названию или производителю..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="toolbar-right">
                                <div className="category-filter">
                                    <Filter size={16} />
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                    >
                                        <option value="all">Все категории</option>
                                        {categories.filter(c => c !== 'all').map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                <button className="cart-button" onClick={() => navigate('/cart')}>
                                    <ShoppingCart size={18} />
                                    <span>Корзина</span>
                                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                                </button>
                            </div>
                        </div>

                        <div className="catalog-results-info">
                            Найдено товаров: <strong>{filteredProducts.length}</strong>
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="empty-state">
                                <Package size={64} />
                                <h3>Товары не найдены</h3>
                                <p>Попробуйте изменить параметры поиска</p>
                            </div>
                        ) : (
                            <div className="table-container">
                                <table className="catalog-table">
                                    <thead>
                                        <tr>
                                            <th className="col-name">Наименование</th>
                                            <th className="col-category">Категория</th>
                                            <th className="col-manufacturer">Производитель</th>
                                            <th className="col-price">Цена</th>
                                            <th className="col-stock">Наличие</th>
                                            <th className="col-qty">Кол-во</th>
                                            <th className="col-action">Действие</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map(product => (
                                            <tr key={product.id}>
                                                <td className="col-name">
                                                    <div className="product-name-cell">
                                                        <Package size={18} className="product-icon-small" />
                                                        <span>{product.name}</span>
                                                    </div>
                                                </td>
                                                <td className="col-category">
                                                    <span className="category-tag">{product.category || '—'}</span>
                                                </td>
                                                <td className="col-manufacturer">{product.manufacturer || '—'}</td>
                                                <td className="col-price">
                                                    <strong>{Number(product.price).toLocaleString()} сум</strong>
                                                </td>
                                                <td className="col-stock">
                                                    <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                                        {product.stock > 0 ? `${product.stock} шт` : 'Нет'}
                                                    </span>
                                                </td>
                                                <td className="col-qty">
                                                    <div className="quantity-control">
                                                        <button
                                                            onClick={() => handleQuantityChange(product.id, -1)}
                                                            disabled={(quantities[product.id] || 1) <= 1}
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span>{quantities[product.id] || 1}</span>
                                                        <button onClick={() => handleQuantityChange(product.id, 1)}>
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                                <td className="col-action">
                                                    <button
                                                        className="add-to-cart-btn"
                                                        onClick={() => handleAddToCart(product)}
                                                        disabled={product.stock <= 0 || addingToCart === product.id}
                                                    >
                                                        {addingToCart === product.id ? (
                                                            <Loader2 size={16} className="spin" />
                                                        ) : (
                                                            <ShoppingCart size={16} />
                                                        )}
                                                        В корзину
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default ProductCatalogPage;
