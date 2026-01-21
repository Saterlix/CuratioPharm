import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, ShoppingCart, Filter, Plus, Minus, Package, Loader2 } from 'lucide-react';
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
            const response = await fetch('/api/products');
            const data = await response.json();
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
            const response = await fetch('/api/cart', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
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
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    productId: product.id,
                    productName: product.name,
                    quantity: quantity,
                    price: product.price
                })
            });
            
            const data = await response.json();
            if (data.success) {
                setCartCount(prev => prev + quantity);
                setQuantities(prev => ({ ...prev, [product.id]: 1 }));
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
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
                        <h1>Каталог товаров</h1>
                        <p>Выберите необходимые препараты и добавьте в корзину</p>
                    </div>
                </section>
                
                <section className="section">
                    <div className="container">
                        <div className="catalog-controls">
                            <div className="search-bar">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Поиск по названию или производителю..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            
                            <div className="category-filter">
                                <Filter size={18} />
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
                            
                            <button
                                className="cart-button"
                                onClick={() => navigate('/cart')}
                            >
                                <ShoppingCart size={18} />
                                <span>Корзина</span>
                                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                            </button>
                        </div>
                        
                        {filteredProducts.length === 0 ? (
                            <div className="empty-state">
                                <Package size={64} />
                                <h3>Товары не найдены</h3>
                                <p>Попробуйте изменить параметры поиска</p>
                            </div>
                        ) : (
                            <div className="products-grid">
                                {filteredProducts.map(product => (
                                    <div key={product.id} className="product-card">
                                        <div className="product-image">
                                            <Package size={48} />
                                        </div>
                                        <div className="product-info">
                                            <h3>{product.name}</h3>
                                            <p className="product-category">{product.category}</p>
                                            <p className="product-manufacturer">{product.manufacturer}</p>
                                        </div>
                                        <div className="product-details">
                                            <div className="product-price">
                                                {Number(product.price).toLocaleString()} сум
                                            </div>
                                            <div className="product-stock">
                                                В наличии: {product.stock}
                                            </div>
                                        </div>
                                        <div className="product-actions">
                                            <div className="quantity-control">
                                                <button
                                                    onClick={() => handleQuantityChange(product.id, -1)}
                                                    disabled={(quantities[product.id] || 1) <= 1}
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span>{quantities[product.id] || 1}</span>
                                                <button onClick={() => handleQuantityChange(product.id, 1)}>
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                            <button
                                                className="add-to-cart-btn"
                                                onClick={() => handleAddToCart(product)}
                                            >
                                                <ShoppingCart size={18} />
                                                В корзину
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default ProductCatalogPage;
