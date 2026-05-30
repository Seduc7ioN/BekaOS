import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function PublicGalleryPage({ eventId, onBack }) {
  const [event, setEvent] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    loadData()
  }, [eventId])

  const loadData = async () => {
    const [evRes, galRes] = await Promise.all([
      supabase.from('events').select('*').eq('id', eventId).single(),
      supabase.from('gallery').select('*').eq('event_id', eventId).eq('approved', true).order('created_at', { ascending: false }),
    ])
    setEvent(evRes.data)
    setPhotos(galRes.data || [])
    setLoading(false)
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
        <div className="text-white/60 text-sm">Galeri bulunamadı</div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: "#111827" }}>
      {/* Header */}
      <div className="text-center py-8 px-4">
        <div className="text-4xl mb-2">📸</div>
        <h1 className="text-xl font-bold text-white mb-1">{event.client}</h1>
        <div className="text-xs text-white/40">{event.type} - {event.date}</div>
        <div className="text-xs text-white/30 mt-1">{photos.length} fotoğraf</div>
      </div>

      {/* Grid */}
      {photos.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 px-1 pb-8">
          {photos.map(photo => (
            <div key={photo.id} onClick={() => setLightbox(photo)} className="aspect-square overflow-hidden cursor-pointer">
              <img src={photo.url} alt="" className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-white/30 text-sm">Henüz fotoğraf eklenmedi</div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setLightbox(null)}>
          <img src={lightbox.url} alt="" className="max-w-full max-h-full object-contain" />
        </div>
      )}

      <p className="text-center text-[10px] text-white/15 pb-6">Merasim — merasim.app</p>
    </div>
  )
}
