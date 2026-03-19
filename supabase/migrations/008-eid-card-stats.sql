-- Global Eid card activity stats (anonymous + authenticated)
CREATE TABLE IF NOT EXISTS eid_card_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action VARCHAR(20) NOT NULL, -- 'download', 'share', 'whatsapp', 'email', 'clipboard', 'sticker_download', 'frame_download'
  card_design VARCHAR(50),
  card_layout VARCHAR(20),
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast aggregation
CREATE INDEX IF NOT EXISTS idx_eid_card_stats_action ON eid_card_stats(action, year);
CREATE INDEX IF NOT EXISTS idx_eid_card_stats_user ON eid_card_stats(user_id, year);

-- Enable RLS
ALTER TABLE eid_card_stats ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (anonymous tracking)
CREATE POLICY "Anyone can insert eid stats" ON eid_card_stats
  FOR INSERT WITH CHECK (true);

-- Users can view own stats
CREATE POLICY "Users can view own eid stats" ON eid_card_stats
  FOR SELECT USING (auth.uid() = user_id);

-- Allow anonymous aggregate reads via RPC (see function below)
-- Global aggregate function for public stats display
CREATE OR REPLACE FUNCTION get_eid_card_global_stats(target_year INTEGER DEFAULT EXTRACT(YEAR FROM NOW())::INTEGER)
RETURNS JSON AS $$
  SELECT json_build_object(
    'total_downloads', COUNT(*) FILTER (WHERE action = 'download'),
    'total_shares', COUNT(*) FILTER (WHERE action IN ('share', 'whatsapp', 'email', 'clipboard')),
    'total_whatsapp', COUNT(*) FILTER (WHERE action = 'whatsapp'),
    'total_stickers', COUNT(*) FILTER (WHERE action = 'sticker_download'),
    'total_frames', COUNT(*) FILTER (WHERE action = 'frame_download'),
    'total_actions', COUNT(*),
    'unique_users', COUNT(DISTINCT user_id)
  )
  FROM eid_card_stats
  WHERE year = target_year;
$$ LANGUAGE sql SECURITY DEFINER;
