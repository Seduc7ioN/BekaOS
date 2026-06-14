import { FieldValue } from 'firebase-admin/firestore'
import { adminDb, adminReady } from './_admin.js'
import { runProvider } from './_providers.js'

const BATCH = 3

// Kuyruktaki bir üretimi işle: proje + kredi + ledger güncellemeleriyle.
async function processGeneration(db, snapshot) {
  const generation = { id: snapshot.id, ...snapshot.data() }
  const projectRef = db.collection('projects').doc(generation.projectId)

  await snapshot.ref.update({ status: 'processing', startedAt: FieldValue.serverTimestamp() })
  await projectRef.update({ status: 'processing', progress: 45 })

  try {
    const projectSnap = await projectRef.get()
    const assets = projectSnap.data()?.assets || []
    const result = await runProvider(generation, assets)

    if (result.status === 'processing') {
      await projectRef.update({ status: 'processing', progress: 70 })
      await snapshot.ref.update({ status: 'processing', externalId: result.externalId || null })
      return 'processing'
    }

    // Hazır: proje + üretim güncelle, krediyi düş, ledger kaydı ekle.
    await projectRef.update({
      status: 'ready',
      progress: 100,
      resultUrl: result.resultUrl || '',
      completedAt: FieldValue.serverTimestamp(),
    })
    await snapshot.ref.update({
      status: 'ready',
      resultUrl: result.resultUrl || '',
      simulated: Boolean(result.simulated),
      completedAt: FieldValue.serverTimestamp(),
    })

    const cost = generation.creditCost || 1
    const studioRef = db.collection('studios').doc(generation.ownerId)
    await db.runTransaction(async (tx) => {
      const studio = await tx.get(studioRef)
      const current = studio.data()?.credits ?? 0
      tx.update(studioRef, { credits: Math.max(0, current - cost) })
      tx.set(db.collection('creditLedger').doc(), {
        ownerId: generation.ownerId,
        generationId: generation.id,
        delta: -cost,
        reason: generation.product,
        createdAt: FieldValue.serverTimestamp(),
      })
    })
    return 'ready'
  } catch (error) {
    await projectRef.update({ status: 'error', errorMessage: error.message || 'Üretim hatası' })
    await snapshot.ref.update({ status: 'error', errorMessage: error.message || 'Üretim hatası' })
    return 'error'
  }
}

export default async function handler(request, response) {
  // Cron/manuel tetikleme güvenliği.
  const secret = process.env.CRON_SECRET
  if (secret) {
    const provided = (request.headers.authorization || '').replace(/^Bearer\s+/i, '')
    if (provided !== secret) {
      response.status(401).json({ error: 'Yetkisiz' })
      return
    }
  }

  if (!adminReady) {
    response.status(503).json({ error: 'Firebase Admin yapılandırılmamış.' })
    return
  }

  try {
    const db = adminDb()
    const queued = await db
      .collection('generations')
      .where('status', '==', 'queued')
      .orderBy('createdAt', 'asc')
      .limit(BATCH)
      .get()

    const results = []
    for (const snapshot of queued.docs) {
      results.push(await processGeneration(db, snapshot))
    }

    response.status(200).json({ picked: queued.size, results })
  } catch (error) {
    response.status(500).json({ error: error.message || 'İşleme hatası' })
  }
}
