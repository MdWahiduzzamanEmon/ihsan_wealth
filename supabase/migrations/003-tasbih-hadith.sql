-- ═══ TASBIH / DHIKR COUNTER ═══

CREATE TABLE IF NOT EXISTS tasbih_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dhikr_type VARCHAR(50) NOT NULL,
  custom_text TEXT,
  target_count INTEGER NOT NULL DEFAULT 33,
  completed_count INTEGER NOT NULL,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE INDEX idx_tasbih_user_date ON tasbih_sessions(user_id, date DESC);

ALTER TABLE tasbih_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own tasbih" ON tasbih_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasbih" ON tasbih_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasbih" ON tasbih_sessions FOR DELETE USING (auth.uid() = user_id);

-- ═══ FAVORITE HADITHS ═══

CREATE TABLE IF NOT EXISTS favorite_hadiths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hadith_id VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, hadith_id)
);

ALTER TABLE favorite_hadiths ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own hadith favorites" ON favorite_hadiths FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own hadith favorites" ON favorite_hadiths FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own hadith favorites" ON favorite_hadiths FOR DELETE USING (auth.uid() = user_id);
