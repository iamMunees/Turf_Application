import { formatCurrency } from '../../lib/arenaxApi';
import { useAddOns } from '../../context/AddOnsContext';

const buildTagline = (product) => {
  if (product.tags.includes('Cricket')) {
    return 'Popular with Cricket Players';
  }
  if (product.tags.includes('Evening')) {
    return 'Best for Evening Sessions';
  }
  if (product.tags.includes('Morning')) {
    return 'Great for Morning Warmups';
  }
  return 'Recommended for your booking';
};

const AddOnCard = ({ product }) => {
  const { addToCart, removeFromCart } = useAddOns();

  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/70">
      <img alt={product.name} className="h-40 w-full object-cover" src={product.image_url} />
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-white">{product.name}</h3>
            <p className="text-sm text-slate-300">{product.brand}</p>
          </div>
          <span className="text-sm font-semibold text-amber-100">⭐ {product.rating}</span>
        </div>
        <p className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-cyan-100">
          {buildTagline(product)}
        </p>
        <div className="flex items-center justify-between text-sm text-slate-300">
          <span>{formatCurrency(product.price)}</span>
          <span>{product.popularity_score} orders</span>
        </div>
        <button
          type="button"
          onClick={() => (product.is_added ? removeFromCart(product.id) : addToCart(product.id))}
          className={`w-full rounded-full px-4 py-2 text-sm font-semibold ${
            product.is_added ? 'border border-white/10 bg-white/5 text-white' : 'bg-white text-slate-950'
          }`}
        >
          {product.is_added ? 'Added' : 'Add to Cart'}
        </button>
      </div>
    </article>
  );
};

export default AddOnCard;
