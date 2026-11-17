import { formatPrice, productImage } from "../utils/format.js";
import { useOrder } from "../context/OrderContext.jsx";

export function ProductCard({ product, index = 0 }) {
  const { addItem } = useOrder();

  return (
    <article className={`food-card ${product.is_open ? "" : "sold-card"}`}>
      <div className="food-card-media">
        <img
          src={productImage(product.image_url)}
          alt={product.name_ar}
          loading={index < 3 ? "eager" : "lazy"}
          decoding="async"
        />
        <span className={`badge ${product.is_open ? "open" : "sold"}`}>{product.status_label}</span>
      </div>
      <div className="food-card-body">
        <div className="food-card-meta">
          <span className="rating-pill">{product.is_open ? "متوفر اليوم" : "خلص"}</span>
          <span className="muted tiny">حلويات بيتية</span>
        </div>
        <h3>{product.name_ar}</h3>
        <p>{product.description}</p>
        <div className="food-card-foot">
          <strong className="price">{formatPrice(product.price)}</strong>
          <button
            className="add-round"
            type="button"
            disabled={!product.is_open}
            aria-label={`أضف ${product.name_ar}`}
            onClick={() => addItem(product, 1)}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}
