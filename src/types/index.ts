export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  phone_number: string;
  bio: string;
  profile_image_url: string;
  is_approved: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventSuggestion {
  id: string;
  user_id: string;
  user_name: string;
  suggestion: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location_name: string;
  location_lat: number;
  location_lng: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}