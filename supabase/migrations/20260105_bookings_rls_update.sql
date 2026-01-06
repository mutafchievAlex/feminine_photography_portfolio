-- Update RLS policies for bookings table to allow anonymous submissions

-- Drop existing INSERT policy if it exists
DROP POLICY IF EXISTS "Users can create their own bookings" ON bookings;

-- Create new policy that allows anyone to create bookings
CREATE POLICY "Anyone can create bookings" ON bookings
  FOR INSERT 
  WITH CHECK (true);

-- Make sure SELECT, UPDATE, DELETE policies are appropriate
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can delete their own bookings" ON bookings;

-- Allow users to view their own bookings (if authenticated)
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT 
  USING (
    client_id IS NULL OR 
    client_id = auth.uid()
  );

-- Allow users to update their own bookings (if authenticated)
CREATE POLICY "Users can update their own bookings" ON bookings
  FOR UPDATE 
  USING (
    client_id = auth.uid()
  );

-- Allow admins to see all bookings
CREATE POLICY "Admins can view all bookings" ON bookings
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );

-- Allow admins to update all bookings
CREATE POLICY "Admins can update all bookings" ON bookings
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'admin'
    )
  );
