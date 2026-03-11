-- Site visitor counter (single-row table)
CREATE TABLE site_views (
  id INT PRIMARY KEY DEFAULT 1,
  total_count BIGINT NOT NULL DEFAULT 0
);

INSERT INTO site_views (id, total_count) VALUES (1, 0);

ALTER TABLE site_views ENABLE ROW LEVEL SECURITY;

-- Anyone can read the count
CREATE POLICY "public_read" ON site_views FOR SELECT USING (true);
