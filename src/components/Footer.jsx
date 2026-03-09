import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__inner container">
                <div className="footer__brand">
                    <span className="footer__logo">Maison du Toite</span>
                    <p className="footer__tagline">Baked with love. Savoured beautifully.</p>
                </div>

                <div className="footer__columns">
                    <div className="footer__col">
                        <h4 className="footer__col-title">Boulangerie</h4>
                        <ul>
                            <li><Link to="/our-story">Our Heritage</Link></li>
                            <li><a href="#">Ingredients</a></li>
                            <li><a href="#">The Bakers</a></li>
                        </ul>
                    </div>
                    <div className="footer__col">
                        <h4 className="footer__col-title">Orders</h4>
                        <ul>
                            <li><a href="#">Delivery & Collection</a></li>
                            <li><a href="#">Contact Us</a></li>
                            <li><a href="#">FAQs</a></li>
                        </ul>
                    </div>
                    <div className="footer__col">
                        <h4 className="footer__col-title">Social</h4>
                        <ul>
                            <li><a href="#">Instagram</a></li>
                            <li><a href="#">Pinterest</a></li>
                            <li><a href="#">Newsletter</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="footer__bottom container">
                <p>© {new Date().getFullYear()} Maison du Toite. All rights reserved.</p>
                <div className="footer__legal">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}
