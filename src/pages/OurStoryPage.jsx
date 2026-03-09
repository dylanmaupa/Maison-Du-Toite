import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './OurStoryPage.css';

export default function OurStoryPage() {
    return (
        <main className="story">
            <div className="story__hero">
                <div className="story__hero-bg" />
                <div className="story__hero-content">
                    <p className="section-pre" style={{ color: 'var(--color-gold)' }}>Est. MMI · Paris</p>
                    <h1 className="story__hero-title">Our Story</h1>
                </div>
            </div>

            <section className="story__section container">
                <div className="story__grid">
                    <div className="story__text">
                        <p className="section-pre">The Beginning</p>
                        <h2 className="story__heading">Born from a love of beautiful baking</h2>
                        <p>
                            Maison du Toite was founded in the early 2000s by two pastry chefs who shared a singular conviction: that the things we eat should be made to inspire, to comfort, and to bring quiet beauty into everyday moments.
                        </p>
                        <p>
                            Our name — meaning “House of the Rooftop” — reflects our origins in a small Parisian atelier perched above the city’s rooftops, where flour, butter, and contemplation went hand in hand.
                        </p>
                    </div>
                    <div className="story__img-wrap">
                        <img src="/bakery_story.png" alt="The bakery atelier" />
                    </div>
                </div>
            </section>

            <section className="story__values">
                <div className="container">
                    <div className="section-header">
                        <p className="section-pre">What Guides Us</p>
                        <h2 className="section-title">Our Values</h2>
                    </div>
                    <div className="story__values-grid">
                        {[
                            { title: 'Craft', body: 'Every creation begins with the hands of a trained pastry chef. We source exclusively from heritage suppliers that share our commitment to traditional techniques and exceptional ingredients.' },
                            { title: 'Freshness', body: 'We bake each morning and serve until sold out. No preservatives, no shortcuts. Our day ends when the last tray empties.' },
                            { title: 'Restraint', body: 'We believe in baking fewer things, but baking them exceptionally well. Our menu is small by design — every item earns its place.' },
                        ].map(v => (
                            <div key={v.title} className="story__value-card">
                                <h3>{v.title}</h3>
                                <p>{v.body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="story__cta container">
                <Link to="/shop" className="btn-primary">Explore the Bakery</Link>
            </div>

            <Footer />
        </main>
    );
}
