import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Shield } from 'lucide-react';
import { SubscriptionStatus } from './SubscriptionStatus';
import { useProfile } from '../hooks/useProfile';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const { profile } = useProfile();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-navy-900 shadow-lg border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center space-x-4">
                <div className="text-2xl font-bold text-white">
                  بارشستر
                </div>
                <div className="text-gold-400 text-sm font-medium">
                  Brothers in Islam
                </div>
              </Link>
              
              {/* Navigation Links */}
              <div className="hidden md:flex items-center space-x-6 ml-8">
                <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link to="/events" className="text-slate-300 hover:text-white transition-colors">
                  Events
                </Link>
                <Link to="/about" className="text-slate-300 hover:text-white transition-colors">
                  About
                </Link>
                <Link to="/profile" className="text-slate-300 hover:text-white transition-colors">
                  Profile
                </Link>
                {profile?.is_admin && (
                  <Link to="/admin" className="text-gold-400 hover:text-gold-300 transition-colors flex items-center space-x-1">
                    <Shield className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <SubscriptionStatus />
              <div className="text-white text-sm">
                As-salamu alaikum, {profile?.full_name || user.email?.split('@')[0]}
              </div>
              <button
                onClick={logout}
                className="text-slate-300 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-navy-800"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}