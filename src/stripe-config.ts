export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
}

export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    id: 'prod_SjnDuBut536HjC',
    priceId: 'price_1RoJchRnZtvMGvfNpOAo3JfQ',
    name: 'BBQ',
    description: 'Food supplies for the upcoming BBQ',
    mode: 'payment'
  }
];

export function getProductById(id: string): StripeProduct | undefined {
  return STRIPE_PRODUCTS.find(product => product.id === id);
}

export function getProductByPriceId(priceId: string): StripeProduct | undefined {
  return STRIPE_PRODUCTS.find(product => product.priceId === priceId);
}