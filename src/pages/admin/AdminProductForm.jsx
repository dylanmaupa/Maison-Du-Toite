import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Upload, X, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY = {
    name: '', slug: '', description: '', price: '',
    category_id: '', featured: false, availability: 'in_stock',
    lead_time: '', display_order: 0,
};

export default function AdminProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [form, setForm] = useState(EMPTY);
    const [categories, setCategories] = useState([]);
    const [images, setImages] = useState([]); // { url, isNew, file? }
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Load categories
    useEffect(() => {
        supabase.from('categories').select('id, name').order('name').then(({ data }) => {
            setCategories(data || []);
        });
    }, []);

    // Load product if editing
    useEffect(() => {
        if (!isEdit) return;
        supabase.from('products')
            .select('*, product_images(id, image_url, sort_order)')
            .eq('id', id)
            .single()
            .then(({ data }) => {
                if (!data) return;
                const { product_images, ...rest } = data;
                setForm({ ...EMPTY, ...rest, price: String(rest.price), category_id: rest.category_id || '' });
                setImages((product_images || [])
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map(i => ({ url: i.image_url, id: i.id, isNew: false })));
            });
    }, [id]);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const autoSlug = name => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const handleNameChange = e => {
        set('name', e.target.value);
        if (!isEdit || !form.slug) set('slug', autoSlug(e.target.value));
    };

    const handleImageFiles = async (files) => {
        setUploading(true);
        for (const file of files) {
            const path = `${Date.now()}-${file.name}`;
            const { data, error } = await supabase.storage.from('product-images').upload(path, file);
            if (error) { toast.error(`Upload failed: ${error.message}`); continue; }
            const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(data.path);
            setImages(prev => [...prev, { url: publicUrl, isNew: true }]);
        }
        setUploading(false);
    };

    const removeImage = (idx) => setImages(imgs => imgs.filter((_, i) => i !== idx));

    const handleSubmit = async e => {
        e.preventDefault();
        if (!form.name || !form.price) { toast.error('Name and price are required'); return; }
        setSaving(true);

        const payload = {
            name: form.name,
            slug: form.slug || autoSlug(form.name),
            description: form.description,
            price: parseFloat(form.price),
            category_id: form.category_id || null,
            featured: form.featured,
            availability: form.availability,
            lead_time: form.lead_time,
            display_order: Number(form.display_order),
        };

        let productId = id;
        if (isEdit) {
            const { error } = await supabase.from('products').update(payload).eq('id', id);
            if (error) { toast.error(error.message); setSaving(false); return; }
        } else {
            const { data, error } = await supabase.from('products').insert(payload).select().single();
            if (error) { toast.error(error.message); setSaving(false); return; }
            productId = data.id;
        }

        // Sync images: delete old, insert current
        await supabase.from('product_images').delete().eq('product_id', productId);
        if (images.length > 0) {
            await supabase.from('product_images').insert(
                images.map((img, i) => ({ product_id: productId, image_url: img.url, sort_order: i }))
            );
        }

        toast.success(isEdit ? 'Product updated!' : 'Product created!');
        navigate('/admin/products');
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Product' : 'New Product'}>
            <form onSubmit={handleSubmit} style={{ maxWidth: 780 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>

                    {/* Name */}
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Product Name *</label>
                        <input className="form-input" value={form.name} onChange={handleNameChange} required />
                    </div>

                    {/* Slug */}
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Slug (URL)</label>
                        <input className="form-input" value={form.slug} onChange={e => set('slug', e.target.value)} />
                    </div>

                    {/* Price */}
                    <div className="form-group">
                        <label>Price (R) *</label>
                        <input type="number" step="0.01" min="0" className="form-input" value={form.price}
                            onChange={e => set('price', e.target.value)} required />
                    </div>

                    {/* Category */}
                    <div className="form-group">
                        <label>Category</label>
                        <select className="form-select" value={form.category_id} onChange={e => set('category_id', e.target.value)}>
                            <option value="">— None —</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    {/* Availability */}
                    <div className="form-group">
                        <label>Availability</label>
                        <select className="form-select" value={form.availability} onChange={e => set('availability', e.target.value)}>
                            <option value="in_stock">In Stock</option>
                            <option value="preorder">Pre-order</option>
                            <option value="sold_out">Sold Out</option>
                        </select>
                    </div>

                    {/* Lead time */}
                    <div className="form-group">
                        <label>Lead Time (e.g. "48 hours")</label>
                        <input className="form-input" placeholder="48 hours" value={form.lead_time}
                            onChange={e => set('lead_time', e.target.value)} />
                    </div>

                    {/* Display order */}
                    <div className="form-group">
                        <label>Display Order</label>
                        <input type="number" min="0" className="form-input" value={form.display_order}
                            onChange={e => set('display_order', e.target.value)} />
                    </div>

                    {/* Featured */}
                    <div className="form-group" style={{ justifyContent: 'center' }}>
                        <label>Featured on Homepage</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', paddingTop: '0.85rem' }}>
                            <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}
                                style={{ accentColor: 'var(--color-gold)', width: 18, height: 18 }} />
                            <span style={{ fontSize: '0.9rem' }}>Yes, feature this product</span>
                        </label>
                    </div>

                    {/* Description */}
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                        <label>Description</label>
                        <textarea className="form-textarea" value={form.description}
                            onChange={e => set('description', e.target.value)} style={{ minHeight: 120 }} />
                    </div>
                </div>

                {/* Images */}
                <div style={{ marginTop: 'var(--space-md)' }}>
                    <label className="form-group" style={{ marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-secondary)' }}>Product Images</span>
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-start' }}>
                        {images.map((img, i) => (
                            <div key={i} style={{ position: 'relative', width: 100, height: 100, borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1.5px solid var(--color-grey-mid)' }}>
                                <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <button type="button" onClick={() => removeImage(i)}
                                    style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <X size={12} />
                                </button>
                            </div>
                        ))}

                        {/* Upload trigger */}
                        <label style={{ width: 100, height: 100, border: '2px dashed var(--color-grey-mid)', borderRadius: 'var(--radius-sm)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', gap: '0.3rem', color: 'var(--color-text-secondary)', fontSize: '0.72rem' }}>
                            {uploading ? <Loader size={20} className="spinner" style={{ width: 20, height: 20, margin: 0 }} /> : <Upload size={20} />}
                            <span>{uploading ? 'Uploading...' : 'Add Image'}</span>
                            <input type="file" accept="image/*" multiple style={{ display: 'none' }}
                                onChange={e => handleImageFiles(Array.from(e.target.files))} />
                        </label>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>First image is the cover. Drag to reorder (coming soon).</p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: 'var(--space-lg)' }}>
                    <button type="submit" className="btn-primary" disabled={saving}>
                        {saving ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
                    </button>
                    <button type="button" className="btn-outline" onClick={() => navigate('/admin/products')}>Cancel</button>
                </div>
            </form>
        </AdminLayout>
    );
}
