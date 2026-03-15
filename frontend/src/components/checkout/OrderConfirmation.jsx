import { Link } from 'react-router-dom';
import { useAddOns } from '../../context/AddOnsContext';

const OrderConfirmation = () => {
  const {
    checkoutStep,
    setCheckoutStep,
    termsAccepted,
    setTermsAccepted,
    placingOrder,
    placeOrder,
  } = useAddOns();

  if (checkoutStep === 4) {
    return (
      <section className="rounded-[2rem] border border-emerald-300/20 bg-emerald-300/10 p-6">
        <p className="text-[11px] uppercase tracking-[0.3em] text-emerald-100/75">Confirmation</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Order placed successfully</h2>
        <p className="mt-3 text-sm text-emerald-50/90">
          Your turf booking, add-ons, and payment are confirmed.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
      <label className="flex items-start gap-3 text-sm text-white">
        <input type="checkbox" className="mt-1 accent-cyan-300" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} />
        I agree to the terms and conditions
      </label>
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={!termsAccepted || placingOrder}
          onClick={() => placeOrder()}
          className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 disabled:opacity-60"
        >
          {placingOrder ? 'Processing...' : 'Place Order'}
        </button>
        <Link to="/dashboard/cart" className="rounded-full border border-white/10 px-5 py-3 text-sm text-white">
          Continue Shopping
        </Link>
        {checkoutStep < 3 ? (
          <button type="button" onClick={() => setCheckoutStep(3)} className="rounded-full border border-white/10 px-5 py-3 text-sm text-white">
            Review Payment
          </button>
        ) : null}
      </div>
    </section>
  );
};

export default OrderConfirmation;
