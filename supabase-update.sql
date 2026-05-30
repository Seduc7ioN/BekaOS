-- Events tablosuna tema ve IBAN alanları
ALTER TABLE events ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'gold';
ALTER TABLE events ADD COLUMN IF NOT EXISTS iban TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS iban_name TEXT;

-- Guests tablosuna children alanı (eğer yoksa)
ALTER TABLE guests ADD COLUMN IF NOT EXISTS children INTEGER DEFAULT 0;
