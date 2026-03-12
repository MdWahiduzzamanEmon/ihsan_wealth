-- ═══ SALAT (PRAYER) TRACKER ═══

CREATE TABLE IF NOT EXISTS salat_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  prayer_name VARCHAR(30) NOT NULL,
  -- prayer_name values:
  --   Fard: fajr, dhuhr, asr, maghrib, isha
  --   Friday: jummah (replaces dhuhr on Fridays)
  --   Eid: eid_al_fitr, eid_al_adha
  --   Sunnah: sunnah_fajr, sunnah_dhuhr_before, sunnah_dhuhr_after,
  --           sunnah_maghrib, sunnah_isha
  --   Nafl: tahajjud, duha, ishraq, awwabin
  --   Ramadan: taraweeh, witr_ramadan
  prayer_type VARCHAR(10) NOT NULL DEFAULT 'fard',
  -- prayer_type: fard, sunnah, nafl, wajib, ramadan
  status VARCHAR(20) NOT NULL DEFAULT 'prayed',
  -- status: prayed, missed, late, qaza
  in_jamaah BOOLEAN NOT NULL DEFAULT false,
  on_time BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date, prayer_name)
);

CREATE INDEX idx_salat_user_date ON salat_records(user_id, date DESC);
CREATE INDEX idx_salat_user_type ON salat_records(user_id, prayer_type, date DESC);

ALTER TABLE salat_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own salat" ON salat_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own salat" ON salat_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own salat" ON salat_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own salat" ON salat_records FOR DELETE USING (auth.uid() = user_id);

-- ═══ WEEKLY GOALS ═══

CREATE TABLE IF NOT EXISTS salat_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  goal_type VARCHAR(30) NOT NULL,
  -- goal_type: all_fard, all_on_time, jamaah_count, sunnah_count, no_missed
  target_value INTEGER NOT NULL DEFAULT 5,
  achieved_value INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_start, goal_type)
);

CREATE INDEX idx_goals_user_week ON salat_goals(user_id, week_start DESC);

ALTER TABLE salat_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own goals" ON salat_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON salat_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON salat_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON salat_goals FOR DELETE USING (auth.uid() = user_id);

-- ═══ RAMADAN TRACKER ═══

CREATE TABLE IF NOT EXISTS ramadan_tracker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  hijri_year INTEGER NOT NULL,
  date DATE NOT NULL,
  day_number INTEGER NOT NULL,
  fasted BOOLEAN NOT NULL DEFAULT false,
  suhoor BOOLEAN NOT NULL DEFAULT false,
  iftar BOOLEAN NOT NULL DEFAULT false,
  taraweeh BOOLEAN NOT NULL DEFAULT false,
  taraweeh_rakats INTEGER,
  quran_pages INTEGER DEFAULT 0,
  sadaqah_given BOOLEAN NOT NULL DEFAULT false,
  dua_before_iftar BOOLEAN NOT NULL DEFAULT false,
  itikaf BOOLEAN NOT NULL DEFAULT false,
  laylatul_qadr_worship BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_ramadan_user_year ON ramadan_tracker(user_id, hijri_year DESC);

ALTER TABLE ramadan_tracker ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own ramadan" ON ramadan_tracker FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ramadan" ON ramadan_tracker FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ramadan" ON ramadan_tracker FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ramadan" ON ramadan_tracker FOR DELETE USING (auth.uid() = user_id);

-- ═══ STREAK LEADERBOARD CACHE ═══

CREATE TABLE IF NOT EXISTS salat_streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  total_fard_prayed INTEGER NOT NULL DEFAULT 0,
  total_on_time INTEGER NOT NULL DEFAULT 0,
  total_jamaah INTEGER NOT NULL DEFAULT 0,
  total_sunnah INTEGER NOT NULL DEFAULT 0,
  last_updated DATE NOT NULL DEFAULT CURRENT_DATE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE salat_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view all streaks" ON salat_streaks FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert own streaks" ON salat_streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own streaks" ON salat_streaks FOR UPDATE USING (auth.uid() = user_id);
