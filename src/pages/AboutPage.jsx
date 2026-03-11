import Footer from '../components/Footer';
import FadeIn from '../components/animations/FadeIn';
import SEO from '../components/SEO';
import './OurStoryPage.css';
import './LandingPage.css';

export default function AboutPage() {
    return (
        <main>
            <SEO 
                title="About Us | Maison du Torte" 
                description="A story told through flour, butter, and devotion. Meet the pastry chefs behind the craft."
            />
            <FadeIn className="page-header" delay={0.1}>
                <p className="page-header__pre">Est. MMI · Paris</p>
                <h1 className="page-header__title">About Maison du Torte</h1>
                <p className="page-header__sub">A story told through flour, butter, and devotion.</p>
            </FadeIn>

            <section className="story__section container" style={{ padding: 'var(--space-2xl) auto' }}>
            <section className="story__section container" style={{ padding: 'var(--space-2xl) auto' }}>
                <FadeIn className="story__grid" style={{ marginTop: 'var(--space-xl)' }}>
                    <div className="story__text">
                        <p className="section-pre">Who We Are</p>
                        <h2 className="story__heading">A Parisian atelier, born above the rooftops</h2>
                        <p>
                            Maison du Torte was founded by two pastry chefs who believed that food should be as considered as the lives we lead. What began as a small atelier perched above the Parisian skyline has grown into a beloved boutique Bakery, still guided by the same quiet devotion to craft.
                        </p>
                        <p style={{ marginTop: '1rem' }}>
                            Every item on our menu is baked fresh each morning, using only premium ingredients sourced from trusted artisan suppliers. We bake in small batches — not because it is easy, but because it is right.
                        </p>
                        <p style={{ marginTop: '1rem' }}>
                            When the day's bake is done, we close. No reheating, no compromises.
                        </p>
                    </div>
                    <div className="story__img-wrap">
                        <img src="/bakery_story.png" alt="Maison du Torte bakery atelier" />
                    </div>
                </FadeIn>
            </section>
            </section>

            <section className="story__values">
            <section className="story__values">
                <FadeIn className="container">
                    <div className="section-header">
                        <p className="section-pre">What Guides Us</p>
                        <h2 className="section-title">Our Values</h2>
                    </div>
                    <div className="story__values-grid">
                        {[
                            { title: 'Craft', body: 'Every creation begins with the hands of a trained pastry chef. We source from heritage suppliers that share our devotion to technique and excellence.' },
                            { title: 'Freshness', body: 'We bake each morning and serve until sold out. No preservatives, no shortcuts. Our day ends when the last tray empties.' },
                            { title: 'Restraint', body: 'We bake fewer things, but bake them exceptionally. Our menu is intentionally small — every item earns its place.' },
                        ].map(v => (
                            <div key={v.title} className="story__value-card">
                                <h3>{v.title}</h3>
                                <p>{v.body}</p>
                            </div>
                        ))}
                    </div>
                </FadeIn>
            </section>
            </section>

            <Footer />
        </main>
    );
}
