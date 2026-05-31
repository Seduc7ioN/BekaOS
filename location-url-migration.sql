-- location_url sütunu ekle (Google Maps linki icin)
ALTER TABLE events ADD COLUMN IF NOT EXISTS location_url TEXT;

-- theme ve iban_name sütunlari da eksikse ekle
ALTER TABLE events ADD COLUMN IF NOT EXISTS theme TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS iban TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS iban_name TEXT;
