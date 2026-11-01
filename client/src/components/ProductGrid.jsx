import { ProductCard } from "./ProductCard.jsx";

export function ProductGrid({ products }) {
  if (!products?.length) {
    return <div className="empty">ما في منتجات ظاهرة في القائمة دي الآن.</div>;
  }

  return (
    <div className="product-mosaic">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
