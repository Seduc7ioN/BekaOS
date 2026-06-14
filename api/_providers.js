// AI video sağlayıcısı soyutlaması.
// Gerçek bir sağlayıcı eklemek için runProvider içine kendi entegrasyonunu koy;
// REPLICATE_API_TOKEN tanımlı değilse otomatik olarak simülasyona düşer.

const styleHint = {
  Editorial: 'cinematic, film grain, muted tones',
  Romantik: 'soft romantic light, warm bokeh',
  Zamansız: 'timeless black and white, elegant',
  Enerjik: 'vibrant, dynamic motion, upbeat',
}

// Replicate üzerinden görsel->video üretimi (image-to-video model).
async function runReplicate(generation, assets) {
  const token = process.env.REPLICATE_API_TOKEN
  const version = process.env.REPLICATE_MODEL_VERSION
  if (!token || !version || !assets?.length) return null

  const create = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      version,
      input: {
        image: assets[0],
        prompt: `${generation.product} for a wedding couple, ${styleHint[generation.style] || ''}`,
        aspect_ratio: generation.aspectRatio || '9:16',
      },
    }),
  })

  if (!create.ok) throw new Error(`Replicate başlatılamadı: ${create.status}`)
  let prediction = await create.json()

  // Tamamlanana kadar (kısa) poll et — Vercel fonksiyon süresi içinde.
  const deadline = Date.now() + 50_000
  while (['starting', 'processing'].includes(prediction.status) && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 2500))
    const poll = await fetch(prediction.urls.get, { headers: { Authorization: `Bearer ${token}` } })
    prediction = await poll.json()
  }

  if (prediction.status === 'succeeded') {
    const output = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output
    return { status: 'ready', resultUrl: output }
  }
  if (prediction.status === 'failed' || prediction.status === 'canceled') {
    throw new Error(prediction.error || 'Üretim başarısız oldu.')
  }
  // Süre yetmediyse: hâlâ işleniyor, bir sonraki tetiklemede tekrar denenebilir.
  return { status: 'processing', externalId: prediction.id }
}

// Sağlayıcı yokken: gerçekçi bir "üretim" simülasyonu (kapak görselini sonuç sayar).
function runSimulation(generation, assets) {
  return {
    status: 'ready',
    resultUrl: assets?.[0] || '',
    simulated: true,
  }
}

export async function runProvider(generation, assets) {
  const real = await runReplicate(generation, assets)
  return real || runSimulation(generation, assets)
}
