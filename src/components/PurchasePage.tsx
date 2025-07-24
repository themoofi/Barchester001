import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react';
import { STRIPE_PRODUCTS } from '../stripe-config';
import { supabase } from '../context/AuthContext';

export function PurchasePage() {
  const navigate = useNavigate();
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handlePurchase = async (productId: string, priceId: string, mode: 'payment' | 'subscription') => {
    setLoadingProductId(productId);
    setError('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Please log in to make a purchase');
        return;
      }

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: priceId,
          mode,
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/purchase`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err: any) {
      console.error('Purchase error:', err);
      setError(err.message || 'Failed to initiate purchase');
    } finally {
      setLoadingProductId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Purchase Supplies</h1>
          <p className="text-slate-600">Support the brotherhood by purchasing event supplies</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {STRIPE_PRODUCTS.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-navy-500 to-navy-600 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{product.name}</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    product.mode === 'subscription' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {product.mode === 'subscription' ? 'Subscription' : 'One-time'}
                  </span>
                </div>
              </div>
              
              <p className="text-slate-600 mb-6 leading-relaxed">
                {product.description}
              </p>
              
              <button
                onClick={() => handlePurchase(product.id, product.priceId, product.mode)}
                disabled={loadingProductId === product.id}
                className="w-full bg-gradient-to-r from-navy-600 to-navy-700 text-white py-3 rounded-lg font-semibold hover:from-navy-700 hover:to-navy-800 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loadingProductId === product.id ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    <span>Purchase Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {STRIPE_PRODUCTS.length === 0 && (
        <div className="text-center py-20">
          <CreditCard className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No Products Available</h3>
          <p className="text-slate-600">Check back later for available supplies and services.</p>
        </div>
      )}
    </div>
  );
}