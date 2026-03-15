import OrderConfirmation from '../components/checkout/OrderConfirmation';
import OrderItemsSection from '../components/checkout/OrderItemsSection';
import CouponInput from '../components/checkout/CouponInput';
import DeliveryAddress from '../components/checkout/DeliveryAddress';
import PaymentForm from '../components/checkout/PaymentForm';
import PaymentOptions from '../components/checkout/PaymentOptions';
import PriceBreakdown from '../components/checkout/PriceBreakdown';
import { useAddOns } from '../context/AddOnsContext';

const steps = ['Cart', 'Review', 'Payment', 'Confirmation'];

const CheckoutPage = () => {
  const { checkoutStep } = useAddOns();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.14),_transparent_28%),linear-gradient(180deg,_#020617,_#091221_38%,_#020617)] px-4 py-6 text-white md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
          <p className="text-[11px] uppercase tracking-[0.32em] text-cyan-200/80">Order Summary</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center gap-3">
                <div className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold ${checkoutStep >= index + 1 ? 'bg-white text-slate-950' : 'bg-white/5 text-slate-200'}`}>
                  {index + 1}
                </div>
                <span className="text-sm text-white">{step}</span>
                {index < steps.length - 1 ? <div className="h-px w-12 bg-white/10" /> : null}
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <OrderItemsSection />
          <div className="space-y-6">
            <PriceBreakdown />
            <CouponInput />
            <PaymentOptions />
            <PaymentForm />
            <DeliveryAddress />
            <OrderConfirmation />
          </div>
        </section>
      </div>
    </main>
  );
};

export default CheckoutPage;
