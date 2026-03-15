import { formatCurrency } from '../../lib/arenaxApi';
import { useAddOns } from '../../context/AddOnsContext';

const PriceBreakdown = () => {
  const { totals } = useAddOns();

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
      <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/75">Price Breakdown</p>
      <div className="mt-5 space-y-3 text-sm text-slate-300">
        <div className="flex items-center justify-between">
          <span>Turf Booking</span>
          <span>{formatCurrency(totals.bookingPrice)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Add-On Items Subtotal</span>
          <span>{formatCurrency(totals.addOnSubtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(totals.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Taxes (GST 18%)</span>
          <span>{formatCurrency(totals.gst)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Delivery Charges</span>
          <span>{formatCurrency(totals.deliveryCharge)}</span>
        </div>
        <div className="flex items-center justify-between text-emerald-200">
          <span>Discount</span>
          <span>-{formatCurrency(totals.discount)}</span>
        </div>
      </div>
      <div className="mt-5 rounded-[1.5rem] bg-white px-4 py-4 text-slate-950">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">TOTAL AMOUNT</span>
          <span className="text-2xl font-bold">{formatCurrency(totals.totalAmount)}</span>
        </div>
      </div>
    </section>
  );
};

export default PriceBreakdown;
