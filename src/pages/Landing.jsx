import { useState } from 'react'

const FEATURES = [
  { icon:"📋", title:"Etkinlik Yönetimi", desc:"Düğün, nişan, kurumsal etkinliklerinizi tek panelden yönetin." },
  { icon:"📅", title:"Takvim & Planlama", desc:"Tüm etkinliklerinizi takvimde görüntüleyin, bayramları takip edin." },
  { icon:"💌", title:"Dijital Davetiye", desc:"QR kod ile davetiye oluşturun, RSVP takibi yapın." },
  { icon:"📸", title:"Galeri Yönetimi", desc:"Fotoğrafları yükleyin, onaylayın, QR ile paylaşın." },
  { icon:"💰", title:"Ödeme Takibi", desc:"Tahsilat oranlarını, masrafları ve bütçenizi takip edin." },
  { icon:"👥", title:"Personel Yönetimi", desc:"Ekibinizi yönetin, görev atayın, performansı izleyin." },
  { icon:"📊", title:"CRM & Analitik", desc:"Müşteri ilişkilerini yönetin, detaylı raporlar alın." },
  { icon:"🤖", title:"AI Asistan", desc:"Teklif oluşturma, konsept önerileri ve daha fazlası." },
]

const PRICING = [
  {
    name:"Ücretsiz",
    price:"0",
    period:"/ay",
    desc:"Başlangıç için ideal",
    features:["5 etkinlik/ay","10 galeri fotoğrafı","Temel raporlar","E-posta destek"],
    cta:"Ücretsiz Başla",
    highlight:false,
  },
  {
    name:"Pro",
    price:"299",
    period:"/ay",
    desc:"Büyüyen işletmeler için",
    features:["Sınırsız etkinlik","Sınırsız galeri","AI asistan","WhatsApp entegrasyonu","Öncelikli destek","Özel raporlar"],
    cta:"Pro'ya Geç",
    highlight:true,
  },
  {
    name:"Enterprise",
    price:"799",
    period:"/ay",
    desc:"Büyük organizasyonlar için",
    features:["Pro özellikleri","Çoklu kullanıcı","API erişimi","Özel entegrasyonlar","7/24 destek","Özel eğitim"],
    cta:"İletişime Geç",
    highlight:false,
  },
]

const TESTIMONIALS = [
  { name:"Ayşe K.", role:"Düğün Planlayıcısı", text:"Merasim sayesinde tüm etkinliklerimi tek panelden yönetiyorum. Çok zaman kazandırıyor!", rating:5 },
  { name:"Mehmet B.", role:"Kurumsal Etkinlik", text:"Müşterilerimiz QR kod ile davetiyelerine kolayca ulaşıyor. Harika bir çözüm.", rating:5 },
  { name:"Zeynep A.", role:"Doğum Günü Organizasyon", text:"Galeri ve ödeme takibi özellikleri işimi çok kolaylaştırdı. Kesinlikle tavsiye ederim.", rating:5 },
]

const FAQ = [
  { q:"Ücretsiz plan ne kadar süreyle geçerli?", a:"Ücretsiz plan süresizdir. Sınırlı özelliklerle sürekli kullanabilirsiniz." },
  { q:"Pro plana geçiş yapınca verilerim silinir mi?", a:"Hayır, tüm verileriniz korunur. Sadece premium özelliklere erişiminiz açılır." },
  { q:"Birden fazla kullanıcı ekleyebilir miyim?", a:"Enterprise planında sınırsız kullanıcı ekleyebilirsiniz. Pro planında 3 kullanıcı dahildir." },
  { q:"Verilerim güvende mi?", a:"Evet, tüm verileriniz 6698 sayılı KVKK kapsamında şifreli olarak saklanır." },
  { q:"İptal etsem ne olur?", a:"Dilediğiniz zaman iptal edebilirsiniz. Verileriniz 30 gün daha saklanır." },
]

export default function LandingPage({ onNavigate }) {
  const [openFaq, setOpenFaq] = useState(null)

  return (
    <div className="min-h-screen" style={{background:"#111827"}}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/5" style={{background:"rgba(17,24,39,0.9)",backdropFilter:"blur(20px)"}}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="14" r="8" stroke="white" strokeWidth="2"/>
                <text x="16" y="18" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fontWeight="700" fill="white">M</text>
              </svg>
            </div>
            <span className="text-lg font-bold text-white">Merasim</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-white/40 hover:text-white transition-colors">Özellikler</a>
            <a href="#pricing" className="text-sm text-white/40 hover:text-white transition-colors">Fiyatlar</a>
            <a href="#faq" className="text-sm text-white/40 hover:text-white transition-colors">SSS</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={()=>onNavigate('auth')} className="px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white transition-colors">Giriş Yap</button>
            <button onClick={()=>onNavigate('auth')} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>Ücretsiz Başla</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at top, rgba(139,92,246,0.15) 0%, transparent 60%)"}}/>
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-32 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 mb-6">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"/>
            <span className="text-xs text-purple-400">Türkiye'nin #1 Etkinlik Yönetim Platformu</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Etkinliklerinizi<br/>
            <span style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Profesyonelce</span> Yönetin
          </h1>
          <p className="text-lg text-white/40 max-w-2xl mx-auto mb-8">
            Düğün, nişan, doğum günü ve kurumsal etkinlikler için hepsi bir arada yönetim platformu. Davetiyeler, galeri, ödeme takibi ve daha fazlası.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={()=>onNavigate('auth')} className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white" style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>
              Hemen Başla — Ücretsiz
            </button>
            <a href="#features" className="px-8 py-3.5 rounded-xl text-sm font-medium text-white/60 border border-white/10 hover:border-white/20 transition-colors">
              Özellikleri Keşfet
            </a>
          </div>
          <p className="text-xs text-white/20 mt-4">Kredi kartı gerekmez • 14 gün ücretsiz deneme</p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">İhtiyacınız Olan Her Şey</h2>
          <p className="text-sm text-white/40">Organizasyon işinizi dijitalleştirin, zamandan tasarruf edin</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f,i) => (
            <div key={i} className="p-5 rounded-2xl border border-white/5 hover:border-purple-500/20 transition-all group" style={{background:"rgba(255,255,255,0.02)"}}>
              <span className="text-3xl mb-3 block">{f.icon}</span>
              <h3 className="text-sm font-semibold text-white/80 mb-1 group-hover:text-purple-400 transition-colors">{f.title}</h3>
              <p className="text-xs text-white/35 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Basit ve Şeffaf Fiyatlandırma</h2>
          <p className="text-sm text-white/40">İhtiyacınıza göre plan seçin, dilediğiniz zaman değiştirin</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING.map((p,i) => (
            <div key={i} className={`p-6 rounded-2xl border ${p.highlight?'border-purple-500/40':'border-white/5'} relative`} style={{background:p.highlight?"rgba(139,92,246,0.05)":"rgba(255,255,255,0.02)"}}>
              {p.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-semibold text-white" style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>En Popüler</div>}
              <div className="text-sm font-medium text-white/60 mb-1">{p.name}</div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-3xl font-bold text-white">{p.price}</span>
                <span className="text-sm text-white/30">TL{p.period}</span>
              </div>
              <p className="text-xs text-white/30 mb-5">{p.desc}</p>
              <ul className="space-y-2 mb-6">
                {p.features.map((f,j) => (
                  <li key={j} className="flex items-center gap-2 text-xs text-white/50">
                    <span className="text-purple-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button onClick={()=>onNavigate('auth')} className={`w-full py-3 rounded-xl text-sm font-semibold ${p.highlight?'text-white':'text-white/60 border border-white/10'}`} style={p.highlight?{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}:{}}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Müşterilerimiz Ne Diyor?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t,i) => (
            <div key={i} className="p-5 rounded-2xl border border-white/5" style={{background:"rgba(255,255,255,0.02)"}}>
              <div className="flex gap-1 mb-3">
                {[...Array(t.rating)].map((_,j) => <span key={j} className="text-amber-400">★</span>)}
              </div>
              <p className="text-sm text-white/60 mb-4 leading-relaxed">"{t.text}"</p>
              <div>
                <div className="text-sm font-medium text-white/80">{t.name}</div>
                <div className="text-xs text-white/30">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Sıkça Sorulan Sorular</h2>
        </div>
        <div className="space-y-3">
          {FAQ.map((f,i) => (
            <div key={i} className="rounded-xl border border-white/5 overflow-hidden" style={{background:"rgba(255,255,255,0.02)"}}>
              <button onClick={()=>setOpenFaq(openFaq===i?null:i)} className="w-full px-5 py-4 text-left flex items-center justify-between">
                <span className="text-sm text-white/70">{f.q}</span>
                <span className="text-white/30 ml-4">{openFaq===i?'−':'+'}</span>
              </button>
              {openFaq===i && (
                <div className="px-5 pb-4">
                  <p className="text-xs text-white/40 leading-relaxed">{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center p-12 rounded-3xl border border-purple-500/20" style={{background:"rgba(139,92,246,0.05)"}}>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Hemen Başlayın</h2>
          <p className="text-sm text-white/40 mb-6">Ücretsiz plan ile başlayın, büyüdükçe yükseltin</p>
          <button onClick={()=>onNavigate('auth')} className="px-8 py-3.5 rounded-xl text-sm font-semibold text-white" style={{background:"linear-gradient(135deg,#8b5cf6,#6366f1)"}}>
            Ücretsiz Hesap Oluştur
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-white">Merasim</span>
            <span className="text-xs text-white/20">— merasim.app</span>
          </div>
          <div className="flex gap-6">
            <a href="https://www.instagram.com/beka_davet" target="_blank" rel="noopener noreferrer" className="text-xs text-white/30 hover:text-purple-400 transition-colors">Instagram</a>
            <a href="#" className="text-xs text-white/30 hover:text-purple-400 transition-colors">Gizlilik Politikası</a>
            <a href="#" className="text-xs text-white/30 hover:text-purple-400 transition-colors">Kullanım Şartları</a>
          </div>
          <div className="text-xs text-white/15">© 2026 Merasim. Tüm hakları saklıdır.</div>
        </div>
      </footer>
    </div>
  )
}
