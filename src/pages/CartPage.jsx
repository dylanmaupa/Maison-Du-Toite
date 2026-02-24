import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';
import './CartPage.css';

export default function CartPage() {
    const { items, updateQuantity, removeItem, subtotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', address: '', city: '', zip: '' });
    const shipping = subtotal >= 500 ? 0 : 35;
    const total = subtotal + shipping;

    const handleField = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleCheckout = e => {
        e.preventDefault();
        clearCart();
        navigate('/order-confirmation');
    };

    if (items.length === 0) {
        return (
            <main className="cart cart--empty">
                <div className="container">
                    <h1 className="cart__empty-title">Your bag is empty</h1>
                    <p className="cart__empty-sub">Discover our curated collection of exceptional pieces.</p>
                    <button className="btn-primary" onClick={() => navigate('/shop')}>Shop Collection</button>
                </div>
            </main>
        );
    }

    return (
        <main className="cart">
            <div className="cart__inner container">
                {/* Left – Form */}
                <div className="cart__form-col">
                    <h1 className="cart__title">Your Bag</h1>

                    {/* Items */}
                    <div className="cart__items">
                        {items.map(item => (
                            <div key={`${item.id}-${item.color}`} className="cart__item">
                                <div className="cart__item-img-wrap">
                                    <img src={item.images[0]} alt={item.name} />
                                </div>
                                <div className="cart__item-info">
                                    <div className="cart__item-header">
                                        <div>
                                            <p className="cart__item-category">{item.category}</p>
                                            <h3 className="cart__item-name">{item.name}</h3>
                                            {item.color && (
                                                <div className="cart__item-color">
                                                    <span style={{ background: item.color }} className="cart__item-swatch" />
                                                </div>
                                            )}
                                        </div>
                                        <button className="cart__remove" onClick={() => removeItem(item.id, item.color)}>
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                    <div className="cart__item-footer">
                                        <div className="cart__item-qty">
                                            <button onClick={() => updateQuantity(item.id, item.color, item.quantity - 1)}><Minus size={12} /></button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.color, item.quantity + 1)}><Plus size={12} /></button>
                                        </div>
                                        <p className="cart__item-price">${(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Shipping form */}
                    <form className="cart__shipping-form" onSubmit={handleCheckout}>
                        <h2 className="cart__form-title">Shipping Details</h2>
                        <div className="cart__form-grid">
                            <div className="cart__field">
                                <label>Full Name</label>
                                <input name="name" value={form.name} onChange={handleField} required placeholder="Jane Doe" />
                            </div>
                            <div className="cart__field">
                                <label>Email</label>
                                <input type="email" name="email" value={form.email} onChange={handleField} required placeholder="jane@example.com" />
                            </div>
                            <div className="cart__field cart__field--full">
                                <label>Street Address</label>
                                <input name="address" value={form.address} onChange={handleField} required placeholder="14 Rue de Rivoli" />
                            </div>
                            <div className="cart__field">
                                <label>City</label>
                                <input name="city" value={form.city} onChange={handleField} required placeholder="Paris" />
                            </div>
                            <div className="cart__field">
                                <label>Postal Code</label>
                                <input name="zip" value={form.zip} onChange={handleField} required placeholder="75001" />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary cart__checkout-btn">Complete Order</button>
                    </form>
                </div>

                {/* Right – Summary */}
                <aside className="cart__summary">
                    <h2 className="cart__summary-title">Bag Summary</h2>
                    <div className="cart__summary-items">
                        {items.map(item => (
                            <div key={`${item.id}-${item.color}`} className="cart__summary-line">
                                <span>{item.name} × {item.quantity}</span>
                                <span>${(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                    <div className="cart__summary-divider" />
                    <div className="cart__summary-line">
                        <span>Subtotal</span>
                        <span>${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="cart__summary-line">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'Free' : `$${shipping}`}</span>
                    </div>
                    <div className="cart__summary-divider" />
                    <div className="cart__summary-line cart__summary-total">
                        <span>Total</span>
                        <span>${total.toLocaleString()}</span>
                    </div>
                    {shipping > 0 && (
                        <p className="cart__shipping-note">Free shipping on orders over $500</p>
                    )}
                </aside>
            </div>
        </main>
    );
}
