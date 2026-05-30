import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getSession } from 'next-auth/react';

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (session) return { redirect: { destination: '/', permanent: false } };
  return { props: {} };
}

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '', password: '', confirm: '',
    companyName: '', gstin: '', address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const inp = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (form.gstin && !/^[A-Z0-9]{15}$/i.test(form.gstin)) {
      setError('GSTIN must be exactly 15 alphanumeric characters');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          companyName: form.companyName,
          gstin: form.gstin,
          address: form.address,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Signup failed'); setLoading(false); return; }
      router.push('/login?signup=done');
    } catch (e) {
      setError('Network error — please try again');
      setLoading(false);
    }
  };

  const style = {
    input: {
      display: 'block', width: '100%', padding: '9px 12px',
      border: '1px solid #C8C0B4', borderRadius: 4, fontSize: 14,
      fontFamily: 'DM Sans, sans-serif', background: '#fff', outline: 'none',
      boxSizing: 'border-box',
    },
    label: {
      display: 'block', fontSize: 11, fontWeight: 600, color: '#6B6460',
      textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 5,
    },
  };

  return (
    <>
      <Head>
        <title>Sign Up — Kraya AP</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div style={{ minHeight: '100vh', background: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif', padding: '20px 0' }}>
        <div style={{ width: '100%', maxWidth: 440, padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px', color: '#1A1A1A' }}>
              K<span style={{ color: '#D8261C' }}>.</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', marginTop: 8 }}>Create your workspace</div>
            <div style={{ fontSize: 13, color: '#6B6460', marginTop: 4 }}>Start automating AP for your company</div>
          </div>

          <div style={{ background: '#fff', border: '1px solid #E8E2D9', borderRadius: 8, padding: 28, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            {error && (
              <div style={{ background: '#FDECEA', border: '1px solid #f5c6c4', borderRadius: 4, padding: '9px 12px', fontSize: 13, color: '#D8261C', marginBottom: 16 }}>
                {error}
              </div>
            )}

            <form onSubmit={submit}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #E8E2D9' }}>
                Company Details
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={style.label}>Company Name *</label>
                <input style={style.input} required value={form.companyName} onChange={inp('companyName')} placeholder="Acme Manufacturing Pvt Ltd" />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={style.label}>GSTIN (15 chars)</label>
                <input style={style.input} value={form.gstin} onChange={inp('gstin')} placeholder="27AABCB1234F1Z5" maxLength={15} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={style.label}>Address</label>
                <input style={style.input} value={form.address} onChange={inp('address')} placeholder="123 Industrial Area, Mumbai" />
              </div>

              <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #E8E2D9' }}>
                Admin Account
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={style.label}>Email *</label>
                <input style={style.input} type="email" required value={form.email} onChange={inp('email')} placeholder="admin@yourcompany.com" autoFocus />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={style.label}>Password * (min 8 chars)</label>
                <input style={style.input} type="password" required value={form.password} onChange={inp('password')} placeholder="••••••••" />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={style.label}>Confirm Password *</label>
                <input style={style.input} type="password" required value={form.confirm} onChange={inp('confirm')} placeholder="••••••••" />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '11px 16px',
                  background: loading ? '#e88882' : '#D8261C',
                  color: '#fff', border: 'none', borderRadius: 4, fontSize: 14,
                  fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {loading ? 'Creating workspace…' : 'Create Workspace'}
              </button>
            </form>
          </div>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: '#A09890' }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#D8261C', textDecoration: 'none', fontWeight: 600 }}>
              Sign in
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
