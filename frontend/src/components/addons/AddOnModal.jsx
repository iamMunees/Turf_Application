import { Link } from 'react-router-dom';
import CartIcon from './CartIcon';
import RecommendationEngine from './RecommendationEngine';
import { useAddOns } from '../../context/AddOnsContext';

const AddOnModal = () => {
  const {
    cart,
    recommendations,
    isModalOpen,
    isRecommendationsLoading,
    closeRecommendations,
  } = useAddOns();

  if (!isModalOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 px-4 py-4 backdrop-blur">
      <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5 md:p-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/75">Fuel Up for Your Game!</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">We recommend these to keep you energized and focused</h2>
          </div>
          <button type="button" onClick={closeRecommendations} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">
            Close
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 md:px-6">
          <CartIcon />
          <div className="flex gap-3">
            <Link to="/dashboard/cart" onClick={closeRecommendations} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">
              View Cart
            </Link>
            <button type="button" onClick={closeRecommendations} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">
              Skip for Now
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto px-5 pb-6 md:px-6">
          <RecommendationEngine loading={isRecommendationsLoading} recommendations={recommendations} />
        </div>

        <div className="border-t border-white/10 px-5 py-4 text-sm text-slate-300 md:px-6">
          Cart summary: {cart.total_items} items | {cart.total_price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
        </div>
      </div>
    </div>
  );
};

export default AddOnModal;
