-- Zakat Calculator Schema

-- Countries (replaces hardcoded array)
CREATE TABLE IF NOT EXISTS countries (
  code VARCHAR(4) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  currency VARCHAR(4) NOT NULL,
  currency_symbol VARCHAR(10) NOT NULL,
  flag VARCHAR(10) NOT NULL,
  locale VARCHAR(10) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Islamic quotes (replaces hardcoded arrays)
CREATE TABLE IF NOT EXISTS islamic_quotes (
  id SERIAL PRIMARY KEY,
  type VARCHAR(10) NOT NULL CHECK (type IN ('hadith', 'quran', 'dua')),
  arabic TEXT NOT NULL,
  source VARCHAR(200) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS quote_translations (
  id SERIAL PRIMARY KEY,
  quote_id INTEGER NOT NULL REFERENCES islamic_quotes(id) ON DELETE CASCADE,
  lang VARCHAR(4) NOT NULL,
  text TEXT NOT NULL,
  UNIQUE(quote_id, lang)
);

-- Dynamic config (replaces all hardcoded constants)
CREATE TABLE IF NOT EXISTS zakat_config (
  key VARCHAR(50) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Zakat records (history per user)
CREATE TABLE IF NOT EXISTS zakat_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  year_type VARCHAR(10) DEFAULT 'gregorian' CHECK (year_type IN ('gregorian', 'hijri')),
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  currency VARCHAR(4) NOT NULL,
  country VARCHAR(4),
  nisab_basis VARCHAR(10) NOT NULL CHECK (nisab_basis IN ('gold', 'silver')),
  form_data JSONB NOT NULL,
  gold_price_per_gram DECIMAL(12,4) NOT NULL,
  silver_price_per_gram DECIMAL(12,4) NOT NULL,
  prices_were_live BOOLEAN DEFAULT false,
  total_assets DECIMAL(14,2) NOT NULL,
  total_deductions DECIMAL(14,2) NOT NULL,
  net_zakatable_wealth DECIMAL(14,2) NOT NULL,
  nisab_threshold DECIMAL(14,2) NOT NULL,
  is_above_nisab BOOLEAN NOT NULL,
  zakat_amount DECIMAL(14,2) NOT NULL,
  breakdown JSONB NOT NULL,
  notes TEXT,
  is_paid BOOLEAN DEFAULT false,
  paid_at TIMESTAMPTZ,
  UNIQUE(user_id, year, year_type)
);

CREATE INDEX IF NOT EXISTS idx_zakat_records_user_year ON zakat_records(user_id, year DESC);

-- Zakat payments (track where money went)
CREATE TABLE IF NOT EXISTS zakat_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID NOT NULL REFERENCES zakat_records(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(14,2) NOT NULL,
  recipient VARCHAR(200),
  category VARCHAR(50),
  paid_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_payments_record ON zakat_payments(record_id);

-- RLS Policies
ALTER TABLE zakat_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE zakat_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own records" ON zakat_records
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own records" ON zakat_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own records" ON zakat_records
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own records" ON zakat_records
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payments" ON zakat_payments
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON zakat_payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own payments" ON zakat_payments
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own payments" ON zakat_payments
  FOR DELETE USING (auth.uid() = user_id);

-- Public read access for config/quotes/countries
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read countries" ON countries FOR SELECT USING (true);

ALTER TABLE islamic_quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read quotes" ON islamic_quotes FOR SELECT USING (true);

ALTER TABLE quote_translations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read translations" ON quote_translations FOR SELECT USING (true);

ALTER TABLE zakat_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read config" ON zakat_config FOR SELECT USING (true);
