import React, { useState, useEffect } from 'react';
import { supabase } from '../context/AuthContext';
import { UserProfile } from '../types';
import { Users, MapPin, Calendar } from 'lucide-react';

export function AboutPage() {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleProfiles, setVisibleProfiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const profileId = entry.target.getAttribute('data-profile-id');
            if (profileId) {
              setVisibleProfiles(prev => new Set([...prev, profileId]));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const profileElements = document.querySelectorAll('[data-profile-id]');
    profileElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [profiles]);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading brotherhood...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Meet the Brotherhood</h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Our community is built on the foundation of Islamic brotherhood, mutual support, and shared values. 
          Get to know the amazing brothers who make up our Barchester family.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-navy-500 to-navy-600 text-white p-6 rounded-xl text-center">
          <Users className="h-8 w-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">{profiles.length}</div>
          <div className="text-navy-200">Active Brothers</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-xl text-center">
          <Calendar className="h-8 w-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">Weekly</div>
          <div className="text-emerald-200">Friday Gatherings</div>
        </div>
        <div className="bg-gradient-to-br from-gold-500 to-gold-600 text-white p-6 rounded-xl text-center">
          <MapPin className="h-8 w-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">Multiple</div>
          <div className="text-gold-200">Locations</div>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {profiles.map((profile, index) => (
          <div
            key={profile.id}
            data-profile-id={profile.id}
            className={`bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden transform transition-all duration-700 ${
              visibleProfiles.has(profile.id) 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <div className="p-6 text-center">
              {/* Profile Image */}
              <div className="w-24 h-24 mx-auto mb-4 bg-navy-100 rounded-full flex items-center justify-center overflow-hidden">
                {profile.profile_image_url ? (
                  <img 
                    src={profile.profile_image_url} 
                    alt={profile.full_name || 'Profile'} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <span className={`text-navy-600 font-semibold text-2xl ${profile.profile_image_url ? 'hidden' : ''}`}>
                  {(profile.full_name || profile.email).charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Name */}
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {profile.full_name || profile.email.split('@')[0]}
              </h3>

              {/* Admin Badge */}
              {profile.is_admin && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gold-100 text-gold-700 mb-3">
                  <span className="w-2 h-2 bg-gold-400 rounded-full mr-2"></span>
                  Administrator
                </div>
              )}

              {/* Bio */}
              {profile.bio && (
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {profile.bio}
                </p>
              )}

              {/* Contact Info */}
              <div className="space-y-2 text-sm text-slate-500">
                {profile.phone_number && (
                  <div className="flex items-center justify-center space-x-2">
                    <span>📱</span>
                    <span>{profile.phone_number}</span>
                  </div>
                )}
                <div className="flex items-center justify-center space-x-2">
                  <span>📧</span>
                  <span className="truncate">{profile.email}</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span>📅</span>
                  <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Decorative Bottom Border */}
            <div className="h-1 bg-gradient-to-r from-navy-500 via-gold-400 to-emerald-500"></div>
          </div>
        ))}
      </div>

      {profiles.length === 0 && (
        <div className="text-center py-20">
          <Users className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No Brothers Yet</h3>
          <p className="text-slate-600">The brotherhood is just getting started. Check back soon!</p>
        </div>
      )}
    </div>
  );
}