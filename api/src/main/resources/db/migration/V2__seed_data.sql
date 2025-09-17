INSERT INTO photographer_profiles (id, full_name, bio, email, phone, location, starting_price, rating)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Amelia Hart', 'Fine art wedding photographer with a passion for storytelling.', 'amelia@example.com', '+1-555-1111', 'San Francisco, CA', 3200.00, 4.9),
    ('22222222-2222-2222-2222-222222222222', 'Lena Brooks', 'Intimate portrait specialist capturing authentic emotions.', 'lena@example.com', '+1-555-2222', 'Portland, OR', 1800.00, 4.8);

INSERT INTO photographer_specialties (photographer_id, specialty) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Weddings'),
    ('11111111-1111-1111-1111-111111111111', 'Editorial'),
    ('22222222-2222-2222-2222-222222222222', 'Portraits'),
    ('22222222-2222-2222-2222-222222222222', 'Lifestyle');

INSERT INTO albums (id, photographer_id, title, description, event_date, cover_image_url)
VALUES
    ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'Golden Gate Wedding', 'An elegant wedding overlooking the bay.', '2024-06-12', 'https://example.com/images/golden-gate-cover.jpg'),
    ('44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'Forest Portrait Series', 'Sun-drenched portraits in Forest Park.', '2024-04-03', 'https://example.com/images/forest-portraits-cover.jpg');

INSERT INTO photos (id, album_id, title, description, image_url, featured)
VALUES
    ('55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'Golden Hour', 'Ceremony captured during golden hour.', 'https://example.com/images/golden-hour.jpg', TRUE),
    ('66666666-6666-6666-6666-666666666666', '33333333-3333-3333-3333-333333333333', 'First Dance', 'An emotional first dance moment.', 'https://example.com/images/first-dance.jpg', FALSE),
    ('77777777-7777-7777-7777-777777777777', '44444444-4444-4444-4444-444444444444', 'Sunlit Smile', 'Natural light portrait among evergreens.', 'https://example.com/images/sunlit-smile.jpg', TRUE);

INSERT INTO photo_tags (photo_id, tag) VALUES
    ('55555555-5555-5555-5555-555555555555', 'wedding'),
    ('55555555-5555-5555-5555-555555555555', 'sunset'),
    ('77777777-7777-7777-7777-777777777777', 'portrait');

INSERT INTO inquiries (id, photographer_id, client_name, client_email, message, status, desired_event_at)
VALUES
    ('88888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'Nora Ellis', 'nora@example.com', 'Are you available for a fall elopement?', 'NEW', '2024-09-21T18:00:00Z'),
    ('99999999-9999-9999-9999-999999999999', '22222222-2222-2222-2222-222222222222', 'Maya Chen', 'maya@example.com', 'Looking for portraits for my small business.', 'RESPONDED', '2024-05-15T17:00:00Z');

INSERT INTO bookings (id, photographer_id, client_name, client_email, event_date, location, status, contract_url, total_amount)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Harper & Quinn', 'harper.quinn@example.com', '2024-07-20', 'Napa Valley, CA', 'CONFIRMED', 'https://example.com/contracts/harper-quinn.pdf', 5400.00),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Riley Morgan', 'riley@example.com', '2024-05-18', 'Portland, OR', 'PENDING', NULL, 2100.00);
