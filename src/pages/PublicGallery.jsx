import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function PublicGalleryPage({ eventId }) {
  const [event, setEvent] = useState(null)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadDone, setUploadDone] = useState(false)

  useEffect(() => { loadData() }, [eventId])

  const loadData = async () => {
    const [evRes, galRes] = await Promise.all([
      supabase.from('events').select('*').eq('id', eventId).single(),
      supabase.from('gallery').select('*').eq('event_id', eventId).order('created_at', { ascending: false }),
    ])
    setEvent(evRes.data)
    setPhotos(galRes.data || [])
    setLoading(false)
  }

  const processFiles = async (files) => {
    if (!files.length || !event) return
    setUploading(true)
    let uploaded = 0
    for (const file of files) {
      try {
        const ext = file.name.split('.').pop() || 'jpg'
        const path = `public/${eventId}/${Date.now()}_${Math.random().toString(36).slice(2,6)}.${ext}`
        const { data: uploadData, error: uploadErr } = await supabase.storage.from('gallery').upload(path, file)
        if (uploadErr) {
          console.error('Storage upload error:', uploadErr)
          continue
        }
        const url = supabase.storage.from('gallery').getPublicUrl(path).data.publicUrl
        const { error: insertErr } = await supabase.from('gallery').insert({
          company_id: event.company_id,
          event_id: eventId,
          url,
          approved: false,
        })
        if (insertErr) {
          console.error('Gallery insert error:', insertErr)
          continue
        }
        // Bildirim opsiyonel - hata olursa devam et
        if (event.company_id) {
          await supabase.from('notifications').insert({
            company_id: event.company_id,
            icon: '📸',
            text: `${event.client} galerisine yeni fotoğraf yüklendi. Onay bekliyor.`,
            page: 'gallery',
          }).catch(e => console.warn('Notification error:', e))
        }
        uploaded++
      } catch (err) {
        console.error('Upload error:', err)
      }
    }
    setUploading(false)
    if (uploaded > 0) {
      setUploadDone(true)
      setTimeout(() => setUploadDone(false), 3000)
    }
    loadData()
  }

  const triggerUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.multiple = true
    input.onchange = (e) => processFiles(Array.from(e.target.files))
    input.click()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#111827" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-purple-500 animate-spin"/>
        <span className="text-xs text-white/30">Galeri yükleniyor...</span>
      </div>
    </div>
  )

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#111827" }}>
      <div className="text-center">
        <div className="text-5xl mb-4">😔</div>
        <div className="text-white/60 text-sm font-medium">Galeri Bulunamadı</div>
      </div>
    </div>
  )

  const approvedPhotos = photos.filter(p => p.approved)
  const pendingCount = photos.filter(p => !p.approved).length

  return (
    <div className="min-h-screen" style={{ background: "#111827" }}>
      {/* Header */}
      <div className="text-center py-8 px-4">
        <div className="text-4xl mb-2">📸</div>
        <h1 className="text-xl font-bold text-white mb-1">{event.client}</h1>
        <div className="text-xs text-white/40">{event.type} - {event.date}</div>
        <div className="text-xs text-white/30 mt-1">{approvedPhotos.length} fotoğraf{pendingCount > 0 && ` (${pendingCount} onay bekliyor)`}</div>
      </div>

      {/* Upload Section */}
      <div className="px-4 mb-6">
        <div onClick={triggerUpload}
          className="p-4 rounded-2xl border-2 border-dashed border-purple-500/25 flex flex-col items-center gap-2 cursor-pointer hover:border-purple-500/40 transition-colors"
          style={{ background: 'rgba(139,92,246,0.04)' }}>
          {uploading ? (
            <>
              <div className="w-8 h-8 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin"/>
              <span className="text-xs text-purple-400">Fotoğraflar yükleniyor...</span>
            </>
          ) : uploadDone ? (
            <>
              <span className="text-3xl">✅</span>
              <span className="text-xs text-emerald-400 font-medium">Fotoğraflar yüklendi! Onay sonrası galeride görünecek.</span>
            </>
          ) : (
            <>
              <span className="text-3xl">📷</span>
              <span className="text-sm text-white/60 font-medium">Fotoğraf Yükle</span>
              <span className="text-[10px] text-white/30">Etkinlikte çektiğiniz fotoğrafları buradan paylaşabilirsiniz</span>
            </>
          )}
        </div>
      </div>

      {/* Photo Grid */}
      {approvedPhotos.length > 0 ? (
        <div className="grid grid-cols-3 gap-1 px-1 pb-8">
          {approvedPhotos.map(photo => (
            <div key={photo.id} onClick={() => setLightbox(photo)} className="aspect-square overflow-hidden cursor-pointer active:opacity-60 transition-opacity">
              <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy"/>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📷</div>
          <div className="text-white/30 text-sm">Henüz fotoğraf eklenmedi</div>
          <div className="text-white/20 text-xs mt-1">İlk fotoğrafı siz yükleyin!</div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95" onClick={() => setLightbox(null)}>
          <div className="flex items-center justify-between p-4">
            <span className="text-xs text-white/40">Fotoğraf</span>
            <div className="flex items-center gap-3">
              <button onClick={(e) => {
                e.stopPropagation();
                const a = document.createElement('a');
                a.href = lightbox.url;
                a.download = `foto-${lightbox.id}.jpg`;
                a.target = '_blank';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }} className="text-white/60 hover:text-white transition-colors p-1" title="İndir">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
              </button>
              <button onClick={() => setLightbox(null)} className="text-white/60 hover:text-white text-2xl leading-none">×</button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-4" onClick={e => e.stopPropagation()}>
            <img src={lightbox.url} alt="" className="max-w-full max-h-full object-contain rounded-lg"/>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-[9px] text-white/15">merasim.app ile oluşturuldu</p>
      </div>
    </div>
  )
}
