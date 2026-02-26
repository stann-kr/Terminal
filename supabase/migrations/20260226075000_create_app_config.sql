CREATE TABLE IF NOT EXISTS app_config (
  key text PRIMARY KEY,
  value text NOT NULL
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON app_config FOR SELECT USING (true);
CREATE POLICY "Enable update for admin" ON app_config FOR UPDATE USING (true);

INSERT INTO app_config (key, value) VALUES ('live_force_open', 'false');
