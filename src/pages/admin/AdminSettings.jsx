import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

const KEYS = [
    { key: 'whatsapp_order_number', label: 'WhatsApp Order Number', hint: 'With country code, no +, e.g. 27821234567' },
    { key: 'whatsapp_general_number', label: 'WhatsApp General Enquiries', hint: 'Can be same as order number' },
    { key: 'announcement_text', label: 'Announcement Banner Text', hint: 'Leave blank to hide' },
    { key: 'instagram_url', label: 'Instagram URL', hint: '' },
    { key: 'facebook_url', label: 'Facebook URL', hint: '' },
    { key: 'tiktok_url', label: 'TikTok URL', hint: '' },
];

export default function AdminSettings() {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [announcementActive, setAnnouncementActive] = useState(false);

    useEffect(() => {
        supabase.from('settings').select('key, value').then(({ data }) => {
            const obj = {};
            (data || []).forEach(r => { obj[r.key] = r.value; });
            setSettings(obj);
            setAnnouncementActive(obj.announcement_active === 'true');
            setLoading(false);
        });
    }, []);

    const set = (k, v) => setSettings(s => ({ ...s, [k]: v }));

    const save = async () => {
        setSaving(true);
        const updates = [
            ...KEYS.map(({ key }) => ({ key, value: settings[key] || '' })),
            { key: 'announcement_active', value: String(announcementActive) },
        ];

        // Upsert each setting
        for (const u of updates) {
            await supabase.from('settings').upsert({ key: u.key, value: u.value }, { onConflict: 'key' });
        }
        toast.success('Settings saved!');
        setSaving(false);
    };

    if (loading) return <AdminLayout title="Settings"><div className="spinner" /></AdminLayout>;

    return (
        <AdminLayout title="Site Settings">
            <div style={{ maxWidth: 640 }}>
                <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {KEYS.map(({ key, label, hint }) => (
                        <div key={key} className="form-group">
                            <label>{label}</label>
                            <input className="form-input" value={settings[key] || ''}
                                onChange={e => set(key, e.target.value)} />
                            {hint && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: 3 }}>{hint}</p>}
                        </div>
                    ))}

                    {/* Announcement toggle */}
                    <div className="form-group">
                        <label>Announcement Banner Active</label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', paddingTop: '0.5rem' }}>
                            <input type="checkbox" checked={announcementActive} onChange={e => setAnnouncementActive(e.target.checked)}
                                style={{ accentColor: 'var(--color-gold)', width: 18, height: 18 }} />
                            <span style={{ fontSize: '0.9rem' }}>Show announcement banner on homepage</span>
                        </label>
                    </div>

                    <button className="btn-primary" onClick={save} disabled={saving}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'flex-start' }}>
                        <Save size={15} />
                        {saving ? 'Saving…' : 'Save Settings'}
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}
