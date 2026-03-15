import { Link } from 'react-router-dom';
import { useAddOns } from '../../context/AddOnsContext';

const CartIcon = () => {
  const { cart } = useAddOns();

  return (
    <Link
      to="/dashboard/cart"
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
    >
      <span>Cart</span>
      <span className="rounded-full bg-cyan-300 px-2 py-0.5 text-xs font-semibold text-slate-950">
        {cart.total_items} items
      </span>
    </Link>
  );
};

export default CartIcon;
