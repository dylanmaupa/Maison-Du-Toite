import Footer from '../components/Footer';

export default function PrivacyPage() {
    return (
        <main>
            <div className="page-header">
                <p className="page-header__pre">Legal</p>
                <h1 className="page-header__title">Privacy Policy</h1>
                <p className="page-header__sub">Last updated: March 2026</p>
            </div>

            <section className="section container" style={{ maxWidth: 780, marginTop: 'var(--space-xl)' }}>
                {[
                    { h: 'Information We Collect', p: 'When you place an order, we collect: full name, phone number, email address, delivery address, and preferences. We collect this information solely to fulfil your order.' },
                    { h: 'How We Use Your Information', p: 'Your information is used to process and deliver your order, send order confirmations, and improve our service. We do not sell or rent your personal information to third parties.' },
                    { h: 'WhatsApp Communications', p: 'For Cash on Delivery orders, you will be asked to confirm your order via WhatsApp. By doing so, you consent to receiving order status updates on WhatsApp.' },
                    { h: 'Payments', p: 'Card payments are processed by Stripe, Inc. via a secure, encrypted connection. We never store your card details on our servers. Please refer to Stripe\'s privacy policy for how they handle payment data.' },
                    { h: 'Cookies', p: 'We use essential cookies to maintain your shopping cart session. No tracking cookies are placed without your consent. Google Analytics and Meta Pixel may be used for aggregate analytics; you may opt out via browser settings.' },
                    { h: 'Data Retention', p: 'Order data is retained for up to 5 years for accounting and legal compliance purposes. You may request deletion of your personal data at any time (subject to legal obligations).' },
                    { h: 'Your Rights', p: 'Under POPIA (Protection of Personal Information Act), you have the right to access, correct, and request deletion of your personal information. To exercise these rights, contact us via our Contact page.' },
                    { h: 'Security', p: 'We implement industry-standard security measures to protect your personal information. Our site is served over HTTPS and our backend is powered by Supabase with Row Level Security enabled.' },
                    { h: 'Contact', p: 'For any privacy concerns, please contact us via our Contact page.' },
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
