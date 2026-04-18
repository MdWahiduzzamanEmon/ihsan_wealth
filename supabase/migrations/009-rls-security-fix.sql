-- Ensure RLS is enabled on all tables (idempotent safety net)
-- Addresses Supabase security advisor warnings for tasbih_sessions and site_views

ALTER TABLE tasbih_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_views ENABLE ROW LEVEL SECURITY;

-- tasbih_sessions: user-owned rows
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tasbih_sessions' AND policyname = 'Users can view own tasbih'
  ) THEN
    CREATE POLICY "Users can view own tasbih" ON tasbih_sessions FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tasbih_sessions' AND policyname = 'Users can insert own tasbih'
  ) THEN
    CREATE POLICY "Users can insert own tasbih" ON tasbih_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'tasbih_sessions' AND policyname = 'Users can delete own tasbih'
  ) THEN
    CREATE POLICY "Users can delete own tasbih" ON tasbih_sessions FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- site_views: public read only, writes via SECURITY DEFINER function only
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'site_views' AND policyname = 'public_read'
  ) THEN
    CREATE POLICY "public_read" ON site_views FOR SELECT USING (true);
  END IF;
END $$;
