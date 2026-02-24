import { Link } from 'react-router-dom';
import './OrderConfirmationPage.css';
import { CheckCircle } from 'lucide-react';

const ORDER_NUM = `MDT-${Math.floor(10000 + Math.random() * 90000)}`;

export default function OrderConfirmationPage() {
    return (
        <main className="confirm">
            <div className="confirm__inner container">
                <div className="confirm__icon">
                    <CheckCircle size={56} strokeWidth={1.2} />
                </div>
                <p className="confirm__pre">Thank you for your order</p>
                <h1 className="confirm__title">Your purchase is confirmed.</h1>
                <p className="confirm__sub">
                    Order reference <strong>{ORDER_NUM}</strong>. A confirmation and shipping updates will be sent to your email address.
                </p>
                <div className="confirm__info">
                    <div className="confirm__info-item">
                        <span className="confirm__info-label">Estimated Delivery</span>
                        <span className="confirm__info-value">7–14 Business Days</span>
                    </div>
                    <div className="confirm__info-item">
                        <span className="confirm__info-label">Packaging</span>
                        <span className="confirm__info-value">Maison Gift Box</span>
                    </div>
                    <div className="confirm__info-item">
                        <span className="confirm__info-label">Support</span>
                        <span className="confirm__info-value">concierge@maisondutoite.com</span>
                    </div>
                </div>
                <div className="confirm__actions">
                    <Link to="/shop" className="btn-primary">Continue Shopping</Link>
                    <Link to="/" className="btn-outline">Return Home</Link>
                </div>
            </div>
        </main>
    );
}
