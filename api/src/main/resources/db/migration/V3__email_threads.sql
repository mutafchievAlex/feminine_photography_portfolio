ALTER TABLE inquiries
    ADD COLUMN IF NOT EXISTS last_photographer_message TEXT,
    ADD COLUMN IF NOT EXISTS last_client_message TEXT;

ALTER TABLE bookings
    ADD COLUMN IF NOT EXISTS last_photographer_message TEXT,
    ADD COLUMN IF NOT EXISTS last_client_message TEXT;
