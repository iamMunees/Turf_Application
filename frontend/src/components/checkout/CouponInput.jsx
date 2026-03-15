import { useState } from 'react';
import { useAddOns } from '../../context/AddOnsContext';

const CouponInput = () => {
  const { appliedCoupon, couponError, applyCoupon, clearCoupon } = useAddOns();
  const [value, setValue] = useState(appliedCoupon?.code || '');

  const handleApply = () => {
    applyCoupon(value);
  };

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
      <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/75">Coupon</p>
      <div className="mt-4 flex gap-3">
        <input
          className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
          placeholder="Enter promo code"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button type="button" onClick={handleApply} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950">
          Apply
        </button>
      </div>
      {appliedCoupon ? (
        <div className="mt-3 flex items-center justify-between text-sm text-emerald-200">
          <span>{appliedCoupon.code} applied</span>
          <button type="button" onClick={clearCoupon}>
            Remove coupon
          </button>
        </div>
      ) : null}
      {couponError ? <p className="mt-3 text-sm text-rose-200">{couponError}</p> : null}
    </section>
  );
};

export default CouponInput;
