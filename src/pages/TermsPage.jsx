import Footer from '../components/Footer';

export default function TermsPage() {
    return (
        <main>
            <div className="page-header">
                <p className="page-header__pre">Legal</p>
                <h1 className="page-header__title">Terms & Conditions</h1>
                <p className="page-header__sub">Last updated: March 2026</p>
            </div>

            <section className="section container" style={{ maxWidth: 780, marginTop: 'var(--space-xl)' }}>
                {[
                    { h: 'Acceptance of Terms', p: 'By placing an order with Maison du Torte, you agree to these terms and conditions in full. If you do not agree, please do not use our service.' },
                    { h: 'Products & Availability', p: 'All products are subject to availability. We reserve the right to withdraw any product at any time. Prices are displayed in South African Rand (ZAR) and are inclusive of VAT where applicable.' },
                    { h: 'Orders', p: 'An order is confirmed only after you receive a WhatsApp or email confirmation from us. We reserve the right to cancel any order at our discretion, with a full refund issued where payment was made.' },
                    { h: 'Payment', p: 'We accept Cash on Delivery (confirmed via WhatsApp), card payments via Stripe, and PayNow where available. Card payments are processed securely by Stripe, Inc. We do not store card details.' },
                    { h: 'Delivery', p: 'Delivery is subject to zone coverage and slot availability. We aim to deliver within agreed timeframes but cannot guarantee delivery times due to unforeseeable circumstances.' },
                    { h: 'Cancellations & Refunds', p: 'Orders may be cancelled within 1 hour of placement. After this window, cancellations are at our discretion. Quality issues must be reported within 2 hours of receipt with supporting photo evidence.' },
                    { h: 'Perishables Disclaimer', p: 'Our products are freshly baked and perishable. Once delivered, they are the responsibility of the customer. We recommend consuming products on the day of delivery for best quality.' },
                    { h: 'Intellectual Property', p: 'All content on this site including photography, copy, and branding is the property of Maison du Torte. Reproduction without written permission is prohibited.' },
                    { h: 'Governing Law', p: 'These terms are governed by the laws of the Republic of South Africa. Any disputes shall be subject to the jurisdiction of South African courts.' },
                    { h: 'Contact', p: 'For any queries relating to these terms, please contact us via our Contact page.' },
                ].map((s, i) => (
                    <div key={i} style={{ marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-md)', borderBottom: '1px solid var(--color-grey-mid)' }}>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>{s.h}</h2>
                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8 }}>{s.p}</p>
                    </div>
                ))}
            </section>

            <Footer />
        </main>
    );
}
