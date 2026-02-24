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
                        <h2 className="story__heading">Born from a belief in beautiful objects</h2>
                        <p>
                            Maison du Toite was founded in the early 2000s by two artisans who shared a singular conviction: that the objects we live with should be made to endure, to inspire, and to bring quiet beauty into everyday life.
                        </p>
                        <p>
                            Our name — meaning "House of the Rooftop" — reflects our origins in a small Parisian atelier, perched above the city's rooftops, where craft and contemplation went hand in hand.
                        </p>
                    </div>
                    <div className="story__img-wrap">
                        <img src="https://images.unsplash.com/photo-1616047006789-b53439c2d53a?w=800&q=80" alt="The atelier" />
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
                            { title: 'Craft', body: 'Every piece begins with the hands of a skilled artisan. We partner exclusively with heritage workshops that share our commitment to traditional techniques.' },
                            { title: 'Longevity', body: 'We design for permanence. Our objects are made to outlast their owners, carrying their stories forward through generations.' },
                            { title: 'Restraint', body: 'We believe in doing less, but doing it exceptionally. Our edit is small by design — every piece earns its place.' },
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
                <Link to="/shop" className="btn-primary">Explore the Collection</Link>
            </div>

            <Footer />
        </main>
    );
}
