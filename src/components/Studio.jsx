import { useEffect, useMemo, useRef, useState } from 'react'
import { createProject, logout, watchProjects } from '../services/firebase'
import { friendlyError } from '../utils/errors'

const demoProjects = [
  { id: 'demo-1', coupleName: 'Duru & Mert', product: 'Sinematik Düğün Filmi', style: 'Editorial', status: 'ready', progress: 100, createdLabel: 'Bugün' },
  { id: 'demo-2', coupleName: 'Selin & Can', product: 'Save The Date', style: 'Romantik', status: 'processing', progress: 68, createdLabel: 'Bugün' },
  { id: 'demo-3', coupleName: 'Ece & Bora', product: 'AI Slideshow', style: 'Zamansız', status: 'queued', progress: 12, createdLabel: 'Dün' },
]

const initialForm = {
  coupleName: '',
  product: 'Sinematik Düğün Filmi',
  style: 'Editorial',
  aspectRatio: '9:16',
}

const statusText = { ready: 'Hazır', processing: 'Üretiliyor', queued: 'Sırada', uploading: 'Yükleniyor', error: 'Hata' }

const navItems = [
  { id: 'projects', label: 'Projeler' },
  { id: 'templates', label: 'Şablonlar' },
  { id: 'generations', label: 'Üretimler' },
  { id: 'settings', label: 'Ayarlar' },
]

const templates = [
  { id: 't1', name: 'Editorial Film', tag: 'Sinematik', cover: 'cover-1' },
  { id: 't2', name: 'Romantik STD', tag: 'Save The Date', cover: 'cover-2' },
  { id: 't3', name: 'Zamansız Slayt', tag: 'Slideshow', cover: 'cover-3' },
  { id: 't4', name: 'Hareketli Davet', tag: 'Dijital Davet', cover: 'cover-1' },
]

function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className={`project-cover cover-${project.id.slice(-1)}`} style={project.coverUrl ? { backgroundImage: `url(${project.coverUrl})` } : undefined}>
        <span className={`status status-${project.status}`}>{statusText[project.status] || project.status}</span>
        {project.status === 'ready' ? (
          project.resultUrl
            ? <a className="cover-play" href={project.resultUrl} target="_blank" rel="noreferrer" aria-label="Videoyu aç">▶</a>
            : <i className="cover-play" aria-hidden="true">▶</i>
        ) : project.status === 'error' ? null : <i className="cover-spin" aria-hidden="true" />}
        <strong>{project.coupleName}</strong>
      </div>
      <div className="project-info">
        <div><h3>{project.product}</h3><p>{project.style} · {project.createdLabel}</p></div>
        <span>{project.progress || 0}%</span>
      </div>
      <div className="progress"><i style={{ width: `${project.progress || 0}%` }} /></div>
    </article>
  )
}

function EmptyState({ onNew }) {
  return (
    <div className="empty-state">
      <div className="empty-art" aria-hidden="true">✦</div>
      <h3>Henüz projen yok</h3>
      <p>İlk çiftinin fotoğraflarını yükle, dakikalar içinde sinematik bir video oluştur.</p>
      <button className="btn btn-primary" type="button" onClick={onNew}>+ İlk projeyi oluştur</button>
    </div>
  )
}

function Placeholder({ title, text }) {
  return (
    <div className="empty-state">
      <div className="empty-art" aria-hidden="true">✦</div>
      <h3>{title}</h3>
      <p>{text}</p>
      <span className="soon-pill">Yakında</span>
    </div>
  )
}

export default function Studio({ user, studio, onBack, onAuth }) {
  const [projects, setProjects] = useState(user ? [] : demoProjects)
  const [view, setView] = useState('projects')
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [files, setFiles] = useState([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const objectUrls = useRef([])

  useEffect(() => {
    if (!user) return () => {}
    return watchProjects(user.uid, setProjects)
  }, [user])

  // Demo modunda oluşturulan blob URL'lerini bileşen kalkarken serbest bırak.
  useEffect(() => () => objectUrls.current.forEach((url) => URL.revokeObjectURL(url)), [])

  // Modal açıkken ESC ile kapat.
  useEffect(() => {
    if (!modal) return () => {}
    const onKey = (event) => { if (event.key === 'Escape') setModal(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [modal])

  const stats = useMemo(() => ({
    total: projects.length,
    active: projects.filter((project) => ['processing', 'queued', 'uploading'].includes(project.status)).length,
    ready: projects.filter((project) => project.status === 'ready').length,
  }), [projects])

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (user) {
        if (!files.length) throw new Error('En az bir fotoğraf seçmelisin.')
        await createProject(user.uid, form, files)
      } else {
        let coverUrl = ''
        if (files[0]) {
          coverUrl = URL.createObjectURL(files[0])
          objectUrls.current.push(coverUrl)
        }
        setProjects((current) => [{
          id: `demo-${Date.now()}`,
          ...form,
          status: 'queued',
          progress: 12,
          createdLabel: 'Şimdi',
          coverUrl,
        }, ...current])
      }
      setModal(false)
      setForm(initialForm)
      setFiles([])
    } catch (caught) {
      setError(friendlyError(caught))
    } finally {
      setBusy(false)
    }
  }

  const signOut = async () => {
    await logout()
    onBack()
  }

  return (
    <div className="studio-layout">
      <aside className="sidebar">
        <button className="brand" type="button" onClick={onBack}><span>M</span> merasim.ai</button>
        <div className="side-links">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={view === item.id ? 'active' : ''}
              type="button"
              onClick={() => setView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="credit-card">
          <span>Kalan kredi</span>
          <strong>{studio?.credits ?? 25}</strong>
          <div><i style={{ width: `${Math.min(100, ((studio?.credits ?? 25) / 25) * 100)}%` }} /></div>
          <small>Başlangıç paketi</small>
        </div>
        <button className="side-account" type="button" onClick={user ? signOut : onAuth}>
          <b>{studio?.name?.slice(0, 1) || user?.email?.slice(0, 1) || 'D'}</b>
          <span>{studio?.name || user?.email || 'Demo Stüdyo'}<small>{user ? 'Çıkış yap' : 'Giriş yap'}</small></span>
        </button>
      </aside>

      <main className="studio-main">
        <header className="studio-header">
          <div>
            <span className="eyebrow">{user ? 'Stüdyo paneli' : 'Demo modu'}</span>
            <h1>{navItems.find((item) => item.id === view)?.label}</h1>
          </div>
          {view === 'projects' && (
            <button className="btn btn-primary" type="button" onClick={() => setModal(true)}>+ Yeni proje</button>
          )}
        </header>

        {view === 'projects' && (
          <>
            <section className="stat-grid">
              <article><span>Toplam proje</span><strong>{stats.total}</strong></article>
              <article><span>Aktif üretim</span><strong>{stats.active}</strong></article>
              <article><span>Teslime hazır</span><strong>{stats.ready}</strong></article>
            </section>

            <section className="projects">
              <div className="section-title"><h2>Son projeler</h2><span>{projects.length} proje</span></div>
              {projects.length === 0 ? (
                <EmptyState onNew={() => setModal(true)} />
              ) : (
                <div className="project-grid">
                  {projects.map((project) => <ProjectCard project={project} key={project.id} />)}
                </div>
              )}
            </section>
          </>
        )}

        {view === 'templates' && (
          <section className="projects">
            <div className="section-title"><h2>Hazır şablonlar</h2><span>{templates.length} şablon</span></div>
            <div className="template-grid">
              {templates.map((tpl) => (
                <button
                  key={tpl.id}
                  className="template-card"
                  type="button"
                  onClick={() => { setView('projects'); setModal(true) }}
                >
                  <span className={`template-cover ${tpl.cover}`}><i aria-hidden="true">▶</i></span>
                  <strong>{tpl.name}</strong>
                  <small>{tpl.tag}</small>
                </button>
              ))}
            </div>
          </section>
        )}

        {view === 'generations' && (
          <Placeholder title="Üretim geçmişi" text="Tamamlanan AI üretimlerin ve indirme bağlantıların burada listelenecek." />
        )}

        {view === 'settings' && (
          <Placeholder title="Stüdyo ayarları" text="Marka, plan ve fatura ayarlarını buradan yöneteceksin." />
        )}
      </main>

      {modal && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setModal(false)}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="new-project-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" onClick={() => setModal(false)} aria-label="Kapat">×</button>
            <span className="eyebrow">Yeni AI üretimi</span>
            <h2 id="new-project-title">Hikâyeyi başlat.</h2>
            <p>Fotoğrafları yükle ve teslim etmek istediğin ürünü seç.</p>
            <form onSubmit={submit}>
              <label>Çiftin adı<input required placeholder="Örn. Ela & Arda" value={form.coupleName} onChange={(e) => setForm({ ...form, coupleName: e.target.value })} /></label>
              <label>Ürün<select value={form.product} onChange={(e) => setForm({ ...form, product: e.target.value })}>
                <option>Sinematik Düğün Filmi</option><option>Save The Date</option><option>AI Slideshow</option><option>Dijital Davet</option>
              </select></label>
              <div className="form-row">
                <label>Stil<select value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })}>
                  <option>Editorial</option><option>Romantik</option><option>Zamansız</option><option>Enerjik</option>
                </select></label>
                <label>Format<select value={form.aspectRatio} onChange={(e) => setForm({ ...form, aspectRatio: e.target.value })}>
                  <option>9:16</option><option>16:9</option><option>1:1</option>
                </select></label>
              </div>
              <label className="upload">Fotoğraflar<input type="file" accept="image/*" multiple onChange={(e) => setFiles([...e.target.files])} /><span>{files.length ? `${files.length} fotoğraf seçildi` : 'Fotoğrafları seç veya sürükle'}</span></label>
              {error && <div className="error">{error}</div>}
              <button className="btn btn-primary" disabled={busy}>{busy ? 'Proje hazırlanıyor…' : 'Projeyi oluştur'}</button>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}
