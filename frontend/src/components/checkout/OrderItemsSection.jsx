import { Link } from 'react-router-dom';
import { useAddOns } from '../../context/AddOnsContext';
import { formatCurrency, formatDateLabel } from '../../lib/arenaxApi';

const OrderItemsSection = () => {
  const {
    cart,
    latestBooking,
    changeCartQuantity,
    removeFromCart,
    registerLatestBooking,
  } = useAddOns();

  const clearBooking = () => {
    registerLatestBooking(null);
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/75">Turf Booking</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              {latestBooking?.venueName || 'No turf booking selected'}
            </h2>
          </div>
          <div className="flex gap-3">
            {latestBooking ? (
              <>
                <Link
                  to={`/dashboard/slot-booking?venueId=${latestBooking.venueId}&date=${latestBooking.slotDate}`}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm text-white"
                >
                  Edit
                </Link>
                <button type="button" onClick={clearBooking} className="rounded-full border border-rose-300/20 px-4 py-2 text-sm text-rose-100">
                  Remove
                </button>
              </>
            ) : null}
          </div>
        </div>

        {latestBooking ? (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] bg-white/5 p-4">
              <p className="text-sm text-slate-300">
                {latestBooking.sportType} | {latestBooking.level}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {formatDateLabel(latestBooking.slotDate)} | {latestBooking.timeLabel}
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Duration {(latestBooking.durationMinutes || 60) / 60} hour
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-white/5 p-4">
              <p className="text-sm text-slate-400">Turf price</p>
              <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(latestBooking.pricePerHour)}</p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-300">Go back to slot booking to add a turf reservation.</p>
        )}
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/75">Add-On Items</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Food & hydration</h2>
          </div>
          <Link to="/dashboard/cart" className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">
            Continue Shopping
          </Link>
        </div>

        <div className="mt-5 space-y-4">
          {cart.items.length === 0 ? (
            <p className="rounded-[1.5rem] border border-dashed border-white/10 p-6 text-sm text-slate-300">
              No add-on items in cart.
            </p>
          ) : (
            cart.items.map((item) => (
              <article key={item.id} className="flex flex-col gap-4 rounded-[1.5rem] border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <img alt={item.name} className="h-20 w-20 rounded-[1.25rem] object-cover" src={item.image_url} />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.name}</h3>
                    <p className="mt-1 text-sm text-slate-300">{item.brand}</p>
                    <p className="mt-2 text-sm text-slate-300">
                      {formatCurrency(item.price)} each
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/60 px-3 py-2">
                    <button type="button" onClick={() => changeCartQuantity(item.id, Math.max(1, item.quantity - 1))} className="text-white">
                      -
                    </button>
                    <span className="min-w-6 text-center text-sm text-white">{item.quantity}</span>
                    <button type="button" onClick={() => changeCartQuantity(item.id, item.quantity + 1)} className="text-white">
                      +
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Item total</p>
                    <p className="text-lg font-semibold text-white">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                  <button type="button" onClick={() => removeFromCart(item.id)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">
                    Remove
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default OrderItemsSection;
