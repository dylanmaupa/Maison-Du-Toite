import { useState, useMemo } from 'react';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import FadeIn from '../components/animations/FadeIn';
import { PRODUCTS, CATEGORIES } from '../data/products';
import './ShopPage.css';

export default function ShopPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [sort, setSort] = useState('featured');

    const filtered = useMemo(() => {
        let list = activeCategory === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.category === activeCategory);
        if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
        if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
        return list;
    }, [activeCategory, sort]);

    return (
        <main className="shop">
            {/* Header */}
            <div className="shop__header">
                <FadeIn className="container">
                    <p className="section-pre">The Atelier</p>
                    <h1 className="shop__title">Our Collection</h1>
                    <p className="shop__sub">Each piece is chosen for its enduring beauty and exceptional craft.</p>
                </FadeIn>
            </div>

            <div className="container">
                {/* Filters & Sort */}
                <FadeIn className="shop__controls">
                    <div className="shop__categories">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                className={`shop__cat-btn ${activeCategory === cat ? 'shop__cat-btn--active' : ''}`}
                                onClick={() => {
                                    setActiveCategory(cat);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="shop__sort">
                        <label htmlFor="sort-select">Sort:</label>
                        <select id="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
                            <option value="featured">Featured</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>
                </FadeIn>

                <FadeIn className="shop__count" delay={0.1}>{filtered.length} pieces</FadeIn>

                {/* Grid */}
                <FadeIn className="shop__grid" delay={0.2}>
                    {filtered.map(p => <ProductCard key={p.id} product={p} />)}
                </FadeIn>
            </div>

            <div style={{ marginTop: 'var(--space-2xl)' }}>
                <Footer />
            </div>
        </main>
    );
}
