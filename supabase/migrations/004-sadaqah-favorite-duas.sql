-- ═══ SADAQAH (VOLUNTARY CHARITY) RECORDS ═══

CREATE TABLE IF NOT EXISTS sadaqah_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(14,2) NOT NULL,
  currency VARCHAR(4) NOT NULL DEFAULT 'USD',
  category VARCHAR(50) NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sadaqah_user_date ON sadaqah_records(user_id, date DESC);

ALTER TABLE sadaqah_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own sadaqah" ON sadaqah_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sadaqah" ON sadaqah_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own sadaqah" ON sadaqah_records FOR DELETE USING (auth.uid() = user_id);

-- ═══ FAVORITE DUAS ═══

CREATE TABLE IF NOT EXISTS favorite_duas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dua_id VARCHAR(20) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, dua_id)
);

ALTER TABLE favorite_duas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own dua favorites" ON favorite_duas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own dua favorites" ON favorite_duas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own dua favorites" ON favorite_duas FOR DELETE USING (auth.uid() = user_id);
