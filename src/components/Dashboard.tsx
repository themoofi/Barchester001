import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { Calendar, Plus, Users, MapPin, Gift, Settings, CreditCard } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const { profile } = useProfile();

  const quickActions = [
    {
      title: 'Create Friday Plan',
      description: 'Organize a new gathering for the brotherhood',
      icon: Plus,
      link: '/create-plan',
      color: 'from-emerald-500 to-emerald-600',
      hoverColor: 'hover:from-emerald-600 hover:to-emerald-700',
      adminOnly: true
    },
    {
      title: 'Upcoming Events',
      description: 'View and join planned gatherings',
      icon: Calendar,
      link: '/events',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700',
      adminOnly: false
    },
    {
      title: 'Purchase Supplies',
      description: 'Buy supplies for upcoming events',
      icon: CreditCard,
      link: '/purchase',
      color: 'from-gold-500 to-gold-600',
      hoverColor: 'hover:from-gold-600 hover:to-gold-700',
      adminOnly: false
    },
    {
      title: 'Meet the Brotherhood',
      description: 'Get to know your fellow brothers',
      icon: Users,
      link: '/about',
      color: 'from-slate-500 to-slate-600',
      hoverColor: 'hover:from-slate-600 hover:to-slate-700',
      adminOnly: false
    }
  ];

  const filteredActions = quickActions.filter(action => 
    !action.adminOnly || profile?.is_admin
  );
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-navy-600 to-navy-700 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              As-salamu alaikum, {profile?.full_name || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-navy-200 text-lg">
              Welcome back to the Barchester brotherhood community
            </p>
            {profile?.is_admin && (
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gold-400 text-navy-900">
                <span className="w-2 h-2 bg-navy-900 rounded-full mr-2"></span>
                Administrator
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-navy-200 text-sm">Member since</div>
            <div className="text-white font-semibold">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently'}</div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className={`bg-gradient-to-br ${action.color} ${action.hoverColor} p-6 rounded-xl text-white transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <Icon className="h-8 w-8" />
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
                    <p className="text-sm opacity-90">{action.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Activity</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center space-x-3 mb-4">
              <Calendar className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-slate-800">Next Friday Gathering</h3>
            </div>
            <div className="space-y-2">
              <p className="text-slate-600">BBQ Night at Central Park</p>
              <p className="text-sm text-slate-500">January 26, 2025 at 6:00 PM</p>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-slate-400" />
                <span className="text-small text-slate-500">12 brothers attending</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
            <div className="flex items-center space-x-3 mb-4">
              <CreditCard className="h-6 w-6 text-emerald-500" />
              <h3 className="text-lg font-semibold text-slate-800">Recent Purchases</h3>
            </div>
            <div className="space-y-2">
              <p className="text-slate-600">Your recent purchases</p>
              <div className="text-sm text-slate-500">
                <p>• BBQ Supplies (Jan 20)</p>
                <p>• Event Materials (Jan 15)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}