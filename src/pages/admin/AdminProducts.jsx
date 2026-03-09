import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*, categories(name), product_images(image_url, sort_order)')
            .order('display_order', { ascending: true });
        if (error) toast.error(error.message);
        else setProducts(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchProducts(); }, []);

    const toggleAvailability = async (p) => {
        const next = p.availability === 'in_stock' ? 'sold_out' : 'in_stock';
        const { error } = await supabase.from('products').update({ availability: next }).eq('id', p.id);
        if (error) { toast.error(error.message); return; }
        toast.success(`${p.name} marked as ${next.replace('_', ' ')}`);
        fetchProducts();
    };

    const deleteProduct = async (id, name) => {
        if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) { toast.error(error.message); return; }
        toast.success('Product deleted');
        fetchProducts();
    };

    const availBadge = a => {
        if (a === 'in_stock') return <span className="badge badge--paid">In Stock</span>;
        if (a === 'preorder') return <span className="badge badge--pending">Pre-order</span>;
        return <span className="badge badge--cancelled">Sold Out</span>;
    };

    return (
        <AdminLayout title="Products">
            <div className="admin-page-header">
                <h2>{products.length} Products</h2>
                <Link to="/admin/products/new" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
                    <Plus size={15} /> Add Product
                </Link>
            </div>

            <div className="admin-card">
                {loading ? <div className="spinner" /> : (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Availability</th><th>Featured</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {products.map(p => {
                                    const thumb = p.product_images?.sort((a, b) => a.sort_order - b.sort_order)[0]?.image_url;
                                    return (
                                        <tr key={p.id}>
                                            <td>
                                                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--color-grey-light)' }}>
                                                    {thumb && <img src={thumb} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                                                </div>
                                            </td>
                                            <td><strong>{p.name}</strong><br /><span style={{ fontSize: '0.73rem', color: 'var(--color-text-secondary)' }}>{p.slug}</span></td>
                                            <td style={{ fontSize: '0.82rem' }}>{p.categories?.name || '—'}</td>
                                            <td>${Number(p.price).toFixed(2)}</td>
                                            <td>{availBadge(p.availability)}</td>
                                            <td>{p.featured ? '⭐' : '—'}</td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                                                    <button className="icon-btn" title="Edit" onClick={() => { }} >
                                                        <Link to={`/admin/products/${p.id}`}><Pencil size={15} /></Link>
                                                    </button>
                                                    <button className="icon-btn" title="Toggle availability" onClick={() => toggleAvailability(p)}>
                                                        {p.availability === 'in_stock' ? <ToggleRight size={18} color="var(--color-success)" /> : <ToggleLeft size={18} />}
                                                    </button>
                                                    <button className="icon-btn icon-btn--danger" title="Delete" onClick={() => deleteProduct(p.id, p.name)}>
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {products.length === 0 && (
                                    <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>No products yet. <Link to="/admin/products/new">Add your first one.</Link></td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
