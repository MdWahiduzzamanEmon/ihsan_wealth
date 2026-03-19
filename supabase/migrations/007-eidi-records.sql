-- Eidi (Eid gift money) tracking for users
CREATE TABLE IF NOT EXISTS eidi_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  giver_name VARCHAR(200) NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'BDT',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_eidi_records_user_year ON eidi_records(user_id, year DESC);

-- Enable Row-Level Security
ALTER TABLE eidi_records ENABLE ROW LEVEL SECURITY;

-- User isolation policies
CREATE POLICY "Users can view own eidi records" ON eidi_records
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own eidi records" ON eidi_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own eidi records" ON eidi_records
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own eidi records" ON eidi_records
  FOR DELETE USING (auth.uid() = user_id);
