import { useAddOns } from '../../context/AddOnsContext';

const methods = ['Credit/Debit Card', 'UPI', 'Net Banking', 'Wallet', 'Cash on Delivery'];

const PaymentOptions = () => {
  const { paymentMethod, setPaymentMethod } = useAddOns();

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
      <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/75">Payment Options</p>
      <div className="mt-4 space-y-3">
        {methods.map((method) => (
          <label key={method} className="flex items-center gap-3 rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">
            <input
              checked={paymentMethod === method}
              type="radio"
              name="paymentMethod"
              className="accent-cyan-300"
              onChange={() => setPaymentMethod(method)}
            />
            {method}
          </label>
        ))}
      </div>
    </section>
  );
};

export default PaymentOptions;
