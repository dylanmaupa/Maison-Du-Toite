import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Plus, Trash2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_ZONE = { name: '', fee: '', free_threshold: '', display_order: 0 };

export default function AdminDelivery() {
    const [zones, setZones] = useState([]);
    const [adding, setAdding] = useState(false);
    const [newZone, setNewZone] = useState(EMPTY_ZONE);
    const [editId, setEditId] = useState(null);

    const fetch = async () => {
        const { data } = await supabase.from('delivery_zones').select('*').order('display_order');
        setZones(data || []);
    };

    useEffect(() => { fetch(); }, []);

    const addZone = async () => {
        if (!newZone.name || newZone.fee === '') { toast.error('Name and fee are required'); return; }
        const { error } = await supabase.from('delivery_zones').insert({
            name: newZone.name,
            fee: parseFloat(newZone.fee),
            free_threshold: newZone.free_threshold ? parseFloat(newZone.free_threshold) : null,
            display_order: Number(newZone.display_order),
        });
        if (error) { toast.error(error.message); return; }
        toast.success('Zone added');
        setAdding(false);
        setNewZone(EMPTY_ZONE);
        fetch();
    };

    const updateZone = async (zone) => {
        const { error } = await supabase.from('delivery_zones').update({
            name: zone.name,
            fee: parseFloat(zone.fee),
            free_threshold: zone.free_threshold ? parseFloat(zone.free_threshold) : null,
        }).eq('id', zone.id);
        if (error) { toast.error(error.message); return; }
        toast.success('Zone updated');
        setEditId(null);
        fetch();
    };

    const deleteZone = async (id, name) => {
        if (!confirm(`Delete zone "${name}"?`)) return;
        await supabase.from('delivery_zones').delete().eq('id', id);
        toast.success('Zone deleted');
        fetch();
    };

    const edit = (z) => setZones(zs => zs.map(z2 => z2.id === z.id ? { ...z } : z2));

    return (
        <AdminLayout title="Delivery Zones">
            <div className="admin-page-header">
                <h2>{zones.length} Zones</h2>
                <button className="btn-primary" onClick={() => setAdding(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
                    <Plus size={15} /> Add Zone
                </button>
            </div>

            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Delivery zones define the fee for each area. Set a free threshold to offer free delivery above a certain order amount.
            </p>

            {adding && (
                <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', marginBottom: '1rem' }}>New Zone</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        {[['Zone Name', 'name', 'text', 'e.g. Sandton'], ['Fee (R)', 'fee', 'number', '50'], ['Free delivery above (R, optional)', 'free_threshold', 'number', '500']].map(([label, key, type, ph]) => (
                            <div key={key} className="form-group">
                                <label>{label}</label>
                                <input type={type} className="form-input" placeholder={ph} value={newZone[key]}
                                    onChange={e => setNewZone(z => ({ ...z, [key]: e.target.value }))} />
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn-primary" onClick={addZone} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Save size={14} /> Save</button>
                        <button className="btn-outline" onClick={() => setAdding(false)} style={{ fontSize: '0.75rem' }}>Cancel</button>
                    </div>
                </div>
            )}

            <div className="admin-card">
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead><tr><th>Zone Name</th><th>Delivery Fee</th><th>Free Above</th><th>Actions</th></tr></thead>
                        <tbody>
                            {zones.map(z => (
                                <tr key={z.id}>
                                    <td>
                                        {editId === z.id
                                            ? <input className="form-input" value={z.name} style={{ padding: '0.4rem 0.6rem' }}
                                                onChange={e => edit({ ...z, name: e.target.value })} />
                                            : <strong>{z.name}</strong>}
                                    </td>
                                    <td>
                                        {editId === z.id
                                            ? <input type="number" className="form-input" value={z.fee} style={{ padding: '0.4rem 0.6rem', width: 100 }}
                                                onChange={e => edit({ ...z, fee: e.target.value })} />
                                            : `$${Number(z.fee).toFixed(2)}`}
                                    </td>
                                    <td style={{ color: 'var(--color-text-secondary)' }}>
                                        {editId === z.id
                                            ? <input type="number" className="form-input" value={z.free_threshold || ''} placeholder="None" style={{ padding: '0.4rem 0.6rem', width: 100 }}
                                                onChange={e => edit({ ...z, free_threshold: e.target.value })} />
                                            : z.free_threshold ? `$${Number(z.free_threshold).toFixed(2)}` : '—'}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            {editId === z.id
                                                ? <button className="icon-btn" onClick={() => updateZone(z)}><Save size={15} /></button>
                                                : <button className="icon-btn" onClick={() => setEditId(z.id)}>✏️</button>}
                                            <button className="icon-btn icon-btn--danger" onClick={() => deleteZone(z.id, z.name)}><Trash2 size={15} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {zones.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>No zones yet.</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
