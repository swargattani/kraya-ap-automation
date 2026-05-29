import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Setup() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    setError('');
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password, role: 'admin', setup: true }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Setup failed'); setLoading(false); return; }
    router.push('/login?setup=done');
  };

  const inp = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const style = { display: 'block', width: '100%', padding: '9px 12px', border: '1px solid #C8C0B4', borderRadius: 4, fontSize: 14, fontFamily: 'DM Sans, sans-serif', background: '#fff', outline: 'none', boxSizing: 'border-box' };
  const lbl = { display: 'block', fontSize: 11, fontWeight: 600, color: '#6B6460', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 5 };

  return (
    <>
      <Head><title>Setup — Kraya AP</title></Head>
      <div style={{ minHeight: '100vh', background: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif' }}>
        <div style={{ width: '100%', maxWidth: 400, padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#1A1A1A' }}>K<span style={{ color: '#D8261C' }}>.</span></div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', marginTop: 6 }}>Create Admin Account</div>
            <div style={{ fontSize: 13, color: '#6B6460', marginTop: 4 }}>First-time workspace setup</div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #E8E2D9', borderRadius: 8, padding: 28, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            {error && <div style={{ background: '#FDECEA', border: '1px solid #f5c6c4', borderRadius: 4, padding: '9px 12px', fontSize: 13, color: '#D8261C', marginBottom: 16 }}>{error}</div>}
            <form onSubmit={submit}>
              <div style={{ marginBottom: 14 }}><label style={lbl}>Full Name</label><input style={style} required value={form.name} onChange={inp('name')} placeholder="Accounts Manager" /></div>
              <div style={{ marginBottom: 14 }}><label style={lbl}>Email</label><input style={style} type="email" required value={form.email} onChange={inp('email')} placeholder="admin@company.com" /></div>
              <div style={{ marginBottom: 14 }}><label style={lbl}>Password</label><input style={style} type="password" required value={form.password} onChange={inp('password')} placeholder="Min 8 characters" /></div>
              <div style={{ marginBottom: 20 }}><label style={lbl}>Confirm Password</label><input style={style} type="password" required value={form.confirm} onChange={inp('confirm')} placeholder="Re-enter password" /></div>
              <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px 16px', background: '#D8261C', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
                {loading ? 'Creating account…' : 'Create Admin Account →'}
              </button>
            </form>
          </div>
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: '#A09890' }}>
            Already set up? <a href="/login" style={{ color: '#D8261C', textDecoration: 'none' }}>Sign in →</a>
          </div>
        </div>
      </div>
    </>
  );
}
