import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';
import Footer from '../components/Footer';
import './LandingPage.css';

export default function LandingPage() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const featured = PRODUCTS.slice(0, 4);

    const handleSubscribe = e => {
        e.preventDefault();
        if (email) { setSubscribed(true); setEmail(''); }
    };

    return (
        <main className="landing">

            {/* ── Hero ── */}
            <section className="hero">
                <div className="hero__bg" />
                <div className="hero__content">
                    <p className="hero__pre">Est. MMI · Paris</p>
                    <h1 className="hero__title">Curated indulgence.<br />Crafted beautifully.</h1>
                    <p className="hero__sub">
                        The pinnacle of artisanal luxury — where every object tells a story of exceptional skill and timeless beauty.
                    </p>
                    <Link to="/shop" className="btn-primary hero__cta">Shop Collection</Link>
                </div>
                <div className="hero__scroll-hint">
                    <span>Scroll</span>
                    <div className="hero__scroll-line" />
                </div>
            </section>

            {/* ── Featured Products ── */}
            <section className="featured section">
                <div className="container">
                    <div className="section-header">
                        <p className="section-pre">Our Curation</p>
                        <h2 className="section-title">Exquisite Selection</h2>
                        <p className="section-sub">Objects of desire, selected for the discerning few.</p>
                    </div>
                    <div className="featured__grid">
                        {featured.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                    <div className="featured__cta-wrap">
                        <Link to="/shop" className="btn-outline">View All Pieces</Link>
                    </div>
                </div>
            </section>

            {/* ── Brand Story Banner ── */}
            <section className="story-banner">
                <div className="story-banner__inner container">
                    <div className="story-banner__text">
                        <p className="section-pre" style={{ color: 'var(--color-gold)' }}>Our Philosophy</p>
                        <h2 className="story-banner__title">Where craft meets quiet luxury</h2>
                        <p className="story-banner__body">
                            Maison du Toite was born from a singular belief: that the objects surrounding us should be as considered as the lives we lead. Each piece in our atelier is the result of a deep collaboration between heritage craftspeople and contemporary vision.
                        </p>
                        <Link to="/our-story" className="btn-primary">Discover Our Story</Link>
                    </div>
                    <div className="story-banner__image">
                        <img
                            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80"
                            alt="Atelier craftsmanship"
                        />
                    </div>
                </div>
            </section>

            {/* ── Membership ── */}
            <section className="membership section">
                <div className="container">
                    <div className="membership__inner">
                        <div className="membership__text">
                            <p className="section-pre">Exclusive Access</p>
                            <h2 className="membership__title">Join the Maison Circle</h2>
                            <p className="membership__sub">
                                Private previews, styling sessions, and first access to limited editions — reserved for our inner circle.
                            </p>
                        </div>
                        {subscribed ? (
                            <div className="membership__success">
                                <p>Welcome to the Maison Circle. We'll be in touch.</p>
                            </div>
                        ) : (
                            <form className="membership__form" onSubmit={handleSubscribe}>
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                    className="membership__input"
                                />
                                <button type="submit" className="btn-dark">Subscribe</button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
