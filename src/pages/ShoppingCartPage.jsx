import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Package, CheckCircle, Loader2 } from 'lucide-react';
import Navbar from './Navbar';
import './ShoppingCartPage.css';

const ShoppingCartPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    
    const [cart, setCart] = useState({ items: [], total: 0, totalItems: 0 });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [notes, setNotes] = useState('');
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadCart();
    }, [isAuthenticated, navigate]);
    
    const loadCart = async () => {
        try {
            const response = await fetch('/api/cart', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setCart(data);
            }
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        setUpdating(true);
        try {
            const response = await fetch(`/api/cart/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ quantity: newQuantity })
            });
            
            if (response.ok) {
                loadCart();
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
        } finally {
            setUpdating(false);
        }
    };
    
    const handleRemoveItem = async (itemId) => {
        if (!window.confirm('Удалить товар из корзины?')) return;
        
        setUpdating(true);
        try {
            const response = await fetch(`/api/cart/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                loadCart();
            }
        } catch (error) {
            console.error('Error removing item:', error);
        } finally {
            setUpdating(false);
        }
    };
    
    const handleClearCart = async () => {
        if (!window.confirm('Очистить корзину?')) return;
        
        setUpdating(true);
        try {
            const response = await fetch('/api/cart', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (response.ok) {
                loadCart();
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
        } finally {
            setUpdating(false);
        }
    };
    
    const handleCreateOrder = async () => {
        if (cart.items.length === 0) {
            alert('Корзина пуста');
            return;
        }
        
        if (!deliveryAddress || !contactPhone) {
            alert('Укажите адрес доставки и контактный телефон');
            return;
        }
        
        setUpdating(true);
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    deliveryAddress,
                    contactPhone,
                    notes
                })
            });
            
            const data = await response.json();
            if (data.success) {
                setOrderSuccess(true);
                setOrderNumber(data.order.orderNumber);
            } else {
                alert(data.error || 'Ошибка при оформлении заказа');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Ошибка при оформлении заказа');
        } finally {
            setUpdating(false);
        }
    };
    
    if (loading) {
        return (
            <>
                <Navbar />
                <main className="page-content">
                    <div className="loading-container">
                        <Loader2 size={48} className="spin" />
                        <p>Загрузка корзины...</p>
                    </div>
                </main>
            </>
        );
    }
    
    if (orderSuccess) {
        return (
            <>
                <Navbar />
                <main className="page-content">
                    <section className="section">
                        <div className="container">
                            <div className="order-success">
                                <CheckCircle size={80} />
                                <h1>Заказ успешно оформлен!</h1>
                                <p>Номер заказа: <strong>{orderNumber}</strong></p>
                                <p>Мы свяжемся с вами для подтверждения заказа.</p>
                                <div className="success-actions">
                                    <button onClick={() => navigate('/orders')} className="btn-primary">
                                        Мои заказы
                                    </button>
                                    <button onClick={() => navigate('/catalog')} className="btn-secondary">
                                        Вернуться в каталог
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </>
        );
    }
    
    return (
        <>
            <Navbar />
            <main className="page-content">
                <section className="cart-header">
                    <div className="container">
                        <button onClick={() => navigate('/catalog')} className="back-button">
                            <ArrowLeft size={18} />
                            Вернуться в каталог
                        </button>
                        <h1>Корзина</h1>
                        <p>Товаров в корзине: {cart.totalItems}</p>
                    </div>
                </section>
                
                <section className="section">
                    <div className="container">
                        {cart.items.length === 0 ? (
                            <div className="empty-cart">
                                <ShoppingCart size={64} />
                                <h3>Корзина пуста</h3>
                                <p>Добавьте товары из каталога</p>
                                <button onClick={() => navigate('/catalog')} className="btn-primary">
                                    Перейти в каталог
                                </button>
                            </div>
                        ) : (
                            <div className="cart-content">
                                <div className="cart-items">
                                    {cart.items.map(item => (
                                        <div key={item.id} className="cart-item">
                                            <div className="item-image">
                                                <Package size={40} />
                                            </div>
                                            <div className="item-info">
                                                <h3>{item.productName}</h3>
                                                <p className="item-price">{Number(item.price).toLocaleString()} сум</p>
                                            </div>
                                            <div className="item-quantity">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1 || updating}
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    disabled={updating}
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                            <div className="item-total">
                                                <strong>{Number(item.total).toLocaleString()} сум</strong>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="remove-btn"
                                                disabled={updating}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    
                                    {cart.items.length > 0 && (
                                        <button onClick={handleClearCart} className="clear-cart-btn" disabled={updating}>
                                            Очистить корзину
                                        </button>
                                    )}
                                </div>
                                
                                <div className="cart-sidebar">
                                    <div className="order-form">
                                        <h3>Оформление заказа</h3>
                                        
                                        <div className="form-group">
                                            <label>Адрес доставки *</label>
                                            <input
                                                type="text"
                                                value={deliveryAddress}
                                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                                placeholder="Укажите адрес доставки"
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label>Контактный телефон *</label>
                                            <input
                                                type="tel"
                                                value={contactPhone}
                                                onChange={(e) => setContactPhone(e.target.value)}
                                                placeholder="+998 (99) 123-45-67"
                                            />
                                        </div>
                                        
                                        <div className="form-group">
                                            <label>Примечание</label>
                                            <textarea
                                                rows={3}
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                placeholder="Дополнительная информация к заказу"
                                            />
                                        </div>
                                        
                                        <div className="order-summary">
                                            <div className="summary-row">
                                                <span>Товаров:</span>
                                                <span>{cart.totalItems} шт.</span>
                                            </div>
                                            <div className="summary-row total">
                                                <span>Итого:</span>
                                                <span>{Number(cart.total).toLocaleString()} сум</span>
                                            </div>
                                        </div>
                                        
                                        <button
                                            onClick={handleCreateOrder}
                                            className="checkout-btn"
                                            disabled={updating || cart.items.length === 0}
                                        >
                                            {updating ? (
                                                <>
                                                    <Loader2 size={18} className="spin" />
                                                    Оформление...
                                                </>
                                            ) : (
                                                'Оформить заказ'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default ShoppingCartPage;
