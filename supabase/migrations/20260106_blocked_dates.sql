-- Create blocked_dates table for managing photographer unavailability
CREATE TABLE public.blocked_dates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookups by date range
CREATE INDEX idx_blocked_dates_range ON public.blocked_dates(start_date, end_date);

-- Enable RLS
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can manage blocked dates
CREATE POLICY "Admins can manage blocked dates"
    ON public.blocked_dates
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Policy: Clients can view blocked dates
CREATE POLICY "Clients can view blocked dates"
    ON public.blocked_dates
    FOR SELECT
    USING (true);
