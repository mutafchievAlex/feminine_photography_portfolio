CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE photographer_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    bio TEXT,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(32),
    location VARCHAR(255),
    starting_price NUMERIC(12,2),
    rating DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    version BIGINT
);

CREATE TABLE photographer_specialties (
    photographer_id UUID REFERENCES photographer_profiles (id) ON DELETE CASCADE,
    specialty VARCHAR(255) NOT NULL
);

CREATE TABLE albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photographer_id UUID NOT NULL REFERENCES photographer_profiles (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE,
    cover_image_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    version BIGINT
);

CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID NOT NULL REFERENCES albums (id) ON DELETE CASCADE,
    title VARCHAR(255),
    description TEXT,
    image_url VARCHAR(1024) NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    version BIGINT
);

CREATE TABLE photo_tags (
    photo_id UUID REFERENCES photos (id) ON DELETE CASCADE,
    tag VARCHAR(255) NOT NULL
);

CREATE TABLE inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photographer_id UUID NOT NULL REFERENCES photographer_profiles (id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    message TEXT,
    status VARCHAR(32) NOT NULL,
    desired_event_at TIMESTAMP WITH TIME ZONE,
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    version BIGINT
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photographer_id UUID NOT NULL REFERENCES photographer_profiles (id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    event_date DATE,
    location VARCHAR(255),
    status VARCHAR(32) NOT NULL,
    contract_url VARCHAR(512),
    total_amount NUMERIC(12,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE,
    version BIGINT
);

CREATE INDEX idx_albums_photographer ON albums (photographer_id);
CREATE INDEX idx_photos_album ON photos (album_id);
CREATE INDEX idx_inquiries_photographer ON inquiries (photographer_id);
CREATE INDEX idx_bookings_photographer ON bookings (photographer_id);
