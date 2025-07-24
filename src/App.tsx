import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { Dashboard } from './components/Dashboard';
import { CreatePlanPage } from './components/CreatePlanPage';
import { PurchasePage } from './components/PurchasePage';
import { SuccessPage } from './components/SuccessPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-plan"
              element={
                <ProtectedRoute>
                  <CreatePlanPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/purchase"
              element={
                <ProtectedRoute>
                  <PurchasePage />
                </ProtectedRoute>
              }
            />
            <Route path="/success" element={<SuccessPage />} />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Events Page</h2>
                    <p className="text-slate-600">Coming soon...</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div className="text-center py-20">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Profile Settings</h2>
                    <p className="text-slate-600">Coming soon...</p>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;