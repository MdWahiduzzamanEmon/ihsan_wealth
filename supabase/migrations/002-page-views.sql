-- Site visitor counter (single-row table)
CREATE TABLE site_views (
  id INT PRIMARY KEY DEFAULT 1,
  total_count BIGINT NOT NULL DEFAULT 0
);

INSERT INTO site_views (id, total_count) VALUES (1, 0);

ALTER TABLE site_views ENABLE ROW LEVEL SECURITY;

-- Anyone can read the count
CREATE POLICY "public_read" ON site_views FOR SELECT USING (true);

-- Atomic increment function (avoids race conditions with concurrent visitors)
CREATE OR REPLACE FUNCTION increment_site_views()
RETURNS BIGINT AS $$
DECLARE
  new_count BIGINT;
BEGIN
  UPDATE site_views
  SET total_count = total_count + 1
  WHERE id = 1
  RETURNING total_count INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
