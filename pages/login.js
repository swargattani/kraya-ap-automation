import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (session) return { redirect: { destination: '/', permanent: false } };
  return { props: {} };
}

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', { ...form, redirect: false });
    if (res?.ok) {
      router.push('/');
    } else {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login — Kraya AP</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </Head>
      <div style={{
        minHeight: '100vh', background: '#FAF7F2', display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontFamily: 'DM Sans, sans-serif',
      }}>
        <div style={{ width: '100%', maxWidth: 380, padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-1px', color: '#1A1A1A' }}>
              K<span style={{ color: '#D8261C' }}>.</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', marginTop: 8, letterSpacing: '-0.5px' }}>
              Kraya AP Automation
            </div>
            <div style={{ fontSize: 13, color: '#6B6460', marginTop: 4 }}>
              Haldiram Snacks Pvt Ltd
            </div>
          </div>

          <div style={{
            background: '#fff', border: '1px solid #E8E2D9', borderRadius: 8,
            padding: 28, boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 20, color: '#1A1A1A' }}>
              Sign in to continue
            </div>

            {error && (
              <div style={{
                background: '#FDECEA', border: '1px solid #f5c6c4', borderRadius: 4,
                padding: '9px 12px', fontSize: 13, color: '#D8261C', marginBottom: 16,
              }}>
                {error}
              </div>
            )}

            <form onSubmit={submit}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6B6460', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 5 }}>
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={{
                    display: 'block', width: '100%', padding: '9px 12px',
                    border: '1px solid #C8C0B4', borderRadius: 4, fontSize: 14,
                    fontFamily: 'DM Sans, sans-serif', background: '#fff', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  placeholder="you@company.com"
                  autoFocus
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6B6460', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 5 }}>
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  style={{
                    display: 'block', width: '100%', padding: '9px 12px',
                    border: '1px solid #C8C0B4', borderRadius: 4, fontSize: 14,
                    fontFamily: 'DM Sans, sans-serif', background: '#fff', outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '10px 16px', background: loading ? '#e88882' : '#D8261C',
                  color: '#fff', border: 'none', borderRadius: 4, fontSize: 14,
                  fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          </div>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#A09890' }}>
            No account?{' '}
            <a href="/setup" style={{ color: '#D8261C', textDecoration: 'none' }}>
              Set up workspace →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
