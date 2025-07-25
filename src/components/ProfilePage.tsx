import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { Camera, Save, User, Phone, FileText } from 'lucide-react';

export function ProfilePage() {
  const { profile, updateProfile } = useProfile();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone_number: profile?.phone_number || '',
    bio: profile?.bio || '',
    profile_image_url: profile?.profile_image_url || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  React.useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone_number: profile.phone_number || '',
        bio: profile.bio || '',
        profile_image_url: profile.profile_image_url || ''
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, profile_image_url: e.target.value });
  };

  if (!profile) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Profile Settings</h1>
        <p className="text-slate-600">Update your personal information and preferences</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {/* Profile Image */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-navy-100 rounded-full flex items-center justify-center overflow-hidden">
              {formData.profile_image_url ? (
                <img 
                  src={formData.profile_image_url} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <span className={`text-navy-600 font-semibold text-2xl ${formData.profile_image_url ? 'hidden' : ''}`}>
                {(formData.full_name || profile.email).charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute bottom-0 right-0 bg-navy-600 rounded-full p-2">
              <Camera className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="profile_image_url" className="block text-sm font-medium text-slate-700 mb-2">
              Profile Image URL
            </label>
            <input
              type="url"
              id="profile_image_url"
              value={formData.profile_image_url}
              onChange={handleImageUrlChange}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 transition-colors"
              placeholder="https://example.com/your-image.jpg"
            />
            <p className="text-sm text-slate-500 mt-1">
              Enter a URL to your profile image (e.g., from Google Drive, Dropbox, etc.)
            </p>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-semibold text-slate-700 mb-2">
            <User className="inline h-4 w-4 mr-1" />
            Full Name
          </label>
          <input
            type="text"
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 transition-colors"
            placeholder="Enter your full name"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="phone_number" className="block text-sm font-semibold text-slate-700 mb-2">
            <Phone className="inline h-4 w-4 mr-1" />
            Phone Number
          </label>
          <input
            type="tel"
            id="phone_number"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 transition-colors"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-semibold text-slate-700 mb-2">
            <FileText className="inline h-4 w-4 mr-1" />
            About Me
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 transition-colors resize-none"
            placeholder="Tell the brotherhood about yourself..."
          />
        </div>

        {/* Account Info (Read-only) */}
        <div className="bg-slate-50 rounded-lg p-4 space-y-2">
          <h3 className="font-semibold text-slate-800">Account Information</h3>
          <div className="text-sm text-slate-600">
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Member since:</strong> {new Date(profile.created_at).toLocaleDateString()}</p>
            <p><strong>Status:</strong> 
              <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                profile.is_approved 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {profile.is_approved ? 'Approved' : 'Pending Approval'}
              </span>
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-navy-600 to-navy-700 text-white py-3 rounded-lg font-semibold hover:from-navy-700 hover:to-navy-800 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </form>
    </div>
  );
}