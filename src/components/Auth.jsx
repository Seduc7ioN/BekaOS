import { useState } from 'react'
import { firebaseReady, login, loginWithGoogle, registerStudio } from '../services/firebase'
import { friendlyError } from '../utils/errors'

export default function Auth({ onBack, onSuccess }) {
  const [registering, setRegistering] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      if (registering) await registerStudio(form)
      else await login(form.email, form.password)
      onSuccess()
    } catch (caught) {
      setError(friendlyError(caught))
    } finally {
      setBusy(false)
    }
  }

  const google = async () => {
    setBusy(true)
    setError('')
    try {
      await loginWithGoogle()
      onSuccess()
    } catch (caught) {
      setError(friendlyError(caught))
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-page">
      <button className="brand auth-brand" type="button" onClick={onBack}><span>M</span> merasim.ai</button>
      <section className="auth-card">
        <span className="eyebrow">{registering ? 'Stüdyonu oluştur' : 'Tekrar hoş geldin'}</span>
        <h1>{registering ? 'İlk videona başla.' : 'Stüdyona giriş yap.'}</h1>
        <p>Projelerini, üretimlerini ve kredilerini tek yerden yönet.</p>

        {!firebaseReady && (
          <div className="notice">Canlı giriş için Firebase ortam değişkenleri eklenmeli. Demo stüdyo kullanılabilir.</div>
        )}

        <form onSubmit={submit}>
          {registering && (
            <label>Stüdyo adı<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label>
          )}
          <label>E-posta<input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
          <label>Şifre<input type="password" minLength="6" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
          {error && <div className="error">{error}</div>}
          <button className="btn btn-primary" disabled={busy || !firebaseReady}>{busy ? 'Bekleyin…' : registering ? 'Hesap oluştur' : 'Giriş yap'}</button>
        </form>

        <button className="btn btn-google" type="button" onClick={google} disabled={busy || !firebaseReady}>Google ile devam et</button>
        <button className="text-button" type="button" onClick={() => setRegistering(!registering)}>
          {registering ? 'Zaten hesabın var mı? Giriş yap' : 'Hesabın yok mu? Stüdyonu oluştur'}
        </button>
        <button className="text-button" type="button" onClick={onBack}>Ana sayfaya dön</button>
      </section>
    </main>
  )
}
