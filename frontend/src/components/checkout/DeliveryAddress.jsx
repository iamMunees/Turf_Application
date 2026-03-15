import { useState } from 'react';
import { useAddOns } from '../../context/AddOnsContext';

const emptyAddress = {
  label: 'New Address',
  name: '',
  phone: '',
  street: '',
  city: '',
  pincode: '',
  isDefault: false,
};

const DeliveryAddress = () => {
  const { savedAddresses, selectedAddressId, setSelectedAddressId, addAddress } = useAddOns();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyAddress);

  const handleSubmit = (event) => {
    event.preventDefault();
    addAddress(form);
    setForm(emptyAddress);
    setShowForm(false);
  };

  return (
    <section className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-200/75">Delivery Address</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Food delivery destination</h2>
        </div>
        <button type="button" onClick={() => setShowForm((current) => !current)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white">
          Add New Address
        </button>
      </div>

      <select
        className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
        value={selectedAddressId}
        onChange={(event) => setSelectedAddressId(event.target.value)}
      >
        {savedAddresses.map((address) => (
          <option key={address.id} value={address.id}>
            {address.label} - {address.street}, {address.city}
          </option>
        ))}
      </select>

      {showForm ? (
        <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" placeholder="Name" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
          <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" placeholder="Phone" value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
          <input className="sm:col-span-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" placeholder="Street" value={form.street} onChange={(event) => setForm((current) => ({ ...current, street: event.target.value }))} />
          <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" placeholder="City" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} />
          <input className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white" placeholder="Pincode" value={form.pincode} onChange={(event) => setForm((current) => ({ ...current, pincode: event.target.value }))} />
          <label className="sm:col-span-2 flex items-center gap-3 text-sm text-white">
            <input type="checkbox" className="accent-cyan-300" checked={form.isDefault} onChange={(event) => setForm((current) => ({ ...current, isDefault: event.target.checked }))} />
            Set as Default
          </label>
          <button type="submit" className="sm:col-span-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-950">
            Save Address
          </button>
        </form>
      ) : null}
    </section>
  );
};

export default DeliveryAddress;
