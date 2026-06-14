const authMessages = {
  'auth/invalid-credential': 'E-posta veya şifre hatalı.',
  'auth/invalid-email': 'Geçerli bir e-posta adresi gir.',
  'auth/user-disabled': 'Bu hesap devre dışı bırakılmış.',
  'auth/user-not-found': 'Bu e-postayla kayıtlı bir stüdyo yok.',
  'auth/wrong-password': 'E-posta veya şifre hatalı.',
  'auth/email-already-in-use': 'Bu e-posta zaten kullanımda. Giriş yapmayı dene.',
  'auth/weak-password': 'Şifre en az 6 karakter olmalı.',
  'auth/popup-closed-by-user': 'Google penceresi kapatıldı. Tekrar dene.',
  'auth/popup-blocked': 'Tarayıcı açılır pencereyi engelledi.',
  'auth/too-many-requests': 'Çok fazla deneme yapıldı. Biraz sonra tekrar dene.',
  'auth/network-request-failed': 'Bağlantı hatası. İnternetini kontrol et.',
}

// Firebase ham hatalarını kullanıcı dostu Türkçe metne çevirir.
export function friendlyError(error) {
  if (!error) return 'Beklenmeyen bir hata oluştu.'
  const code = error.code || ''
  if (authMessages[code]) return authMessages[code]
  if (code.startsWith('permission-denied')) return 'Bu işlem için yetkin yok.'
  // Firebase mesajları "Firebase: ... (auth/...)" biçimindedir; ham kodu gizle.
  if (typeof error.message === 'string' && /Firebase:/i.test(error.message)) {
    return 'İşlem tamamlanamadı. Lütfen tekrar dene.'
  }
  return error.message || 'Beklenmeyen bir hata oluştu.'
}
