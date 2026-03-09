import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCategories() {
    const [cats, setCats] = useState([]);
    const [editing, setEditing] = useState(null); // null | 'new' | { id, name, slug }
    const [form, setForm] = useState({ name: '', slug: '' });

    const fetch = async () => {
        const { data } = await supabase.from('categories').select('*').order('display_order');
        setCats(data || []);
    };

    useEffect(() => { fetch(); }, []);

    const autoSlug = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    const startNew = () => { setEditing('new'); setForm({ name: '', slug: '' }); };
    const startEdit = c => { setEditing(c); setForm({ name: c.name, slug: c.slug }); };
    const cancel = () => setEditing(null);

    const save = async () => {
        if (!form.name) { toast.error('Name required'); return; }
        const payload = { name: form.name, slug: form.slug || autoSlug(form.name) };
        if (editing === 'new') {
            const { error } = await supabase.from('categories').insert(payload);
            if (error) { toast.error(error.message); return; }
            toast.success('Category created');
        } else {
            const { error } = await supabase.from('categories').update(payload).eq('id', editing.id);
            if (error) { toast.error(error.message); return; }
            toast.success('Category updated');
        }
        cancel();
        fetch();
    };

    const del = async (id, name) => {
        if (!confirm(`Delete "${name}"?`)) return;
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) { toast.error(error.message); return; }
        toast.success('Deleted');
        fetch();
    };

    return (
        <AdminLayout title="Categories">
            <div className="admin-page-header">
                <h2>{cats.length} Categories</h2>
                <button className="btn-primary" onClick={startNew} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
                    <Plus size={15} /> Add Category
                </button>
            </div>

            {/* Inline form */}
            {editing && (
                <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '1rem' }}>
                        {editing === 'new' ? 'New Category' : `Edit: ${editing.name}`}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group">
                            <label>Name</label>
                            <input className="form-input" value={form.name}
                                onChange={e => { setForm(f => ({ ...f, name: e.target.value, slug: autoSlug(e.target.value) })); }} />
                        </div>
                        <div className="form-group">
                            <label>Slug</label>
                            <input className="form-input" value={form.slug}
                                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn-primary" onClick={save} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
                            <Save size={14} /> Save
                        </button>
                        <button className="btn-outline" onClick={cancel} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
                            <X size={14} /> Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="admin-card">
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead><tr><th>Name</th><th>Slug</th><th>Actions</th></tr></thead>
                        <tbody>
                            {cats.map(c => (
                                <tr key={c.id}>
                                    <td><strong>{c.name}</strong></td>
                                    <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.82rem' }}>{c.slug}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button className="icon-btn" onClick={() => startEdit(c)}><Pencil size={15} /></button>
                                            <button className="icon-btn icon-btn--danger" onClick={() => del(c.id, c.name)}><Trash2 size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {cats.length === 0 && <tr><td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>No categories yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
