import { useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { openWhatsApp } from '../lib/whatsapp';
import Footer from '../components/Footer';
import { Copy, MessageCircle, Check, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './OrderConfirmationPage.css';

export default function OrderConfirmationPage() {
    const { state } = useLocation();
    const [copied, setCopied] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const waOpened = useRef(false);
    const receiptRef = useRef(null);

    const order = state?.order;
    const message = state?.message;
    const method = state?.method; // 'cod' | 'stripe'

    // Auto-open WhatsApp once for COD orders
    useEffect(() => {
        if (method === 'cod' && message && !waOpened.current) {
            waOpened.current = true;
            openWhatsApp(message);
        }
    }, [method, message]);

    const handleCopy = () => {
        navigator.clipboard.writeText(message || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadReceipt = async () => {
        if (!receiptRef.current || !order) return;
        setDownloading(true);
        try {
            const canvas = await html2canvas(receiptRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width / 2, canvas.height / 2]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
            pdf.save(`Maison_Du_Toite_Receipt_${order.order_number}.pdf`);
        } catch (err) {
            console.error('Failed to generate receipt', err);
        } finally {
            setDownloading(false);
        }
    };

    // Stripe success (arrived via redirect with session_id param)
    const searchParams = new URLSearchParams(window.location.search);
    const isStripeSuccess = searchParams.get('session_id') || method === 'stripe';

    if (!order && !isStripeSuccess) {
        return (
            <main style={{ textAlign: 'center', padding: 'var(--space-2xl) var(--space-sm)' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '1rem' }}>Nothing to show here.</h1>
                <Link to="/shop" className="btn-primary">Back to Shop</Link>
            </main>
        );
    }

    return (
        <main className="confirmation-page">
            <div className="confirmation-page__inner container" ref={receiptRef} style={{ background: 'var(--color-bg)', padding: '2rem', borderRadius: '8px' }}>

                {/* ── COD Confirmation ── */}
                {method === 'cod' && order && (
                    <>
                        <div className="confirmation-header">
                            <div className="confirmation-check">✓</div>
                            <p className="confirmation-pre">Order Placed</p>
                            <h1 className="confirmation-title">Thank you, {order.customer_name.split(' ')[0]}.</h1>
                            <p className="confirmation-sub">
                                Your order <strong>{order.order_number}</strong> has been received. Please complete it by sending us the WhatsApp message below.
                            </p>
                        </div>

                        {/* WhatsApp CTA */}
                        <div className="confirmation-wa-card">
                            <div className="confirmation-wa-card__header">
                                <MessageCircle size={20} color="#25D366" />
                                <span>WhatsApp Order Message</span>
                            </div>
                            <pre className="confirmation-wa-card__message">{message}</pre>
                            <div className="confirmation-wa-card__actions" data-html2canvas-ignore="true">
                                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    onClick={() => openWhatsApp(message)}>
                                    <MessageCircle size={16} />
                                    Open WhatsApp
                                </button>
                                <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    onClick={handleCopy}>
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? 'Copied!' : 'Copy Message'}
                                </button>
                            </div>
                            <p className="confirmation-wa-card__fallback" data-html2canvas-ignore="true">
                                WhatsApp not opening? Call or message us directly on{' '}
                                <a href={`tel:+${import.meta.env.VITE_WHATSAPP_ORDER_NUMBER}`}>
                                    +{import.meta.env.VITE_WHATSAPP_ORDER_NUMBER}
                                </a>
                            </p>
                        </div>
                    </>
                )}

                {/* ── Stripe Confirmation ── */}
                {isStripeSuccess && method !== 'cod' && (
                    <div className="confirmation-header">
                        <div className="confirmation-check" style={{ background: 'var(--color-green)' }}>✓</div>
                        <p className="confirmation-pre">Payment Successful</p>
                        <h1 className="confirmation-title">Your order is confirmed.</h1>
                        {order && (
                            <p className="confirmation-sub">
                                Order <strong>{order.order_number}</strong> has been paid and confirmed. You'll receive an update when it's ready.
                            </p>
                        )}
                        {order && (
                            <div style={{ marginTop: '2rem', textAlign: 'left', background: 'var(--color-white)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--color-grey-light)' }}>
                                <h3 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>Order Details</h3>
                                <p><strong>Order Number:</strong> {order.order_number}</p>
                                <p><strong>Name:</strong> {order.customer_name}</p>
                                <p><strong>Delivery Method:</strong> {order.delivery_method === 'delivery' ? 'Delivery' : 'Pickup'}</p>
                                <p><strong>Total:</strong> ${Number(order.total).toFixed(2)}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="confirmation-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                {order && (
                    <button onClick={downloadReceipt} disabled={downloading} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Download size={18} />
                        {downloading ? 'Generating PDE...' : 'Download Receipt'}
                    </button>
                )}
                <Link to="/shop" className="btn-primary">Continue Shopping</Link>
            </div>

            <Footer />
        </main>
    );
}
