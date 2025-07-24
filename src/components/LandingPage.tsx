import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, MapPin, Heart } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900">
      <div className="relative overflow-hidden">
        {/* Islamic pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm-20-18c9.941 0 18 8.059 18 18s-8.059 18-18 18S-8 38.941-8 30s8.059-18 18-18z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Logo/Title */}
            <div className="mb-8">
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
                بارشستر
              </h1>
              <div className="text-2xl md:text-3xl text-gold-400 font-light mb-2">
                Barchester
              </div>
              <p className="text-xl text-slate-300 font-medium">
                Brothers in Islam Community
              </p>
            </div>

            {/* Subtitle */}
            <div className="max-w-2xl mx-auto mb-12">
              <p className="text-lg text-slate-200 leading-relaxed">
                An exclusive community for our brotherhood, where we strengthen our bonds, 
                plan our Friday gatherings, and support each other in faith and friendship.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-4 gap-8 mb-16">
              <div className="text-center">
                <div className="bg-navy-800 bg-opacity-50 p-6 rounded-xl border border-navy-700 backdrop-blur-sm">
                  <Users className="h-8 w-8 text-gold-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Brotherhood</h3>
                  <p className="text-slate-300 text-sm">Connect with your brothers in faith</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-navy-800 bg-opacity-50 p-6 rounded-xl border border-navy-700 backdrop-blur-sm">
                  <Calendar className="h-8 w-8 text-emerald-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Friday Plans</h3>
                  <p className="text-slate-300 text-sm">Organize weekly gatherings</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-navy-800 bg-opacity-50 p-6 rounded-xl border border-navy-700 backdrop-blur-sm">
                  <MapPin className="h-8 w-8 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Locations</h3>
                  <p className="text-slate-300 text-sm">Find and share gathering spots</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-navy-800 bg-opacity-50 p-6 rounded-xl border border-navy-700 backdrop-blur-sm">
                  <Heart className="h-8 w-8 text-red-400 mx-auto mb-4" />
                  <h3 className="text-white font-semibold mb-2">Contribute</h3>
                  <p className="text-slate-300 text-sm">Support community events</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-4">
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gold-400 to-gold-500 text-navy-900 font-semibold rounded-lg hover:from-gold-500 hover:to-gold-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Enter Brotherhood Portal
              </Link>
              <p className="text-slate-400 text-sm">
                Exclusive access for Barchester brothers only
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}