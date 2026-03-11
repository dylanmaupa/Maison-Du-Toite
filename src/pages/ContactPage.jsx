import { useState } from 'react';
import Footer from '../components/Footer';
import FadeIn from '../components/animations/FadeIn';
import SEO from '../components/SEO';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sent, setSent] = useState(false);

    const waNumber = import.meta.env.VITE_WHATSAPP_GENERAL_NUMBER;

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = e => {
        e.preventDefault();
        // For now: open WhatsApp with the contact message
        const msg = `Hi Maison du Torte,\n\nName: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\n${form.message}`;
        window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
        setSent(true);
    };

    return (
        <main>
            <SEO 
                title="Contact | Maison du Torte" 
                description="Get in touch for orders or inquiries. Exclusively available for delivery and pickup."
            />
            <FadeIn className="page-header" delay={0.1}>
                <p className="page-header__pre">Get in Touch</p>
                <h1 className="page-header__title">Contact Us</h1>
                <p className="page-header__sub">We'd love to hear from you.</p>
            </FadeIn>

            <section className="section container" style={{ maxWidth: 860, marginTop: 'var(--space-xl)' }}>
                <FadeIn style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)', alignItems: 'start' }}>

                    {/* Info */}
                    <div>
                        <p className="section-pre">Visit & Order</p>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', marginBottom: 'var(--space-sm)' }}>
                            Maison du Torte
                        </h2>
                        <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-md)' }}>
                            Exclusively available for delivery and pickup orders. Reach us via WhatsApp for the fastest response.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 600 }}>WhatsApp</p>
                                <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer"
                                    style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem' }}>
                                    Chat with us
                                </a>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--color-gold)', fontWeight: 600 }}>Hours</p>
                                <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem' }}>Mon – Sat · 7am – 12pm</p>
                                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Or until sold out</p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    {!sent ? (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input id="name" name="name" className="form-input" value={form.name} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input id="email" name="email" type="email" className="form-input" value={form.email} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="subject">Subject</label>
                                <input id="subject" name="subject" className="form-input" value={form.subject} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" name="message" className="form-textarea" value={form.message} onChange={handleChange} required />
                            </div>
                            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Send via WhatsApp</button>
                        </form>
                    ) : (
                        <div style={{ textAlign: 'center', padding: 'var(--space-xl) 0' }}>
                            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '0.75rem' }}>Message sent.</p>
                            <p style={{ color: 'var(--color-text-secondary)' }}>WhatsApp should have opened. We'll respond as soon as we can.</p>
                            <button className="btn-outline" onClick={() => setSent(false)} style={{ marginTop: 'var(--space-md)' }}>Send another</button>
                        </div>
                    )}
                </FadeIn>
            </section>

            <Footer />
        </main>
    );
}
