import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';
import { ShoppingBag, Search, Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { totalItems } = useCart();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar__inner container">

                {/* Mobile menu toggle */}
                <button className="navbar__hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>

                {/* Nav links */}
                <ul className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
                    <li><Link to="/shop" onClick={() => setMenuOpen(false)}>Pastries</Link></li>
                    <li><Link to="/shop?filter=new" onClick={() => setMenuOpen(false)}>Seasonal</Link></li>
                    <li><Link to="/our-story" onClick={() => setMenuOpen(false)}>Our Story</Link></li>
                </ul>

                {/* Logo */}
                <Link to="/" className="navbar__logo">Maison du Toite</Link>

                {/* Icons */}
                <div className="navbar__icons">
                    <button aria-label="Search"><Search size={18} /></button>
                    <button aria-label="Wishlist"><Heart size={18} /></button>
                    <button className="navbar__bag" onClick={() => navigate('/cart')} aria-label="Shopping bag">
                        <ShoppingBag size={18} />
                        {totalItems > 0 && <span className="navbar__badge">{totalItems}</span>}
                    </button>
                </div>
            </div>
        </nav>
    );
}
