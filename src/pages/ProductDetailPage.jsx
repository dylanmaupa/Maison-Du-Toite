import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import Footer from '../components/Footer';
import './ProductDetailPage.css';
import { ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const product = PRODUCTS.find(p => p.id === Number(id));
    const { addItem } = useCart();

    const [imgIndex, setImgIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState(product?.colors[0] ?? null);
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);

    if (!product) return (
        <div className="pdp-404 container">
            <h2>Product not found</h2>
            <button className="btn-dark" onClick={() => navigate('/shop')}>Back to Shop</button>
        </div>
    );

    const handleAdd = () => {
        addItem(product, qty, selectedColor);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const related = PRODUCTS.filter(p => p.id !== product.id && p.category === product.category).slice(0, 3);

    return (
        <main className="pdp">
            <div className="pdp__inner container">
                {/* Gallery */}
                <div className="pdp__gallery">
                    <div className="pdp__main-img-wrap">
                        <img src={product.images[imgIndex]} alt={product.name} className="pdp__main-img" />
                        {product.images.length > 1 && (
                            <>
                                <button className="pdp__img-btn pdp__img-btn--prev" onClick={() => setImgIndex(i => (i - 1 + product.images.length) % product.images.length)}>
                                    <ChevronLeft size={20} />
                                </button>
                                <button className="pdp__img-btn pdp__img-btn--next" onClick={() => setImgIndex(i => (i + 1) % product.images.length)}>
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}
                    </div>
                    <div className="pdp__thumbnails">
                        {product.images.map((img, i) => (
                            <button
                                key={i}
                                className={`pdp__thumb ${i === imgIndex ? 'pdp__thumb--active' : ''}`}
                                onClick={() => setImgIndex(i)}
                            >
                                <img src={img} alt={`View ${i + 1}`} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div className="pdp__info">
                    {product.tag && <span className="label-tag pdp__tag">{product.tag}</span>}
                    <p className="pdp__category">{product.category}</p>
                    <h1 className="pdp__name">{product.name}</h1>
                    <p className="pdp__price">${product.price.toLocaleString()}</p>

                    <p className="pdp__desc">{product.description}</p>

                    {product.leadTime && (
                        <div className="pdp__notice">
                            <span>⏳</span> {product.leadTime}
                        </div>
                    )}

                    {/* Color selector */}
                    <div className="pdp__colors">
                        <p className="pdp__label">Colour</p>
                        <div className="pdp__color-options">
                            {product.colors.map(c => (
                                <button
                                    key={c}
                                    className={`pdp__color-dot ${selectedColor === c ? 'pdp__color-dot--active' : ''}`}
                                    style={{ background: c }}
                                    onClick={() => setSelectedColor(c)}
                                    aria-label={`Select colour ${c}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="pdp__qty">
                        <p className="pdp__label">Quantity</p>
                        <div className="pdp__qty-controls">
                            <button onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={14} /></button>
                            <span>{qty}</span>
                            <button onClick={() => setQty(q => q + 1)}><Plus size={14} /></button>
                        </div>
                    </div>

                    <button className={`btn-primary pdp__add-btn ${added ? 'pdp__add-btn--added' : ''}`} onClick={handleAdd}>
                        {added ? '✓ Added to Bag' : 'Add to Bag'}
                    </button>

                    <div className="pdp__meta">
                        <p>Free shipping on orders over $500</p>
                        <p>Returns within 14 days</p>
                    </div>
                </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
                <section className="pdp__related container">
                    <h2 className="pdp__related-title">You May Also Desire</h2>
                    <div className="pdp__related-grid">
                        {related.map(p => (
                            <div key={p.id} className="pdp__related-card" onClick={() => navigate(`/product/${p.id}`)}>
                                <div className="pdp__related-img-wrap">
                                    <img src={p.images[0]} alt={p.name} />
                                </div>
                                <p className="pdp__related-name">{p.name}</p>
                                <p className="pdp__related-price">${p.price.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <Footer />
        </main>
    );
}
