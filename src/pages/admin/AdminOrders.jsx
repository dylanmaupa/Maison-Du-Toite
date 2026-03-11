import { useEffect, useState, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { buildWhatsAppMessage, openWhatsApp } from '../../lib/whatsapp';
import { Eye, MessageCircle, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';

const STATUSES = [
    'all', 'pending_cod', 'pending_payment', 'paid', 'confirmed',
    'preparing', 'ready', 'delivered', 'cancelled', 'failed',
];

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [downloading, setDownloading] = useState(false);
    const receiptRef = useRef(null);

    const downloadReceipt = async () => {
        if (!receiptRef.current || !selected) return;
        setDownloading(true);
        try {
            const canvas = await html2canvas(receiptRef.current, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width / 2, canvas.height / 2]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
            pdf.save(`Maison_Du_Torte_Receipt_${selected.order_number}.pdf`);
        } catch (err) {
            console.error('Failed to generate receipt', err);
            toast.error('Failed to download receipt');
        } finally {
            setDownloading(false);
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        let q = supabase
            .from('orders')
            .select('*, order_items(product_name, quantity, price)')
            .order('created_at', { ascending: false });
        if (filter !== 'all') q = q.eq('order_status', filter);
        const { data, error } = await q;
        if (error) toast.error(error.message);
        else setOrders(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchOrders(); }, [filter]);

    const updateStatus = async (id, status) => {
        const { error } = await supabase.from('orders').update({ order_status: status }).eq('id', id);
        if (error) { toast.error(error.message); return; }
        toast.success('Status updated');
        fetchOrders();
        if (selected?.id === id) setSelected(o => ({ ...o, order_status: status }));
    };

    const copyWhatsApp = (order) => {
        const items = (order.order_items || []).map(i => ({
            name: i.product_name, quantity: i.quantity, price: i.price,
        }));
        const msg = buildWhatsAppMessage(order, items);
        navigator.clipboard.writeText(msg);
        toast.success('WhatsApp message copied!');
    };

    const statusBadge = s => {
        const map = { paid: 'badge--paid', confirmed: 'badge--paid', delivered: 'badge--paid', pending_cod: 'badge--pending', pending_payment: 'badge--pending', cancelled: 'badge--cancelled', failed: 'badge--cancelled' };
        return `badge ${map[s] || 'badge--pending'}`;
    };

    return (
        <AdminLayout title="Orders">
            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {STATUSES.map(s => (
                    <button key={s} onClick={() => setFilter(s)}
                        className={filter === s ? 'btn-dark' : 'btn-outline'}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.72rem', textTransform: 'capitalize' }}>
                        {s.replace(/_/g, ' ')}
                    </button>
                ))}
            </div>

            <div className="admin-card">
                {loading ? <div className="spinner" /> : (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Order #</th><th>Customer</th><th>Phone</th>
                                    <th>Method</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(o => (
                                    <tr key={o.id}>
                                        <td><strong>{o.order_number}</strong></td>
                                        <td>{o.customer_name}</td>
                                        <td style={{ fontSize: '0.8rem' }}>{o.phone}</td>
                                        <td style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>{o.payment_method}</td>
                                        <td>${Number(o.total).toFixed(2)}</td>
                                        <td>
                                            <select value={o.order_status} className="form-select"
                                                style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', width: 'auto' }}
                                                onChange={e => updateStatus(o.id, e.target.value)}>
                                                {STATUSES.filter(s => s !== 'all').map(s => (
                                                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                                            {new Date(o.created_at).toLocaleDateString()}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                <button className="icon-btn" title="View detail" onClick={() => setSelected(o)}><Eye size={15} /></button>
                                                <button className="icon-btn" title="Copy WhatsApp msg" onClick={() => copyWhatsApp(o)}><MessageCircle size={15} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {orders.length === 0 && (
                                    <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>No orders found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selected && (
                <div onClick={() => setSelected(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-md)', padding: '2rem', width: '100%', maxWidth: 560, maxHeight: '90vh', overflowY: 'auto' }}>
                        <div ref={receiptRef} style={{ background: 'var(--color-white)', padding: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem' }}>Order {selected.order_number}</h2>
                                <button data-html2canvas-ignore="true" onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                            </div>
                            {[
                                ['Customer', selected.customer_name],
                                ['Phone', selected.phone],
                                ['Email', selected.email],
                                ['Delivery', selected.delivery_method],
                                ['Address', selected.address || 'Pickup'],
                                ['Preferred Date', selected.preferred_date || 'Not specified'],
                                ['Payment', selected.payment_method],
                                ['Status', selected.order_status],
                                ['Notes', selected.notes || 'None'],
                            ].map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', gap: '1rem', padding: '0.6rem 0', borderBottom: '1px solid var(--color-grey-mid)', fontSize: '0.85rem' }}>
                                    <span style={{ width: 130, color: 'var(--color-text-secondary)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', flexShrink: 0 }}>{k}</span>
                                    <span>{v}</span>
                                </div>
                            ))}

                            {/* Items */}
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', margin: '1.25rem 0 0.75rem' }}>Items</h3>
                            {(selected.order_items || []).map((i, idx) => (
                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.4rem 0', borderBottom: '1px solid var(--color-grey-light)' }}>
                                    <span>{i.product_name} × {i.quantity}</span>
                                    <span>${(Number(i.price) * i.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.9rem', marginTop: '0.75rem' }}>
                                <span>Total</span><span>${Number(selected.total).toFixed(2)}</span>
                            </div>

                        </div> {/* End Receipt Ref */}

                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }} data-html2canvas-ignore="true">
                            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                onClick={() => { copyWhatsApp(selected); openWhatsApp(buildWhatsAppMessage(selected, selected.order_items?.map(i => ({ name: i.product_name, quantity: i.quantity, price: i.price })) || [])); }}>
                                <MessageCircle size={15} /> Open WhatsApp
                            </button>
                            <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                onClick={downloadReceipt} disabled={downloading}>
                                <Download size={15} /> {downloading ? 'Downloading...' : 'Download PDF Receipt'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
