import React, { useState, useEffect } from 'react';
import { supabase } from '../context/AuthContext';
import { getProductByPriceId } from '../stripe-config';
import { Crown } from 'lucide-react';

interface SubscriptionData {
  subscription_status: string;
  price_id: string | null;
}

export function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('subscription_status, price_id')
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse bg-navy-800 rounded-full px-3 py-1">
        <div className="h-4 w-16 bg-navy-700 rounded"></div>
      </div>
    );
  }

  if (!subscription || !subscription.price_id) {
    return null;
  }

  const product = getProductByPriceId(subscription.price_id);
  const isActive = subscription.subscription_status === 'active';

  if (!product || !isActive) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 bg-gold-400 text-navy-900 px-3 py-1 rounded-full">
      <Crown className="h-4 w-4" />
      <span className="text-sm font-semibold">{product.name}</span>
    </div>
  );
}