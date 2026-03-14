CREATE TABLE IF NOT EXISTS live_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nick text NOT NULL,
  message text NOT NULL,
  device_id text,
  created_at timestamp with time zone DEFAULT timezone('utc', now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_live_messages_created_at ON live_messages (created_at DESC);

ALTER TABLE live_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON live_messages FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON live_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable delete for all" ON live_messages FOR DELETE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE live_messages;
