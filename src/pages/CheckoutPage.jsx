import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { buildWhatsAppMessage, openWhatsApp } from '../lib/whatsapp';
import { validateLeadTime } from '../lib/delivery';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import '@geoapify/geocoder-autocomplete/styles/minimal.css';

import './CheckoutPage.css';

const INITIAL_FORM = {
    customer_name: '', phone: '', email: '',
    address: '', delivery_method: 'delivery',
    preferred_date: '', notes: '', payment_method: 'cod',
    terms: false,
};

export default function CheckoutPage() {
    const { items, subtotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [calculatingDistance, setCalculatingDistance] = useState(false);

    const activeDeliveryFee = form.delivery_method === 'delivery' ? deliveryFee : 0;
    const total = subtotal + activeDeliveryFee;

    const calculateDistanceAndRate = async (destCoords) => {
        if (!destCoords || (!destCoords.lat && !destCoords.lon)) return;

        setCalculatingDistance(true);
        try {
            // Sam Levi Village, Borrowdale, Harare
            const originStr = "-18.33801205,29.91343784"; // Format is lat,lon
            const destStr = `${destCoords.lat},${destCoords.lon}`;

            const res = await fetch(`https://api.geoapify.com/v1/routing?waypoints=${originStr}|${destStr}&mode=drive&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`);
            const data = await res.json();

            if (data.features && data.features.length > 0) {
                const distanceMeters = data.features[0].properties.distance;
                const distanceKm = distanceMeters / 1000;

                let fee = 0;
                if (distanceKm < 2) {
                    fee = 0;
                } else if (distanceKm < 10) {
                    fee = 5;
                } else {
                    fee = 10;
                }
                setDeliveryFee(fee);
                toast.success(`Delivery distance: ${(distanceKm).toFixed(1)} km - Fee: $${fee}`);
            } else {
                toast.error('Could not calculate distance to this address.');
                setDeliveryFee(10); // default fallback
            }
        } catch (err) {
            console.error('Routing API error:', err);
            toast.error('Error calculating delivery fee.');
            setDeliveryFee(10);
        } finally {
            setCalculatingDistance(false);
        }
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        toast.loading("Getting location...", { id: "geo" });
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const res = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`);
                    const data = await res.json();
                    toast.dismiss("geo");
                    if (data.features && data.features.length > 0) {
                        const formatted = data.features[0].properties.formatted;
                        set('address', formatted);
                        toast.success("Location found: " + formatted);
                        calculateDistanceAndRate({ lat: latitude, lon: longitude });
                    } else {
                        toast.error("Could not determine address from location.");
                    }
                } catch (err) {
                    toast.dismiss("geo");
                    toast.error("Error connecting to location service.");
                }
            },
            () => {
                toast.dismiss("geo");
                toast.error("Unable to retrieve your location");
            }
        );
    };

    const set = (k, v) => {
        setForm(f => ({ ...f, [k]: v }));
        setErrors(e => ({ ...e, [k]: undefined }));
    };

    const validate = () => {
        const e = {};
        if (!form.customer_name.trim()) e.customer_name = 'Required';
        if (!form.phone.trim()) e.phone = 'Required';
        if (!form.email.trim()) e.email = 'Required';
        if (form.delivery_method === 'delivery' && !form.address) e.address = 'Required for delivery';
        if (!form.terms) e.terms = 'Please accept the terms & conditions';

        // Lead time check
        const { valid, blockers } = validateLeadTime(items, form.preferred_date);
        if (!valid) e.preferred_date = blockers.join(' ');

        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const createOrder = async () => {
        const { data: numData } = await supabase.rpc('generate_order_number');
        const orderNumber = numData;

        const { data: order, error } = await supabase
            .from('orders')
            .insert({
                order_number: orderNumber,
                customer_name: form.customer_name,
                phone: form.phone,
                email: form.email,
                address: form.delivery_method === 'delivery' ? form.address : null,
                delivery_method: form.delivery_method,
                preferred_date: form.preferred_date || null,
                notes: form.notes || null,
                payment_method: form.payment_method,
                order_status: form.payment_method === 'cod' ? 'pending_cod' : 'pending_payment',
                delivery_fee: activeDeliveryFee,
                subtotal,
                total,
            })
            .select()
            .single();

        if (error) throw error;

        await supabase.from('order_items').insert(
            items.map(item => ({
                order_id: order.id,
                product_id: item.product?.id || null,
                product_name: item.name,
                quantity: item.quantity,
                price: item.price,
            }))
        );

        return order;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validate()) return;
        if (items.length === 0) { toast.error('Your cart is empty.'); return; }

        setLoading(true);
        try {
            const order = await createOrder();
            const orderItems = items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price }));

            clearCart();

            if (form.payment_method === 'cod') {
                const message = buildWhatsAppMessage(order, orderItems);
                navigate('/order-confirmation', {
                    state: { order, message, method: 'cod' },
                });
            } else if (form.payment_method === 'stripe') {
                const res = await fetch(
                    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-stripe-session`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                        },
                        body: JSON.stringify({ orderId: order.id, orderNumber: order.order_number, total }),
                    }
                );
                const { url } = await res.json();
                window.location.href = url;
            }
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="checkout-page">
            <div className="page-header">
                <p className="page-header__pre">Almost there</p>
                <h1 className="page-header__title">Checkout</h1>
            </div>

            <div className="checkout-page__inner container">
                {/* ── LEFT: Form ── */}
                <form className="checkout-form" onSubmit={handleSubmit} noValidate>

                    {/* Section: Contact */}
                    <div className="checkout-section">
                        <h2 className="checkout-section__title">Contact Information</h2>
                        <div className="checkout-grid-2">
                            <div className="form-group">
                                <label htmlFor="customer_name">Full Name</label>
                                <input id="customer_name" className="form-input" value={form.customer_name}
                                    onChange={e => set('customer_name', e.target.value)} />
                                {errors.customer_name && <p className="form-error">{errors.customer_name}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number</label>
                                <input id="phone" type="tel" className="form-input" value={form.phone}
                                    onChange={e => set('phone', e.target.value)} />
                                {errors.phone && <p className="form-error">{errors.phone}</p>}
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input id="email" type="email" className="form-input" value={form.email}
                                onChange={e => set('email', e.target.value)} />
                            {errors.email && <p className="form-error">{errors.email}</p>}
                        </div>
                    </div>

                    {/* Section: Delivery */}
                    <div className="checkout-section">
                        <h2 className="checkout-section__title">Delivery Method</h2>
                        <div className="method-toggle">
                            {['delivery', 'pickup'].map(m => (
                                <button key={m} type="button"
                                    className={`method-toggle__btn ${form.delivery_method === m ? 'active' : ''}`}
                                    onClick={() => set('delivery_method', m)}>
                                    {m === 'delivery' ? '🚗 Delivery' : '🏪 Pickup'}
                                </button>
                            ))}
                        </div>

                        {form.delivery_method === 'delivery' && (
                            <div className="form-group" style={{ marginTop: 'var(--space-sm)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.25rem' }}>
                                    <label style={{ margin: 0 }}>Delivery Address</label>
                                    <button type="button" onClick={handleUseCurrentLocation} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                                        📍 Use Current Location
                                    </button>
                                </div>

                                <div style={{ minHeight: '40px', background: 'var(--color-bg-light)', borderRadius: 'var(--radius-sm)' }}>
                                    <GeoapifyContext apiKey={import.meta.env.VITE_GEOAPIFY_API_KEY}>
                                        <GeoapifyGeocoderAutocomplete
                                            placeholder="Start typing your address..."
                                            type="street"
                                            lang="en"
                                            limit={5}
                                            filterByCountryCode={['zw']}
                                            placeSelect={(value) => {
                                                if (value && value.properties) {
                                                    const { lat, lon, formatted } = value.properties;
                                                    set('address', formatted);
                                                    calculateDistanceAndRate({ lat, lon });
                                                }
                                            }}
                                        />
                                    </GeoapifyContext>
                                </div>

                                {form.address && (
                                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text)', marginTop: '0.5rem' }}>
                                        <strong>Selected:</strong> {form.address}
                                    </p>
                                )}

                                {errors.address && <p className="form-error">{errors.address}</p>}
                                {calculatingDistance && <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginTop: '0.25rem' }}>Calculating delivery fee...</p>}
                            </div>
                        )}

                        <div className="checkout-grid-2" style={{ marginTop: 'var(--space-sm)' }}>
                            <div className="form-group">
                                <label htmlFor="preferred_date">Preferred Date (optional)</label>
                                <input id="preferred_date" type="date" className="form-input"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={form.preferred_date} onChange={e => set('preferred_date', e.target.value)} />
                                {errors.preferred_date && <p className="form-error">{errors.preferred_date}</p>}
                            </div>
                        </div>

                        <div className="form-group" style={{ marginTop: 'var(--space-sm)' }}>
                            <label htmlFor="notes">Order Notes (optional)</label>
                            <textarea id="notes" className="form-textarea" placeholder="Allergies, special requests…"
                                value={form.notes} onChange={e => set('notes', e.target.value)} />
                        </div>
                    </div>

                    {/* Section: Payment */}
                    <div className="checkout-section">
                        <h2 className="checkout-section__title">Payment Method</h2>
                        <div className="payment-options">
                            {[
                                { id: 'cod', label: 'Cash on Delivery', sub: 'Confirm via WhatsApp — pay on receipt' },
                                { id: 'stripe', label: 'Pay by Card', sub: 'Secure payment via Stripe' },
                            ].map(opt => (
                                <label key={opt.id} className={`payment-option ${form.payment_method === opt.id ? 'active' : ''}`}>
                                    <input type="radio" name="payment_method" value={opt.id}
                                        checked={form.payment_method === opt.id}
                                        onChange={() => set('payment_method', opt.id)} />
                                    <div>
                                        <p className="payment-option__label">{opt.label}</p>
                                        <p className="payment-option__sub">{opt.sub}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="checkout-section">
                        <label className="terms-check">
                            <input type="checkbox" checked={form.terms} onChange={e => set('terms', e.target.checked)} />
                            <span>I agree to the <a href="/terms" target="_blank">Terms &amp; Conditions</a> and <a href="/privacy" target="_blank">Privacy Policy</a></span>
                        </label>
                        {errors.terms && <p className="form-error" style={{ marginTop: 4 }}>{errors.terms}</p>}
                    </div>

                    <button type="submit" className="btn-primary checkout-submit" disabled={loading}>
                        {loading ? 'Placing Order…' : form.payment_method === 'cod' ? 'Place Order & Open WhatsApp' : 'Continue to Payment'}
                    </button>
                </form>

                {/* ── RIGHT: Order Summary ── */}
                <aside className="checkout-summary">
                    <h2 className="checkout-section__title">Order Summary</h2>
                    <div className="checkout-summary__items">
                        {items.map(item => (
                            <div key={item.id} className="checkout-summary__item">
                                <div className="checkout-summary__item-img">
                                    <img src={item.images?.[0] || '/bakery_hero.png'} alt={item.name} />
                                    <span className="checkout-summary__qty">{item.quantity}</span>
                                </div>
                                <div className="checkout-summary__item-info">
                                    <p className="checkout-summary__item-name">{item.name}</p>
                                    <p className="checkout-summary__item-price">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <hr className="divider" />
                    <div className="checkout-summary__totals">
                        <div className="summary-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                        <div className="summary-row">
                            <span>Delivery {form.delivery_method === 'pickup' && '(Pickup)'}</span>
                            <span>{form.delivery_method === 'pickup' ? '$0.00' : (calculatingDistance ? 'Calculating...' : `$${activeDeliveryFee.toFixed(2)}`)}</span>
                        </div>
                        <div className="summary-row summary-row--total"><span>Total</span><span>${total.toFixed(2)}</span></div>
                    </div>
                </aside>
            </div>

            <Footer />
        </main>
    );
}
