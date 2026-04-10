import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAddOns } from '../context/AddOnsContext';
import { formatCurrency } from '../lib/arenaxApi';

const CartPage = () => {
  const { cart, isCartLoading, loadCart, removeFromCart } = useAddOns();

  useEffect(() => {
    loadCart().catch(() => undefined);
  }, [loadCart]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_24%),linear-gradient(180deg,_#020617,_#091221_38%,_#020617)] px-4 py-6 text-white md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
          <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-200/80">Cart</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Your add-ons</h1>
        </section>

        {isCartLoading ? (
          <div className="h-56 animate-pulse rounded-[2rem] border border-white/10 bg-white/5" />
        ) : (
          <section className="space-y-4">
            {cart.items.length === 0 ? (
              <div className="rounded-[2rem] border border-dashed border-white/15 bg-slate-950/40 p-10 text-center text-slate-300">
                Your cart is empty.
              </div>
            ) : (
              cart.items.map((item) => (
                <article key={item.id} className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-slate-950/60 p-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <img alt={item.name} className="h-20 w-20 rounded-[1.25rem] object-cover" src={item.image_url} />
                    <div>
                      <h2 className="text-xl font-semibold text-white">{item.name}</h2>
                      <p className="mt-1 text-sm text-slate-300">{item.brand}</p>
                      <p className="mt-2 text-sm text-slate-300">
                        {item.quantity} x {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>
                  <button type="button" onClick={() => removeFromCart(item.id)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">
                    Remove
                  </button>
                </article>
              ))
            )}
          </section>
        )}

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
          <div className="flex items-center justify-between text-lg font-semibold text-white">
            <span>Total</span>
            <span>{formatCurrency(cart.total_price)}</span>
          </div>
          <div className="mt-4">
            <Link to="/dashboard/checkout" className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950">
              Proceed to Checkout
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CartPage;
