import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const THEMES = {
  gold: {
    bg: '#1a1505',
    cardBg: 'rgba(212,168,83,0.08)',
    accent: '#fbbf24',
    accentDark: '#d4a853',
    border: 'rgba(251,191,36,0.3)',
    text: '#fff',
    textSub: '#fbbf24',
    textMuted: 'rgba(255,255,255,0.7)',
    btnBg: '#fbbf24',
    btnText: '#1a1505',
    icon: '✨',
  },
  rose: {
    bg: '#1a0a14',
    cardBg: 'rgba(232,121,160,0.08)',
    accent: '#fb7185',
    accentDark: '#e879a0',
    border: 'rgba(251,113,133,0.3)',
    text: '#fff',
    textSub: '#fb7185',
    textMuted: 'rgba(255,255,255,0.7)',
    btnBg: '#fb7185',
    btnText: '#1a0a14',
    icon: '🌹',
  },
  nature: {
    bg: '#0a1a0d',
    cardBg: 'rgba(110,231,183,0.08)',
    accent: '#34d399',
    accentDark: '#6ee7b7',
    border: 'rgba(52,211,153,0.3)',
    text: '#fff',
    textSub: '#34d399',
    textMuted: 'rgba(255,255,255,0.7)',
    btnBg: '#34d399',
    btnText: '#0a1a0d',
    icon: '🌿',
  },
  night: {
    bg: '#0a0a1e',
    cardBg: 'rgba(139,92,246,0.1)',
    accent: '#a78bfa',
    accentDark: '#8b5cf6',
    border: 'rgba(139,92,246,0.3)',
    text: '#fff',
    textSub: '#a78bfa',
    textMuted: 'rgba(255,255,255,0.7)',
    btnBg: '#a78bfa',
    btnText: '#0a0a1e',
    icon: '🌙',
  },
  ocean: {
    bg: '#0a1520',
    cardBg: 'rgba(56,189,248,0.08)',
    accent: '#38bdf8',
    accentDark: '#0ea5e9',
    border: 'rgba(56,189,248,0.3)',
    text: '#fff',
    textSub: '#38bdf8',
    textMuted: 'rgba(255,255,255,0.7)',
    btnBg: '#38bdf8',
    btnText: '#0a1520',
    icon: '🌊',
  },
}

const EVENT_EMOJIS = {
  'Düğün': '💒', 'Nişan': '💍', 'Doğum Günü': '🎂', 'Kına': '🎊',
  'Söz': '🤝', 'Kurumsal': '🏢', 'Sünnet': '🎗️', 'Baby Shower': '👶',
}

export default function PublicInvitePage({ eventId }) {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState('invite')
  const [rsvp, setRsvp] = useState(null)
  const [guestForm, setGuestForm] = useState({ name: '', phone: '', response: '', food: 'Standart', plus: 0 })
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
      company_id: event?.company_id,
      name: guestForm.name,
      phone: guestForm.phone,
      response: guestForm.response,
      food: guestForm.food,
      plus: parseInt(guestForm.plus) || 0,
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
      <div className="w-10 h-10 rounded-full border-3 border-white/10 border-t-amber-500 animate-spin"/>
    </div>
  )

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: '#111827' }}>
      <div className="text-center">
        <div className="text-6xl mb-4">😔</div>
        <div className="text-white text-lg font-semibold mb-1">Davetiye Bulunamadı</div>
        <div className="text-white/50 text-sm">Bu davetiye silinmiş veya link hatalı olabilir</div>
      </div>
    </div>
  )

  const t = THEMES[event?.theme] || THEMES.gold
  const emoji = EVENT_EMOJIS[event?.type] || '🎉'
  const clientName = event?.client || 'Etkinlik'

  // THANKS SCREEN
  if (step === 'thanks') return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: t.bg }}>
      <div className="text-center max-w-sm w-full">
        <div className="text-7xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold mb-3" style={{ color: t.text }}>Teşekkürler!</h2>
        <p className="text-base mb-6" style={{ color: t.textMuted }}>
          {guestForm.name.split(' ')[0]}, katılımınız kaydedildi.
        </p>
        <div className="p-5 rounded-2xl mb-6" style={{ background: t.cardBg, border: `2px solid ${t.border}` }}>
          <div className="text-lg font-bold mb-2" style={{ color: t.text }}>{clientName}</div>
          <div className="text-sm" style={{ color: t.textMuted }}>📅 {event?.date} • 🕐 {event?.time}</div>
          <div className="text-sm" style={{ color: t.textMuted }}>📍 {event?.location}</div>
        </div>
        <button onClick={() => setStep('invite')}
          className="px-8 py-3 rounded-xl text-sm font-semibold transition-all"
          style={{ background: t.cardBg, color: t.accent, border: `2px solid ${t.border}` }}>
          Davetiyeye Dön
        </button>
      </div>
    </div>
  )

  // GIFT / IBAN SCREEN
  if (step === 'gift') return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: t.bg }}>
      <div className="text-center max-w-sm w-full">
        <div className="text-6xl mb-4">💝</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: t.text }}>Hediye Gönder</h2>
        <p className="text-sm mb-6" style={{ color: t.textMuted }}>
          Katılamıyorsanız {clientName.split(' ')[0]} için güzel bir dilek gönderebilirsiniz
        </p>
        {event?.iban ? (
          <div className="p-5 rounded-2xl mb-6 text-left" style={{ background: t.cardBg, border: `2px solid ${t.border}` }}>
            <div className="text-xs uppercase tracking-wider mb-3 font-bold" style={{ color: t.accent }}>IBAN Bilgisi</div>
            <div className="font-mono text-lg font-bold mb-1" style={{ color: t.text }}>{event.iban}</div>
            {event.iban_name && <div className="text-sm mb-4" style={{ color: t.textMuted }}>{event.iban_name}</div>}
            <button onClick={copyIban}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-95"
              style={{ background: t.btnBg, color: t.btnText }}>
              {copied ? '✓ Kopyalandı!' : 'IBAN\'ı Kopyala'}
            </button>
          </div>
        ) : (
          <div className="p-5 rounded-2xl mb-6" style={{ background: t.cardBg, border: `2px solid ${t.border}` }}>
            <div className="text-sm" style={{ color: t.textMuted }}>Hediye bilgisi henüz eklenmemiş</div>
          </div>
        )}
        <button onClick={() => setStep('invite')}
          className="px-8 py-3 rounded-xl text-sm font-semibold"
          style={{ background: t.cardBg, color: t.accent, border: `2px solid ${t.border}` }}>
          Davetiyeye Dön
        </button>
      </div>
    </div>
  )

  // RSVP SCREEN
  if (step === 'rsvp') return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: t.bg }}>
      <div className="w-full max-w-sm">
        <button onClick={() => setStep('invite')} className="text-sm mb-6 font-medium" style={{ color: t.accent }}>
          ← Davetiyeye Dön
        </button>
        <h2 className="text-2xl font-bold mb-1" style={{ color: t.text }}>Cevabınız</h2>
        <p className="text-sm mb-6" style={{ color: t.textMuted }}>Katılım durumunuzu belirtin</p>

        {/* Response Options */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { val: 'katılıyor', label: 'Geliyorum', icon: '✅' },
            { val: 'belki', label: 'Belki', icon: '🤔' },
            { val: 'katılamıyor', label: 'Gelemiyorum', icon: '😢' },
          ].map(o => (
            <button key={o.val} onClick={() => setGuestForm(p => ({ ...p, response: o.val }))}
              className="p-4 rounded-2xl border-2 text-center transition-all active:scale-95"
              style={{
                background: guestForm.response === o.val ? t.cardBg : 'rgba(255,255,255,0.03)',
                borderColor: guestForm.response === o.val ? t.accent : 'rgba(255,255,255,0.1)',
              }}>
              <div className="text-3xl mb-1">{o.icon}</div>
              <div className="text-sm font-bold" style={{ color: t.text }}>{o.label}</div>
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="space-y-3 mb-6">
          <input value={guestForm.name} onChange={e => setGuestForm(p => ({ ...p, name: e.target.value }))}
            placeholder="Adınız Soyadınız *"
            className="w-full px-4 py-3.5 rounded-xl text-base focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.08)', border: `2px solid ${t.border}`, color: '#fff' }} />
          <input value={guestForm.phone} onChange={e => setGuestForm(p => ({ ...p, phone: e.target.value }))}
            placeholder="Telefon (opsiyonel)"
            className="w-full px-4 py-3.5 rounded-xl text-base focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.08)', border: `2px solid ${t.border}`, color: '#fff' }} />
          <select value={guestForm.food} onChange={e => setGuestForm(p => ({ ...p, food: e.target.value }))}
            className="w-full px-4 py-3.5 rounded-xl text-base focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.08)', border: `2px solid ${t.border}`, color: '#fff' }}>
            <option value="Standart">Standart</option>
            <option value="Vejetaryen">Vejetaryen</option>
            <option value="Vegan">Vegan</option>
            <option value="Glutensiz">Glutensiz</option>
          </select>
        </div>

        <button onClick={submitRsvp} disabled={!guestForm.name || !guestForm.response}
          className="w-full py-4 rounded-xl text-base font-bold transition-all active:scale-95 disabled:opacity-30"
          style={{ background: t.btnBg, color: t.btnText }}>
          Gönder
        </button>
      </div>
    </div>
  )

  // MAIN INVITE SCREEN
  return (
    <div className="min-h-screen flex flex-col" style={{ background: t.bg }}>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-sm w-full">
          {/* Icon */}
          <div className="text-7xl mb-5">{emoji}</div>

          {/* Type Badge */}
          <div className="inline-block px-5 py-1.5 rounded-full mb-4"
            style={{ background: t.cardBg, border: `2px solid ${t.border}` }}>
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: t.accent }}>{event?.type}</span>
          </div>

          {/* Name */}
          <h1 className="text-4xl font-bold mb-3" style={{ color: t.text }}>{clientName}</h1>

          {/* Divider */}
          <div className="w-20 h-0.5 mx-auto mb-6 rounded-full" style={{ background: t.accent }}/>

          {/* Details */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center gap-3">
              <span className="text-xl">📅</span>
              <span className="text-lg font-semibold" style={{ color: t.text }}>{event?.date}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-xl">🕐</span>
              <span className="text-lg font-semibold" style={{ color: t.text }}>{event?.time}</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <span className="text-xl">📍</span>
              <span className="text-lg font-semibold" style={{ color: t.text }}>{event?.location}</span>
            </div>
            {event?.location_url && (
              <button onClick={() => window.open(event.location_url, '_blank')}
                className="mt-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
                style={{ background: t.cardBg, color: t.accent, border: `2px solid ${t.border}` }}>
                🗺️ Yol Tarifi Al
              </button>
            )}
          </div>

          {/* CTA Button */}
          <button onClick={() => setStep('rsvp')}
            className="w-full py-4 rounded-xl text-lg font-bold transition-all active:scale-95 shadow-lg mb-4"
            style={{ background: t.btnBg, color: t.btnText, boxShadow: `0 8px 30px ${t.accent}40` }}>
            Cevabını Bildir
          </button>

          <p className="text-xs" style={{ color: t.textMuted }}>
            {clientName} • {event?.date}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.2)' }}>merasim.app ile oluşturuldu</p>
      </div>
    </div>
  )
}
