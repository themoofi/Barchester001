import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowLeft, CreditCard, Calendar } from 'lucide-react';

export function SuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate processing time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Processing Your Purchase</h2>
          <p className="text-slate-600">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-emerald-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-slate-600 mb-8 leading-relaxed">
            Jazakallahu khair! Your purchase has been completed successfully. 
            Your contribution helps strengthen our brotherhood community.
          </p>

          {sessionId && (
            <div className="bg-slate-50 rounded-lg p-4 mb-8">
              <p className="text-sm text-slate-500 mb-1">Transaction ID</p>
              <p className="text-sm font-mono text-slate-700 break-all">{sessionId}</p>
            </div>
          )}

          <div className="space-y-4">
            <Link
              to="/dashboard"
              className="w-full bg-gradient-to-r from-navy-600 to-navy-700 text-white py-3 rounded-lg font-semibold hover:from-navy-700 hover:to-navy-800 transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Dashboard</span>
            </Link>
            
            <Link
              to="/purchase"
              className="w-full border border-slate-300 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2"
            >
              <CreditCard className="h-4 w-4" />
              <span>Make Another Purchase</span>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Questions about your purchase? Contact the brotherhood administrators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}