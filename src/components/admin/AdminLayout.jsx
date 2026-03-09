import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, Package, FolderOpen, ShoppingBag,
    Truck, Settings, LogOut, ChevronRight
} from 'lucide-react';
import './AdminLayout.css';

const NAV = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/categories', label: 'Categories', icon: FolderOpen },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/delivery', label: 'Delivery Zones', icon: Truck },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children, title }) {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await signOut();
        navigate('/admin/login');
    };

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar__brand">
                    <span className="admin-sidebar__logo">Maison du Toite</span>
                    <span className="admin-sidebar__role">Admin</span>
                </div>

                <nav className="admin-sidebar__nav">
                    {NAV.map(({ to, label, icon: Icon, exact }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={exact}
                            className={({ isActive }) =>
                                `admin-nav-item ${isActive ? 'admin-nav-item--active' : ''}`
                            }
                        >
                            <Icon size={18} />
                            <span>{label}</span>
                            <ChevronRight size={14} className="admin-nav-item__chevron" />
                        </NavLink>
                    ))}
                </nav>

                <button className="admin-sidebar__signout" onClick={handleSignOut}>
                    <LogOut size={16} />
                    <span>Sign Out</span>
                </button>
            </aside>

            {/* Main */}
            <div className="admin-main">
                <header className="admin-topbar">
                    <h1 className="admin-topbar__title">{title}</h1>
                    <span className="admin-topbar__user">{user?.email}</span>
                </header>
                <div className="admin-content">
                    {children}
                </div>
            </div>
        </div>
    );
}
