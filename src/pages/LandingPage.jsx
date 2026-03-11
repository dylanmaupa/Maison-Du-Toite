import { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';
import Footer from '../components/Footer';
import FadeIn from '../components/animations/FadeIn';
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
                <FadeIn className="hero__content" delay={0.2}>
                    <p className="hero__pre">Est. MMI · Paris</p>
                    <h1 className="hero__title">Baked with love.<br />Savoured beautifully.</h1>
                    <p className="hero__sub">
                        The pinnacle of artisanal baking — where every creation tells a story of exceptional craft and timeless indulgence.
                    </p>
                    <Link to="/shop" className="btn-primary hero__cta">Shop the Bakery</Link>
                </FadeIn>
                <div className="hero__scroll-hint">
                    <span>Scroll</span>
                    <div className="hero__scroll-line" />
                </div>
            </section>

            {/* ── Featured Products ── */}
            <section className="featured section">
                <FadeIn className="container">
                    <div className="section-header">
                        <p className="section-pre">From Our Oven</p>
                        <h2 className="section-title">Signature Creations</h2>
                        <p className="section-sub">Each piece baked fresh daily, for the discerning palate.</p>
                    </div>
                    <div className="featured__grid">
                        {featured.map(p => <ProductCard key={p.id} product={p} />)}
                    </div>
                    <div className="featured__cta-wrap">
                        <Link to="/shop" className="btn-outline">View All Bakes</Link>
                    </div>
                </FadeIn>
            </section>

            {/* ── Brand Story Banner ── */}
            <section className="story-banner">
                <FadeIn className="story-banner__inner container">
                    <div className="story-banner__text">
                        <p className="section-pre" style={{ color: 'var(--color-gold)' }}>Our Philosophy</p>
                        <h2 className="story-banner__title">Where craft meets quiet indulgence</h2>
                        <p className="story-banner__body">
                            Maison du Torte was born from a singular belief: that the food we share should be as considered as the lives we lead. Each creation in our atelier bakery is the result of a deep devotion to heritage technique and exceptional ingredients.
                        </p>
                        <Link to="/our-story" className="btn-primary">Discover Our Story</Link>
                    </div>
                    <div className="story-banner__image">
                        <img
                            src="/bakery_story.png"
                            alt="Artisan baker at work"
                        />
                    </div>
                </FadeIn>
            </section>

            {/* ── Membership ── */}
            <section className="membership section">
                <FadeIn className="container">
                    <div className="membership__inner">
                        <div className="membership__text">
                            <p className="section-pre">Exclusive Access</p>
                            <h2 className="membership__title">Join the Maison Circle</h2>
                            <p className="membership__sub">
                                Early morning pre-orders, seasonal tasting events, and first access to limited editions — reserved for our inner circle.
                            </p>
                        </div>
                        {subscribed ? (
                            <div className="membership__success">
                                <p>Welcome to the Maison Circle. We'll have fresh pastries waiting for you.</p>
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
                </FadeIn>
            </section>

            <Footer />
        </main>
    );
}
