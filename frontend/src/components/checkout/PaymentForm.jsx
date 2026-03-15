import { useAddOns } from '../../context/AddOnsContext';

const PaymentForm = () => {
  const { paymentDetails, paymentMethod, setPaymentDetails } = useAddOns();

  if (paymentMethod !== 'Credit/Debit Card') {
    return null;
  }

  const updateField = (field, value) => {
    setPaymentDetails((current) => ({ ...current, [field]: value }));
  };

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
      <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/75">Card Details</p>
      <div className="mt-4 grid gap-4">
        <input
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
          placeholder="Card number"
          value={paymentDetails.cardNumber}
          onChange={(event) => updateField('cardNumber', event.target.value)}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            placeholder="MM/YY"
            value={paymentDetails.expiry}
            onChange={(event) => updateField('expiry', event.target.value)}
          />
          <input
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
            placeholder="CVV"
            value={paymentDetails.cvv}
            onChange={(event) => updateField('cvv', event.target.value)}
          />
        </div>
        <input
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
          placeholder="Cardholder name"
          value={paymentDetails.cardholder}
          onChange={(event) => updateField('cardholder', event.target.value)}
        />
        <select
          className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
          value={paymentDetails.billingAddress}
          onChange={(event) => updateField('billingAddress', event.target.value)}
        >
          <option value="same">Billing address same as profile</option>
          <option value="different">Use different billing address</option>
        </select>
      </div>
    </section>
  );
};

export default PaymentForm;
