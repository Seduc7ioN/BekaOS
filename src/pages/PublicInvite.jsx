import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const THEMES = {
  gold: {
    bg: 'linear-gradient(135deg, #1a1505 0%, #0d0a03 50%, #1a1505 100%)',
    accent: '#d4a853',
    accentLight: 'rgba(212,168,83,0.15)',
    border: 'rgba(212,168,83,0.25)',
    text: '#f5e6c8',
    textMuted: 'rgba(212,168,83,0.6)',
    icon: '✨',
    pattern: 'radial-gradient(ellipse at 30% 20%, rgba(212,168,83,0.08) 0%, transparent 50%)',
  },
  rose: {
    bg: 'linear-gradient(135deg, #1a0a14 0%, #0d0508 50%, #1a0a14 100%)',
    accent: '#e879a0',
    accentLight: 'rgba(232,121,160,0.12)',
    border: 'rgba(232,121,160,0.25)',
    text: '#fce4ec',
    textMuted: 'rgba(232,121,160,0.6)',
    icon: '🌹',
    pattern: 'radial-gradient(ellipse at 70% 30%, rgba(232,121,160,0.08) 0%, transparent 50%)',
  },
  nature: {
    bg: 'linear-gradient(135deg, #0a1a0d 0%, #050d07 50%, #0a1a0d 100%)',
    accent: '#6ee7b7',
    accentLight: 'rgba(110,231,183,0.12)',
    border: 'rgba(110,231,183,0.25)',
    text: '#d1fae5',
    textMuted: 'rgba(110,231,183,0.6)',
    icon: '🌿',
    pattern: 'radial-gradient(ellipse at 50% 80%, rgba(110,231,183,0.08) 0%, transparent 50%)',
  },
  night: {
    bg: 'linear-gradient(135deg, #0a0a1e 0%, #050510 50%, #0a0a1e 100%)',
    accent: '#a78bfa',
    accentLight: 'rgba(167,139,250,0.12)',
    border: 'rgba(167,139,250,0.25)',
    text: '#ede9fe',
    textMuted: 'rgba(167,139,250,0.6)',
    icon: '🌙',
    pattern: 'radial-gradient(ellipse at 80% 20%, rgba(167,139,250,0.08) 0%, transparent 50%)',
  },
  ocean: {
    bg: 'linear-gradient(135deg, #0a1520 0%, #050a10 50%, #0a1520 100%)',
    accent: '#38bdf8',
    accentLight: 'rgba(56,189,248,0.12)',
    border: 'rgba(56,189,248,0.25)',
    text: '#e0f2fe',
    textMuted: 'rgba(56,189,248,0.6)',
    icon: '🌊',
    pattern: 'radial-gradient(ellipse at 20% 70%, rgba(56,189,248,0.08) 0%, transparent 50%)',
  },
}

const EVENT_EMOJIS = {
  'Düğün': '💒', 'Nişan': '💍', 'Doğum Günü': '🎂', 'Kına': '🎊',
  'Söz': '🤝', 'Kurumsal': '🏢', 'Sünnet': '🎗️', 'Baby Shower': '👶',
}

export default function PublicInvitePage({ eventId }) {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState('invite') // invite | rsvp | thanks | gift
  const [rsvp, setRsvp] = useState(null)
  const [guestForm, setGuestForm] = useState({ name: '', phone: '', response: '', food: 'Standart', plus: 0, children: 0 })
  const [copied, setCopied] = useState(false)

  useEffect(() => { loadEvent() }, [eventId])

  const loadEvent = async () => {
    const { data } = await supabase.from('events').select('*').eq('id', eventId).single()
    setEvent(data)
    setLoading(false)
  }

  const submitRsvp = async () => {
    if (!guestForm.name || !guestForm.response) return
    await supabase.from('guests').insert({
      event_id: eventId,
      company_id: event.company_id,
      name: guestForm.name,
      phone: guestForm.phone,
      response: guestForm.response,
      food: guestForm.food,
      plus: parseInt(guestForm.plus) || 0,
      children: parseInt(guestForm.children) || 0,
    })
    setRsvp(guestForm.response)
    setStep(guestForm.response === 'katılamıyor' ? 'gift' : 'thanks')
  }

  const copyIban = () => {
    navigator.clipboard?.writeText(event?.iban || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#111827' }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-purple-500 animate-spin"/>
        <span className="text-xs text-white/30">Davetiye yükleniyor...</span>
      </div>
    </div>
  )

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#111827' }}>
      <div className="text-center">
        <div className="text-5xl mb-4">😔</div>
        <div className="text-white/60 text-sm font-medium">Davetiye bulunamadı</div>
        <div className="text-white/30 text-xs mt-1">Bu davetiye silinmiş veya link hatalı olabilir</div>
      </div>
    </div>
  )

  const theme = THEMES[event.theme] || THEMES.gold
  const emoji = EVENT_EMOJIS[event.type] || '🎉'

  // THANKS SCREEN
  if (step === 'thanks') return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: theme.bg, backgroundImage: theme.pattern }}>
      <div className="text-center max-w-sm w-full">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: theme.text }}>Teşekkürler!</h2>
        <p className="text-sm mb-6" style={{ color: theme.textMuted }}>
          {guestForm.name.split(' ')[0]}, katılımınız kaydedildi.<br/>
          {event.date} tarihinde görüşmek üzere!
        </p>
        <div className="p-4 rounded-2xl mb-6" style={{ background: theme.accentLight, border: `1px solid ${theme.border}` }}>
          <div className="text-xs mb-1" style={{ color: theme.textMuted }}>Etkinlik Detayı</div>
          <div className="text-sm font-medium" style={{ color: theme.text }}>📅 {event.date} • 🕐 {event.time}</div>
          <div className="text-sm" style={{ color: theme.text }}>📍 {event.location}</div>
        </div>
        <button onClick={() => setStep('invite')}
          className="text-xs px-6 py-2 rounded-xl transition-all hover:opacity-80"
          style={{ background: theme.accentLight, color: theme.accent, border: `1px solid ${theme.border}` }}>
          Davetiyeyi Tekrar Gör
        </button>
      </div>
    </div>
  )

  // GIFT / IBAN SCREEN
  if (step === 'gift') return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: theme.bg, backgroundImage: theme.pattern }}>
      <div className="text-center max-w-sm w-full">
        <div className="text-5xl mb-4">💝</div>
        <h2 className="text-xl font-bold mb-2" style={{ color: theme.text }}>Hediye Gönder</h2>
        <p className="text-sm mb-6" style={{ color: theme.textMuted }}>
          Katılamıyorsanız ama {event.client.split(' ')[0]} için güzel bir dilek göndermek isterseniz:
        </p>
        {event.iban ? (
          <div className="p-5 rounded-2xl mb-6 text-left" style={{ background: theme.accentLight, border: `1px solid ${theme.border}` }}>
            <div className="text-[10px] uppercase tracking-wider mb-3" style={{ color: theme.textMuted }}>IBAN Bilgisi</div>
            <div className="font-mono text-sm font-medium mb-1 break-all" style={{ color: theme.text }}>{event.iban}</div>
            {event.iban_name && <div className="text-xs mb-3" style={{ color: theme.textMuted }}>{event.iban_name}</div>}
            <button onClick={copyIban}
              className="w-full py-2.5 rounded-xl text-xs font-medium transition-all hover:opacity-80"
              style={{ background: theme.accent, color: '#000' }}>
              {copied ? '✓ Kopyalandı!' : 'IBAN\'ı Kopyala'}
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl mb-6" style={{ background: theme.accentLight, border: `1px solid ${theme.border}` }}>
            <div className="text-sm" style={{ color: theme.textMuted }}>Hediye bilgisi henüz eklenmemiş</div>
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <button onClick={() => setStep('invite')}
            className="text-xs px-6 py-2 rounded-xl transition-all hover:opacity-80"
            style={{ background: theme.accentLight, color: theme.accent, border: `1px solid ${theme.border}` }}>
            Davetiyeye Dön
          </button>
        </div>
      </div>
    </div>
  )

  // RSVP SCREEN
  if (step === 'rsvp') return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: theme.bg, backgroundImage: theme.pattern }}>
      <div className="w-full max-w-sm">
        <button onClick={() => setStep('invite')} className="text-xs mb-6 flex items-center gap-1 transition-all hover:opacity-80" style={{ color: theme.textMuted }}>
          ← Davetiyeye Dön
        </button>
        <h2 className="text-xl font-bold mb-1" style={{ color: theme.text }}>Cevabınız</h2>
        <p className="text-sm mb-6" style={{ color: theme.textMuted }}>Lütfen katılım durumunuzu belirtin</p>

        {/* Response Options */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { val: 'katılıyor', label: 'Geliyorum', icon: '✅', desc: 'Katılacağım' },
            { val: 'belki', label: 'Belki', icon: '🤔', desc: 'Emin değilim' },
            { val: 'katılamıyor', label: 'Gelemiyorum', icon: '😢', desc: 'Katılamıyorum' },
          ].map(o => (
            <button key={o.val} onClick={() => setGuestForm(p => ({ ...p, response: o.val }))}
              className="p-4 rounded-2xl border text-center transition-all"
              style={{
                background: guestForm.response === o.val ? theme.accentLight : 'rgba(255,255,255,0.02)',
                borderColor: guestForm.response === o.val ? theme.accent : theme.border,
              }}>
              <div className="text-2xl mb-1">{o.icon}</div>
              <div className="text-xs font-medium" style={{ color: theme.text }}>{o.label}</div>
              <div className="text-[9px] mt-0.5" style={{ color: theme.textMuted }}>{o.desc}</div>
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="space-y-3 mb-6">
          <input value={guestForm.name} onChange={e => setGuestForm(p => ({ ...p, name: e.target.value }))}
            placeholder="Adınız Soyadınız *"
            className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${theme.border}`, color: theme.text }} />
          <input value={guestForm.phone} onChange={e => setGuestForm(p => ({ ...p, phone: e.target.value }))}
            placeholder="Telefon (opsiyonel)"
            className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${theme.border}`, color: theme.text }} />
          <div className="grid grid-cols-2 gap-3">
            <select value={guestForm.food} onChange={e => setGuestForm(p => ({ ...p, food: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${theme.border}`, color: theme.text }}>
              <option value="Standart">Standart</option>
              <option value="Vejetaryen">Vejetaryen</option>
              <option value="Vegan">Vegan</option>
              <option value="Glutensiz">Glutensiz</option>
            </select>
            <select value={guestForm.plus} onChange={e => setGuestForm(p => ({ ...p, plus: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${theme.border}`, color: theme.text }}>
              <option value="0">+0 Kişi</option>
              <option value="1">+1 Kişi</option>
              <option value="2">+2 Kişi</option>
              <option value="3">+3 Kişi</option>
            </select>
          </div>
        </div>

        <button onClick={submitRsvp} disabled={!guestForm.name || !guestForm.response}
          className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
          style={{ background: theme.accent, color: '#000' }}>
          Gönder
        </button>
      </div>
    </div>
  )

  // MAIN INVITE SCREEN
  return (
    <div className="min-h-screen flex flex-col" style={{ background: theme.bg, backgroundImage: theme.pattern }}>
      {/* Decorative Top */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-sm w-full">
          {/* Animated Icon */}
          <div className="text-6xl mb-4 animate-pulse">{emoji}</div>

          {/* Type Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-4"
            style={{ background: theme.accentLight, border: `1px solid ${theme.border}` }}>
            <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: theme.accent }}>{event.type}</span>
          </div>

          {/* Client Name */}
          <h1 className="text-3xl md:text-4xl font-bold mb-2 leading-tight" style={{ color: theme.text }}>
            {event.client}
          </h1>

          {/* Divider */}
          <div className="w-16 h-px mx-auto my-5" style={{ background: theme.border }}/>

          {/* Details */}
          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-center gap-3">
              <span style={{ color: theme.textMuted }}>📅</span>
              <span className="text-sm font-medium" style={{ color: theme.text }}>{event.date}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span style={{ color: theme.textMuted }}>🕐</span>
              <span className="text-sm" style={{ color: theme.text }}>{event.time}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span style={{ color: theme.textMuted }}>📍</span>
              <span className="text-sm" style={{ color: theme.text }}>{event.location}</span>
            </div>
            {event.guests > 0 && (
              <div className="flex items-center justify-center gap-3">
                <span style={{ color: theme.textMuted }}>👥</span>
                <span className="text-sm" style={{ color: theme.text }}>{event.guests} Misafir</span>
              </div>
            )}
          </div>

          {/* CTA */}
          <button onClick={() => setStep('rsvp')}
            className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95 mb-4"
            style={{ background: theme.accent, color: '#000' }}>
            Cevabını Bildir
          </button>

          <p className="text-[10px]" style={{ color: theme.textMuted }}>
            Davetiye: {event.client} • {event.date}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-[9px]" style={{ color: 'rgba(255,255,255,0.15)' }}>merasim.app ile oluşturuldu</p>
      </div>
    </div>
  )
}
