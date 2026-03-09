import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import '../../components/admin/AdminLayout.css';

export default function AdminLogin() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        const { error } = await signIn(email, password);
        setLoading(false);
        if (error) {
            toast.error(error.message || 'Invalid credentials');
        } else {
            navigate('/admin');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--color-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
        }}>
            <div style={{
                background: 'var(--color-white)',
                borderRadius: 'var(--radius-md)',
                padding: '3rem',
                width: '100%',
                maxWidth: 400,
                boxShadow: 'var(--shadow-lg)',
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '0.4rem' }}>
                        Maison du Toite
                    </h1>
                    <p style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--color-gold)' }}>
                        Admin Portal
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input id="email" type="email" className="form-input" value={email}
                            onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input id="password" type="password" className="form-input" value={password}
                            onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
                    </div>
                    <button type="submit" className="btn-dark" disabled={loading} style={{ width: '100%', marginTop: '0.5rem', textAlign: 'center' }}>
                        {loading ? 'Signing in…' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
