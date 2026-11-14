import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import ThankYou, { trackPurchase } from '../components/ThankYou';
import { NEXT_SESSION_DATE } from '../constants';

function memoryStorage() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
}

describe('ThankYou page', () => {
  beforeEach(() => {
    window.dataLayer = [];
  });

  it('shows the confirmation, start date and next steps', () => {
    render(<ThankYou />);
    expect(screen.getByRole('heading', { name: /you're in/i })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`starts ${NEXT_SESSION_DATE}`, 'i'))).toBeInTheDocument();
    expect(screen.getByText(/watch your inbox/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to the toyl yoga home page/i })).toHaveAttribute('href', '/');
  });

  it('sends one purchase event per Stripe session', () => {
    const storage = memoryStorage();
    expect(trackPurchase('?session_id=cs_live_123', storage)).toBe(true);
    expect(trackPurchase('?session_id=cs_live_123', storage)).toBe(false); // refresh
    const purchases = window.dataLayer.filter((e) => e.event === 'purchase');
    expect(purchases).toHaveLength(1);
    expect(purchases[0]).toMatchObject({ transaction_id: 'cs_live_123', value: 27, currency: 'CAD' });
  });

  it('labels Stripe test-mode orders as test_purchase, never purchase', () => {
    expect(trackPurchase('?session_id=cs_test_abc', memoryStorage())).toBe(true);
    expect(window.dataLayer.filter((e) => e.event === 'purchase')).toHaveLength(0);
    expect(window.dataLayer.filter((e) => e.event === 'test_purchase')).toHaveLength(1);
  });

  it('does not send a purchase event without a real session id', () => {
    const storage = memoryStorage();
    expect(trackPurchase('', storage)).toBe(false);
    expect(trackPurchase('?session_id={CHECKOUT_SESSION_ID}', storage)).toBe(false);
    expect(window.dataLayer.filter((e) => e.event === 'purchase')).toHaveLength(0);
  });
});
