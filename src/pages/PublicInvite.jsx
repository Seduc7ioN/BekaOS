import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function PublicInvitePage({ eventId, onBack }) {
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rsvp, setRsvp] = useState(null)
  const [guestForm, setGuestForm] = useState({ name: '', phone: '', response: '', food: 'Standart', plus: 0 })

  useEffect(() => {
    loadEvent()
  }, [eventId])

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
    })
    setRsvp(guestForm.response)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#111827" }}>
      <div className="text-white/40 text-sm">Yükleniyor...</div>
    </div>
  )

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#111827" }}>
      <div className="text-center">
        <div className="text-4xl mb-3">😔</div>
        <div className="text-white/60 text-sm">Davetiye bulunamadı</div>
      </div>
    </div>
  )

  const icons = { 'Düğün': '💒', 'Nişan': '💍', 'Doğum Günü': '🎂', 'Kına': '🎊', 'Söz': '🤝', 'Kurumsal': '🏢', 'Sünnet': '🎗️' }

  if (rsvp) return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#111827" }}>
      <div className="text-center max-w-sm">
        <div className="text-5xl mb-4">{rsvp === 'katılıyor' ? '🎉' : rsvp === 'belki' ? '🤔' : '😢'}</div>
        <div className="text-lg font-semibold text-white mb-2">
          {rsvp === 'katılıyor' ? 'Teşekkürler!' : rsvp === 'belki' ? 'Anlaşıldı!' : 'Üzgünüz!'}
        </div>
        <div className="text-sm text-white/50 mb-6">
          {rsvp === 'katilor' ? 'Katılımınız kaydedildi. Görüşmek üzere!' : rsvp === 'belki' ? 'Cevabınız kaydedildi. Umarız katılabilirsiniz!' : 'Cevabınız kaydedildi.'}
        </div>
        <button onClick={() => { setRsvp(null); setGuestForm({ name: '', phone: '', response: '', food: 'Standart', plus: 0 }) }}
          className="px-6 py-2 rounded-xl text-xs text-white/60 border border-white/10">Başka biri için cevap ver</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#111827" }}>
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">{icons[event.type] || '🎉'}</div>
          <div className="text-xs text-purple-400 uppercase tracking-widest mb-2">{event.type}</div>
          <h1 className="text-2xl font-bold text-white mb-1">{event.client}</h1>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.04)" }}>
          {/* Details */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-white/30 w-6 text-center">📅</span>
              <span className="text-white/70">{event.date}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-white/30 w-6 text-center">🕐</span>
              <span className="text-white/70">{event.time}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-white/30 w-6 text-center">📍</span>
              <span className="text-white/70">{event.location}</span>
            </div>
          </div>

          {/* RSVP Form */}
          <div className="border-t border-white/5 pt-5">
            <div className="text-xs text-white/40 uppercase tracking-wider mb-3">Cevabınız</div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { val: 'katılıyor', label: 'Katılıyorum', icon: '✅', color: 'emerald' },
                { val: 'belki', label: 'Belki', icon: '🤔', color: 'amber' },
                { val: 'katılamıyor', label: 'Katılamıyorum', icon: '❌', color: 'rose' },
              ].map(o => (
                <button key={o.val} onClick={() => setGuestForm(p => ({ ...p, response: o.val }))}
                  className={`p-3 rounded-xl border text-center transition-all ${guestForm.response === o.val ? `border-${o.color}-500/40 bg-${o.color}-500/10` : 'border-white/5 bg-white/[0.02]'}`}>
                  <div className="text-lg mb-1">{o.icon}</div>
                  <div className="text-[10px] text-white/60">{o.label}</div>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <input value={guestForm.name} onChange={e => setGuestForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Adınız Soyadınız" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-purple-500/50" />
              <input value={guestForm.phone} onChange={e => setGuestForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="Telefon (opsiyonel)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 placeholder:text-white/20 focus:outline-none focus:border-purple-500/50" />
              <select value={guestForm.food} onChange={e => setGuestForm(p => ({ ...p, food: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/80 focus:outline-none focus:border-purple-500/50">
                <option value="Standart">Standart</option>
                <option value="Vejetaryen">Vejetaryen</option>
                <option value="Vegan">Vegan</option>
                <option value="Glutensiz">Glutensiz</option>
              </select>
            </div>

            <button onClick={submitRsvp} disabled={!guestForm.name || !guestForm.response}
              className="w-full mt-4 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-30 transition-all"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#6366f1)" }}>
              Gönder
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-white/15 mt-6">Merasim — merasim.app</p>
      </div>
    </div>
  )
}
