import React, { useState, useEffect } from 'react';
import { supabase } from '../context/AuthContext';
import { UserProfile } from '../types';
import { Check, X, Shield, Users } from 'lucide-react';

export function AdminPanel() {
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: pending } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

      const { data: all } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      setPendingUsers(pending || []);
      setAllUsers(all || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const approveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_approved: true })
        .eq('user_id', userId);

      if (error) throw error;
      await fetchUsers();
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const rejectUser = async (userId: string) => {
    try {
      // Delete the user profile and auth user
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      await fetchUsers();
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  const toggleAdmin = async (userId: string, isAdmin: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_admin: !isAdmin })
        .eq('user_id', userId);

      if (error) throw error;
      await fetchUsers();
    } catch (error) {
      console.error('Error updating admin status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Admin Panel</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'pending'
                ? 'bg-navy-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            Pending ({pendingUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-navy-600 text-white'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            All Users ({allUsers.length})
          </button>
        </div>
      </div>

      {activeTab === 'pending' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Pending Approvals
          </h2>
          {pendingUsers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-slate-200">
              <p className="text-slate-600">No pending approvals</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {pendingUsers.map((user) => (
                <div key={user.id} className="bg-white rounded-lg border border-slate-200 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-800">{user.full_name || 'No name provided'}</h3>
                      <p className="text-slate-600">{user.email}</p>
                      <p className="text-sm text-slate-500">
                        Requested: {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => approveUser(user.user_id)}
                        className="flex items-center space-x-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => rejectUser(user.user_id)}
                        className="flex items-center space-x-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'all' && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            All Users
          </h2>
          <div className="grid gap-4">
            {allUsers.map((user) => (
              <div key={user.id} className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-navy-100 rounded-full flex items-center justify-center">
                      <span className="text-navy-600 font-semibold">
                        {(user.full_name || user.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{user.full_name || 'No name provided'}</h3>
                      <p className="text-slate-600">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.is_approved 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {user.is_approved ? 'Approved' : 'Pending'}
                        </span>
                        {user.is_admin && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-navy-100 text-navy-700 flex items-center">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {user.is_approved && (
                    <button
                      onClick={() => toggleAdmin(user.user_id, user.is_admin)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        user.is_admin
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-navy-100 text-navy-700 hover:bg-navy-200'
                      }`}
                    >
                      {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}