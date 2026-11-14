import React from 'react';
import { CheckCircle, Calendar, Clock, Mail, Home } from 'lucide-react';
import { NEXT_SESSION_DATE, LOGO_URL, CONTACT_EMAIL } from '../constants';

/**
 * Post-purchase page. The Stripe Payment Link redirects here after payment:
 *   https://toyl-mm.netlify.app/thank-you?session_id={CHECKOUT_SESSION_ID}
 * Stripe fills in the session id, which we use to send one GA4 `purchase` event per order.
 */
export function trackPurchase(search: string, storage: Pick<Storage, 'getItem' | 'setItem'> | null) {
  const sessionId = new URLSearchParams(search).get('session_id');
  // Only count real redirects from Stripe (and ignore the literal placeholder if it wasn't substituted).
  if (!sessionId || sessionId.includes('CHECKOUT_SESSION_ID')) return false;

  const key = `toyl_purchase_${sessionId}`;
  try {
    if (storage?.getItem(key)) return false; // already counted (page refresh)
    storage?.setItem(key, '1');
  } catch {
    // storage blocked: still send the event once for this page view
  }

  (window.dataLayer = window.dataLayer || []).push({
    event: 'purchase',
    transaction_id: sessionId,
    value: 27,
    currency: 'CAD',
    items: [{ item_name: 'TOYL 20-20 Mobility Program', price: 27, quantity: 1 }],
  });
  return true;
}

const ThankYou: React.FC = () => {
  React.useEffect(() => {
    document.title = "You're in! | TOYL Yoga";
    // Keep this page out of search results.
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex';
    document.head.appendChild(robots);

    let storage: Storage | null = null;
    try { storage = window.sessionStorage; } catch { /* blocked */ }
    trackPurchase(window.location.search, storage);

    return () => { robots.remove(); };
  }, []);

  const steps = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Watch your inbox',
      text: "We'll email your class links and joining details before the session starts. If you don't see it, check your spam or promotions folder.",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Pick your live class time',
      text: 'Two live classes every weekday: 7:00am and 8:00pm EST. Join either one (or both). Every class is also available on demand.',
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: 'Get ready',
      text: "All you need is enough floor space to lie down. A mat helps but isn't required, and comfortable clothes are perfect.",
    },
  ];

  return (
    <div className="min-h-screen bg-viridian-soft">
      <nav className="bg-white/80 border-b border-viridian/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
          <a href="/" className="flex items-center gap-3">
            <img src={LOGO_URL} alt="TOYL Yoga Logo" className="w-12 h-12 object-contain" referrerPolicy="no-referrer" />
            <span className="font-serif font-bold text-xl tracking-tight text-viridian-dark">TOYL YOGA</span>
          </a>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center space-y-6 mb-14">
          <CheckCircle className="w-16 h-16 text-viridian mx-auto" aria-hidden="true" />
          <h1 className="text-5xl md:text-6xl font-serif text-viridian-dark">You're in!</h1>
          <p className="text-xl text-[#576574] leading-relaxed">
            Thank you for reserving your spot in the 20-20 Mobility Program.
          </p>
          <div className="inline-block px-5 py-2 rounded-full bg-viridian/10 text-viridian font-bold">
            Your session starts {NEXT_SESSION_DATE}
          </div>
        </div>

        <h2 className="text-2xl font-serif text-viridian-dark mb-6 text-center">What happens next</h2>
        <ol className="space-y-5">
          {steps.map((step, i) => (
            <li key={i} className="bg-white p-6 rounded-3xl border border-viridian/5 shadow-sm flex gap-5">
              <div className="w-12 h-12 shrink-0 bg-viridian/10 rounded-2xl flex items-center justify-center text-viridian">
                {step.icon}
              </div>
              <div>
                <h3 className="text-lg font-serif text-viridian-dark font-bold mb-1">{i + 1}. {step.title}</h3>
                <p className="text-[#576574] leading-relaxed">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="text-center mt-14 space-y-6">
          <p className="text-[#576574]">
            Questions? Email <a href={`mailto:${CONTACT_EMAIL}`} className="text-viridian font-medium underline underline-offset-4">{CONTACT_EMAIL}</a>. We reply within 24 hours.
          </p>
          <a href="/" className="inline-flex items-center gap-2 text-viridian font-medium hover:text-viridian-dark">
            <Home className="w-4 h-4" aria-hidden="true" /> Back to the TOYL Yoga home page
          </a>
        </div>
      </main>
    </div>
  );
};

export default ThankYou;
