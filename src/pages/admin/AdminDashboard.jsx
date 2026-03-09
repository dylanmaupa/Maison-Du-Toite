import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { ShoppingBag, Clock, CreditCard, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ total: 0, pendingCod: 0, paid: 0, revenue: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const [{ data: orders }] = await Promise.all([
                supabase.from('orders').select('order_status, total, created_at, customer_name, order_number'),
            ]);

            if (orders) {
                const thisMonth = new Date();
                thisMonth.setDate(1);
                thisMonth.setHours(0, 0, 0, 0);

                const total = orders.length;
                const pendingCod = orders.filter(o => o.order_status === 'pending_cod').length;
                const paid = orders.filter(o => ['paid', 'confirmed', 'preparing', 'ready', 'delivered'].includes(o.order_status)).length;
                const revenue = orders
                    .filter(o => o.order_status === 'paid' && new Date(o.created_at) >= thisMonth)
                    .reduce((sum, o) => sum + Number(o.total), 0);

                setStats({ total, pendingCod, paid, revenue });
                setRecentOrders(orders.slice(-8).reverse());
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    const statusColor = s => {
        if (['paid', 'confirmed', 'delivered'].includes(s)) return 'badge--paid';
        if (s === 'pending_cod' || s === 'pending_payment') return 'badge--pending';
        if (s === 'cancelled' || s === 'failed') return 'badge--cancelled';
        return 'badge badge--pending';
    };

    return (
        <AdminLayout title="Dashboard">
            {loading ? <div className="spinner" /> : (
                <>
                    {/* Stats */}
                    <div className="admin-stats">
                        {[
                            { label: 'Total Orders', value: stats.total, icon: ShoppingBag, sub: 'All time' },
                            { label: 'Pending COD', value: stats.pendingCod, icon: Clock, sub: 'Awaiting WhatsApp' },
                            { label: 'Paid Orders', value: stats.paid, icon: CreditCard, sub: 'Confirmed payments' },
                            { label: 'Revenue This Month', value: `$${stats.revenue.toFixed(2)}`, icon: TrendingUp, sub: 'Paid orders only' },
                        ].map(s => (
                            <div key={s.label} className="admin-stat">
                                <p className="admin-stat__label">{s.label}</p>
                                <p className="admin-stat__value">{s.value}</p>
                                <p className="admin-stat__sub">{s.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Recent Orders */}
                    <div className="admin-card">
                        <div className="admin-page-header">
                            <h2>Recent Orders</h2>
                        </div>
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Order #</th>
                                        <th>Customer</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map(o => (
                                        <tr key={o.order_number}>
                                            <td><strong>{o.order_number}</strong></td>
                                            <td>{o.customer_name}</td>
                                            <td>${Number(o.total).toFixed(2)}</td>
                                            <td><span className={`badge ${statusColor(o.order_status)}`}>{o.order_status.replace(/_/g, ' ')}</span></td>
                                            <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                                                {new Date(o.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {recentOrders.length === 0 && (
                                        <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '2rem' }}>No orders yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </AdminLayout>
    );
}
