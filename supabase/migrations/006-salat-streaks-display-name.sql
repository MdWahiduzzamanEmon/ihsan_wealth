-- Add display_name to salat_streaks for leaderboard
ALTER TABLE salat_streaks ADD COLUMN IF NOT EXISTS display_name VARCHAR(100);
