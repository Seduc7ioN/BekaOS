# Merasim Wedding AI

Fotoğrafçılar için düğün fotoğraflarından AI video üretme platformunun temiz MVP'si.

## İçerik

- Pazarlama sayfası
- Firebase Authentication ile e-posta ve Google girişi
- Firestore tabanlı stüdyo ve proje kayıtları
- Vercel Blob fotoğraf yükleme
- Firebase bağlı değilken çalışan demo stüdyo
- `generations` kuyruğunu işleyen üretim worker'ı (`api/process.js`)

## Üretim worker'ı (AI katmanı)

`api/process.js`, Firestore'daki `queued` üretimleri çeker, AI sağlayıcısını çalıştırır,
projeyi `ready` yapar, kredi düşer ve `creditLedger` kaydı ekler. Vercel cron (`vercel.json`)
her dakika tetikler.

- Sunucu, Firestore'a **Firebase Admin** ile yazar — `FIREBASE_PROJECT_ID`,
  `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` gerekir (servis hesabı).
- AI sağlayıcısı `api/_providers.js` içinde soyutlanmıştır. `REPLICATE_API_TOKEN` ve
  `REPLICATE_MODEL_VERSION` tanımlıysa Replicate image-to-video kullanılır; tanımlı
  değilse **simülasyon** modu (kapak görselini sonuç sayar) devreye girer.
- `CRON_SECRET` tanımlıysa endpoint yalnızca `Authorization: Bearer <secret>` ile çalışır.

Manuel tetikleme:

```bash
curl -X POST https://<deploy>/api/process -H "Authorization: Bearer $CRON_SECRET"
```

## Yerel kurulum

```bash
npm install
cp .env.example .env.local
npm run dev
```

Firebase Console'da Authentication için Email/Password ve Google sağlayıcılarını açın.
Firestore oluşturduktan sonra `.env.local` alanlarını Web App ayarlarıyla doldurun.
Vercel Blob deposunu projeye bağlayarak `BLOB_READ_WRITE_TOKEN` ortam değişkenini oluşturun.

Kuralları dağıtmak için:

```bash
npx firebase-tools deploy --only firestore
```

## Kontrol

```bash
npm run lint
npm run build
```
