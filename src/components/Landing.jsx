const products = [
  ['Sinematik Düğün Filmi', 'Fotoğraflardan duygusal, sinematik kısa filmler.'],
  ['Save The Date', 'Sosyal medyada paylaşmaya hazır dikey duyuru videoları.'],
  ['AI Slideshow', 'Seçili karelerden ritmik ve zarif hikâyeler.'],
  ['Dijital Davet', 'Çifte özel, hareketli video davetiyeleri.'],
]

const samples = [
  { couple: 'Ela & Arda', tag: 'Save The Date', cover: 'sample-1' },
  { couple: 'Deniz & Ege', tag: 'Sinematik Film', cover: 'sample-2' },
  { couple: 'Duru & Mert', tag: 'AI Slideshow', cover: 'sample-3' },
  { couple: 'Selin & Can', tag: 'Dijital Davet', cover: 'sample-4' },
  { couple: 'Ece & Bora', tag: 'Düğün Hikâyesi', cover: 'sample-5' },
]

const stats = [
  ['12.000+', 'Üretilen video'],
  ['480+', 'Aktif stüdyo'],
  ['~3 dk', 'Ortalama üretim'],
]

const plans = [
  { name: 'Başlangıç', price: '₺0', note: '25 kredi hediye', features: ['Tüm ürünler', '720p çıktı', 'Filigranlı'], cta: 'Ücretsiz başla', highlight: false },
  { name: 'Stüdyo', price: '₺1.490', note: 'aylık · 300 kredi', features: ['Filigransız 4K', 'Öncelikli kuyruk', 'Marka renkleri'], cta: 'Stüdyo’yu seç', highlight: true },
  { name: 'Ajans', price: 'Teklif', note: 'sınırsız ekip', features: ['Çoklu kullanıcı', 'API erişimi', 'Özel destek'], cta: 'İletişime geç', highlight: false },
]

const faqs = [
  ['Fotoğraflarım güvende mi?', 'Tüm yüklemeler stüdyona özel, şifreli alanda saklanır ve yalnızca senin üretimlerinde kullanılır.'],
  ['Bir video ne kadar sürede hazır olur?', 'Çoğu üretim 3–5 dakika içinde teslime hazır olur; yoğunlukta öncelikli kuyruk devreye girer.'],
  ['Çıktıları ticari olarak kullanabilir miyim?', 'Evet. Stüdyo ve Ajans planlarındaki tüm çıktılar müşterilerinle paylaşım ve teslim için lisanslıdır.'],
]

export default function Landing({ user, onAuth, onStudio }) {
  return (
    <div className="landing">
      <header className="nav shell">
        <button className="brand" type="button" onClick={() => window.scrollTo({ top: 0 })}>
          <span>M</span> merasim.ai
        </button>
        <nav>
          <a href="#urunler">Ürünler</a>
          <a href="#nasil">Nasıl çalışır?</a>
          <a href="#fiyat">Fiyatlar</a>
          <button className="btn btn-ghost" type="button" onClick={user ? onStudio : onAuth}>
            {user ? 'Stüdyoya git' : 'Giriş yap'}
          </button>
        </nav>
      </header>

      <main>
        <section className="hero shell">
          <div className="eyebrow">Fotoğrafçılar için AI video platformu</div>
          <h1>En güzel kareleri<br /><em>harekete geçir.</em></h1>
          <p>
            Düğün fotoğraflarını dakikalar içinde sinematik videolara, Save The Date
            içeriklerine ve dijital davetlere dönüştür.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" type="button" onClick={onStudio}>Ücretsiz dene</button>
            <button className="btn btn-ghost" type="button" onClick={onStudio}>Demo stüdyoyu aç</button>
          </div>
          <small>Kredi kartı gerekmez · 25 başlangıç kredisi</small>
        </section>

        <section className="showcase shell" aria-label="Ürün önizlemesi">
          <div className="phone-card phone-one"><span>Save The Date</span><strong>Ela & Arda</strong></div>
          <div className="phone-card phone-main"><span>Merasim Film</span><strong>Bir ömürlük hikâye</strong><i>▶</i></div>
          <div className="phone-card phone-two"><span>Düğün Hikâyesi</span><strong>Deniz & Ege</strong></div>
        </section>

        <section className="samples" aria-label="Örnek çıktılar">
          <div className="shell sample-head">
            <span className="eyebrow">Gerçek stüdyo çıktıları</span>
            <h2>Saniyeler içinde teslime hazır.</h2>
          </div>
          <div className="sample-strip">
            {[...samples, ...samples].map((sample, index) => (
              <figure className={`sample-card ${sample.cover}`} key={`${sample.couple}-${index}`} aria-hidden={index >= samples.length}>
                <i className="sample-play" aria-hidden="true">▶</i>
                <figcaption><span>{sample.tag}</span><strong>{sample.couple}</strong></figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="trust shell" aria-label="Rakamlarla">
          {stats.map(([value, label]) => (
            <div className="trust-item" key={label}><strong>{value}</strong><span>{label}</span></div>
          ))}
        </section>

        <section className="section shell" id="urunler">
          <div className="section-copy">
            <span className="eyebrow">Tek stüdyo, dört ürün</span>
            <h2>Her çifte özel,<br />teslimata hazır içerik.</h2>
          </div>
          <div className="product-grid">
            {products.map(([title, text], index) => (
              <article className="product-card" key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="steps shell" id="nasil">
          <span className="eyebrow">Basit iş akışı</span>
          <h2>Fotoğrafları yükle. Tarzı seç. Teslim et.</h2>
          <div className="step-grid">
            <p><b>01</b> Çiftin en iyi fotoğraflarını yükle.</p>
            <p><b>02</b> Ürün, stil ve video formatını seç.</p>
            <p><b>03</b> AI üretimini indir ve müşterinle paylaş.</p>
          </div>
          <button className="btn btn-light" type="button" onClick={onStudio}>İlk projeyi oluştur</button>
        </section>

        <section className="pricing shell" id="fiyat">
          <div className="section-copy">
            <span className="eyebrow">Esnek paketler</span>
            <h2>Stüdyona göre büyüyen<br />fiyatlandırma.</h2>
          </div>
          <div className="plan-grid">
            {plans.map((plan) => (
              <article className={`plan-card${plan.highlight ? ' plan-featured' : ''}`} key={plan.name}>
                {plan.highlight && <span className="plan-badge">En popüler</span>}
                <h3>{plan.name}</h3>
                <div className="plan-price">{plan.price}<small>{plan.note}</small></div>
                <ul>{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
                <button className={`btn ${plan.highlight ? 'btn-primary' : 'btn-ghost'}`} type="button" onClick={onStudio}>{plan.cta}</button>
              </article>
            ))}
          </div>
        </section>

        <section className="faq shell" aria-label="Sık sorulan sorular">
          <span className="eyebrow">Sık sorulanlar</span>
          <div className="faq-list">
            {faqs.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="cta-banner shell">
          <h2>İlk videonu bugün üret.</h2>
          <p>25 başlangıç kredisi hazır. Kredi kartı gerekmez.</p>
          <button className="btn btn-light" type="button" onClick={onStudio}>Ücretsiz dene</button>
        </section>
      </main>

      <footer className="shell"><span>merasim.ai</span><p>Fotoğrafçıların yeni nesil video stüdyosu.</p></footer>
    </div>
  )
}
