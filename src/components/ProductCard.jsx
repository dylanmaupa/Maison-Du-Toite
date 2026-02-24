import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
    const { addItem } = useCart();

    return (
        <div className="product-card">
            <Link to={`/product/${product.id}`} className="product-card__image-wrap">
                <img src={product.images[0]} alt={product.name} className="product-card__img" loading="lazy" />
                {product.tag && <span className="product-card__tag label-tag">{product.tag}</span>}
                <div className="product-card__overlay">
                    <button
                        className="btn-primary product-card__quick-add"
                        onClick={e => { e.preventDefault(); addItem(product, 1, product.colors[0]); }}
                    >
                        Quick Add
                    </button>
                </div>
            </Link>
            <div className="product-card__info">
                <p className="product-card__category">{product.category}</p>
                <Link to={`/product/${product.id}`}>
                    <h3 className="product-card__name">{product.name}</h3>
                </Link>
                <p className="product-card__price">${product.price.toLocaleString()}</p>
            </div>
        </div>
    );
}
