import { handleUpload } from '@vercel/blob/client'

async function verifyFirebaseUser(idToken) {
  if (!idToken || !process.env.VITE_FIREBASE_API_KEY) return null

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.VITE_FIREBASE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ idToken }),
    },
  )

  if (!response.ok) return null
  const result = await response.json()
  return result.users?.[0] || null
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const result = await handleUpload({
      request,
      body: request.body,
      onBeforeGenerateToken: async (pathname) => {
        const authorization = request.headers.authorization || ''
        const user = await verifyFirebaseUser(authorization.replace(/^Bearer\s+/i, ''))

        if (!user || !pathname.startsWith(`studios/${user.localId}/projects/`)) {
          throw new Error('Bu yükleme için yetkiniz yok.')
        }

        return {
          allowedContentTypes: ['image/*'],
          maximumSizeInBytes: 20 * 1024 * 1024,
          addRandomSuffix: true,
          allowOverwrite: false,
          cacheControlMaxAge: 60 * 60 * 24 * 30,
        }
      },
    })

    response.status(200).json(result)
  } catch (error) {
    response.status(400).json({ error: error.message || 'Yükleme başlatılamadı.' })
  }
}
