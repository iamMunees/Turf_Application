import AddOnCard from './AddOnCard';

const RecommendationEngine = ({ loading, recommendations }) => {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-[320px] animate-pulse rounded-[1.75rem] border border-white/10 bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {recommendations.map((product) => (
        <AddOnCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default RecommendationEngine;
