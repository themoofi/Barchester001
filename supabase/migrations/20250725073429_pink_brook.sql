/*
  # Add user profiles and admin features

  1. New Tables
    - `user_profiles` - Store user profile information (name, phone, bio, image, approval status)
    - `event_suggestions` - Store user suggestions for Friday events
    - `events` - Store upcoming events with location data

  2. Security
    - Enable RLS on all new tables
    - Add policies for users to manage their own profiles
    - Add policies for admins to approve users and manage suggestions
    - Add policies for viewing approved user profiles

  3. Changes
    - Add admin role support
    - Add user approval workflow
    - Add event management with maps
    - Add suggestion system
*/

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text DEFAULT '',
  phone_number text DEFAULT '',
  bio text DEFAULT '',
  profile_image_url text DEFAULT '',
  is_approved boolean DEFAULT false,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create event suggestions table
CREATE TABLE IF NOT EXISTS event_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  suggestion text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  event_date date NOT NULL,
  event_time time NOT NULL,
  location_name text NOT NULL,
  location_lat decimal(10, 8),
  location_lng decimal(11, 8),
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view approved profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (is_approved = true);

CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles admin_profile 
      WHERE admin_profile.user_id = auth.uid() 
      AND admin_profile.is_admin = true 
      AND admin_profile.is_approved = true
    )
  );

-- Event suggestions policies
CREATE POLICY "Users can view all suggestions"
  ON event_suggestions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND is_approved = true
    )
  );

CREATE POLICY "Approved users can insert suggestions"
  ON event_suggestions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND is_approved = true
    )
  );

CREATE POLICY "Admins can delete suggestions"
  ON event_suggestions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND is_admin = true 
      AND is_approved = true
    )
  );

-- Events policies
CREATE POLICY "Approved users can view events"
  ON events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND is_approved = true
    )
  );

CREATE POLICY "Admins can manage events"
  ON events
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND is_admin = true 
      AND is_approved = true
    )
  );

-- Insert admin user profile
INSERT INTO user_profiles (user_id, email, full_name, is_approved, is_admin)
SELECT id, email, 'Mustafa Asghar', true, true
FROM auth.users 
WHERE email = 'MustafaAsghar1000@outlook.com'
ON CONFLICT DO NOTHING;

-- Insert regular user profile
INSERT INTO user_profiles (user_id, email, full_name, is_approved, is_admin)
SELECT id, email, 'Mustafa Khan', true, false
FROM auth.users 
WHERE email = 'MustafaAsghar1000@gmail.com'
ON CONFLICT DO NOTHING;

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, email, full_name, is_approved, is_admin)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE 
      WHEN NEW.email = 'MustafaAsghar1000@outlook.com' THEN true
      WHEN NEW.email = 'MustafaAsghar1000@gmail.com' THEN true
      ELSE false
    END,
    CASE 
      WHEN NEW.email = 'MustafaAsghar1000@outlook.com' THEN true
      ELSE false
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();

-- Add sample event
INSERT INTO events (title, description, event_date, event_time, location_name, location_lat, location_lng, created_by)
SELECT 
  'BBQ Night at Central Park',
  'Join us for a wonderful BBQ evening with the brotherhood. Bring your appetite and good vibes!',
  CURRENT_DATE + INTERVAL '7 days',
  '18:00',
  'Central Park, New York',
  40.7829,
  -73.9654,
  id
FROM auth.users 
WHERE email = 'MustafaAsghar1000@outlook.com'
LIMIT 1
ON CONFLICT DO NOTHING;