-- Galeri tablosuna anonim INSERT izni (QR ile yukleme icin)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can insert gallery' AND tablename = 'gallery') THEN
    CREATE POLICY "Public can insert gallery" ON gallery
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Galeri tablosuna anonim SELECT izni (QR ile goruntuleme icin)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view gallery' AND tablename = 'gallery') THEN
    CREATE POLICY "Public can view gallery" ON gallery
      FOR SELECT USING (true);
  END IF;
END $$;

-- Storage'a anonim upload izni (QR ile fotograf yukleme icin)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can upload gallery images' AND tablename = 'objects') THEN
    CREATE POLICY "Public can upload gallery images" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'gallery');
  END IF;
END $$;

-- Storage'dan anonim okuma izni (fotograflari gormek icin)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view gallery images' AND tablename = 'objects') THEN
    CREATE POLICY "Public can view gallery images" ON storage.objects
      FOR SELECT USING (bucket_id = 'gallery');
  END IF;
END $$;

-- Bildirim tablosuna anonim INSERT izni (QR yukleme bildirimi icin)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can insert notifications' AND tablename = 'notifications') THEN
    CREATE POLICY "Public can insert notifications" ON notifications
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Guests tablosuna anonim INSERT izni (RSVP icin)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can insert guests' AND tablename = 'guests') THEN
    CREATE POLICY "Public can insert guests" ON guests
      FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Guests tablosuna anonim SELECT izni (RSVP durumunugormek icin)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public can view guests' AND tablename = 'guests') THEN
    CREATE POLICY "Public can view guests" ON guests
      FOR SELECT USING (true);
  END IF;
END $$;
