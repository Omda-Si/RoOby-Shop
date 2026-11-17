import { ProductCard } from "./ProductCard.jsx";

export function ProductGrid({ products, loading = false }) {
  if (loading) {
    return (
      <div className="food-grid" aria-busy="true">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="product-skeleton" key={index} />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return <div className="empty">ما في منتجات ظاهرة في القائمة دي الآن.</div>;
  }

  return (
    <div className="food-grid">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
