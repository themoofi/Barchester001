import React, { useState, useEffect } from 'react';
import { supabase } from '../context/AuthContext';
import { Event, EventSuggestion } from '../types';
import { useProfile } from '../hooks/useProfile';
import { MapPin, Calendar, Clock, MessageSquare, Send, Trash2 } from 'lucide-react';

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [suggestions, setSuggestions] = useState<EventSuggestion[]>([]);
  const [newSuggestion, setNewSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile } = useProfile();

  useEffect(() => {
    fetchEvents();
    fetchSuggestions();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const { data, error } = await supabase
        .from('event_suggestions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSuggestions(data || []);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuggestion.trim() || !profile) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('event_suggestions')
        .insert({
          user_id: profile.user_id,
          user_name: profile.full_name || profile.email.split('@')[0],
          suggestion: newSuggestion.trim()
        });

      if (error) throw error;
      setNewSuggestion('');
      await fetchSuggestions();
    } catch (error) {
      console.error('Error submitting suggestion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteSuggestion = async (suggestionId: string) => {
    try {
      const { error } = await supabase
        .from('event_suggestions')
        .delete()
        .eq('id', suggestionId);

      if (error) throw error;
      await fetchSuggestions();
    } catch (error) {
      console.error('Error deleting suggestion:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Upcoming Events</h1>
        <p className="text-slate-600">Join us for our brotherhood gatherings</p>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {events.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No upcoming events scheduled</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">{event.title}</h3>
                      <p className="text-slate-600">{event.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.event_date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Clock className="h-4 w-4" />
                        <span>{event.event_time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-600">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location_name}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Map */}
                  {event.location_lat && event.location_lng && (
                    <div className="w-full lg:w-80 h-48 bg-slate-100 rounded-lg overflow-hidden">
                      <iframe
                        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dw901SwHHqfeWM&q=${event.location_lat},${event.location_lng}&zoom=15`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`Map for ${event.title}`}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Suggestions Section */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
          <MessageSquare className="h-6 w-6 mr-2" />
          Friday Event Suggestions
        </h2>
        
        {/* Submit Suggestion Form */}
        <form onSubmit={submitSuggestion} className="mb-8">
          <div className="flex space-x-4">
            <input
              type="text"
              value={newSuggestion}
              onChange={(e) => setNewSuggestion(e.target.value)}
              placeholder="Share your suggestion for upcoming Friday events..."
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy-500 focus:border-navy-500 transition-colors"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting || !newSuggestion.trim()}
              className="px-6 py-3 bg-gradient-to-r from-navy-600 to-navy-700 text-white rounded-lg font-semibold hover:from-navy-700 hover:to-navy-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? 'Sending...' : 'Send'}</span>
            </button>
          </div>
        </form>

        {/* Suggestions List */}
        <div className="space-y-4">
          {suggestions.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No suggestions yet. Be the first to share an idea!</p>
          ) : (
            suggestions.map((suggestion) => (
              <div key={suggestion.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-slate-800">{suggestion.user_name}</span>
                      <span className="text-sm text-slate-500">
                        {new Date(suggestion.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-700">{suggestion.suggestion}</p>
                  </div>
                  {profile?.is_admin && (
                    <button
                      onClick={() => deleteSuggestion(suggestion.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}