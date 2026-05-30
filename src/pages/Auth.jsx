import { useState } from 'react'
import { supabase, signIn, signUp } from '../lib/supabase'

export default function AuthPage() {
  const [mode, setMode] = useState('login') // login | register | reset
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password)
        if (error) throw error
      } else if (mode === 'register') {
        const { error } = await signUp(email, password, companyName)
        if (error) throw error
        setSuccess('Kayıt başarılı! E-posta adresinizi kontrol edin.')
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) throw error
        setSuccess('Şifre sıfırlama linki e-posta adresinize gönderildi.')
      }
    } catch (err) {
      setError(err.message || 'Bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{background:"#111827"}}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="14" r="8" stroke="white" strokeWidth="2"/>
              <text x="16" y="18" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fontWeight="700" fill="white">M</text>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Merasim</h1>
          <p className="text-sm text-white/40 mt-1">Etkinlik Yönetim Platformu</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 p-6" style={{background:"rgba(255,255,255,0.04)"}}>
          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{background:"rgba(255,255,255,0.03)"}}>
            <button
              onClick={()=>setMode('login')}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${mode==='login'?'bg-purple-500/20 text-purple-400':'text-white/40 hover:text-white/60'}`}
            >Giriş Yap</button>
            <button
              onClick={()=>setMode('register')}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${mode==='register'?'bg-purple-500/20 text-purple-400':'text-white/40 hover:text-white/60'}`}
            >Kayıt Ol</button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Şirket Adı</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="Organizasyon şirketiniz"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">E-posta</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="info@ornek.com"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>

            {mode !== 'reset' && (
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Şifre</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 transition-all hover:opacity-90"
              style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}
            >
              {loading ? 'İşleniyor...' : mode === 'login' ? 'Giriş Yap' : mode === 'register' ? 'Kayıt Ol' : 'Sıfırlama Linki Gönder'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-4 text-center">
            {mode === 'login' && (
              <button
                onClick={() => setMode('reset')}
                className="text-xs text-white/30 hover:text-purple-400 transition-colors"
              >
                Şifreni mi unuttun?
              </button>
            )}
            {mode === 'reset' && (
              <button
                onClick={() => setMode('login')}
                className="text-xs text-white/30 hover:text-purple-400 transition-colors"
              >
                Girişe dön
              </button>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/5"/>
            <span className="text-[10px] text-white/20">veya</span>
            <div className="flex-1 h-px bg-white/5"/>
          </div>

          {/* Google Login */}
          <button
            onClick={async () => {
              await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: `${window.location.origin}/auth/callback`,
                },
              })
            }}
            className="w-full py-3 rounded-xl text-sm font-medium text-white/70 border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2"
            style={{background:"rgba(255,255,255,0.03)"}}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google ile Giriş Yap
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-white/15 mt-6">
          © 2026 Merasim — merasim.app
        </p>
      </div>
    </div>
  )
}
