import { useState } from "react";
import { formatPrice, productImage } from "../utils/format.js";
import { useOrder } from "../context/OrderContext.jsx";
import { QuantityStepper } from "./QuantityStepper.jsx";

export function ProductCard({ product, index = 0 }) {
  const { addItem } = useOrder();
  const [qty, setQty] = useState(1);
  const variant = product.layout_variant || "standard";

  return (
    <article
      className={`product-card ${variant} ${product.is_open ? "" : "sold-card"}`}
      style={{ "--stagger": index }}
    >
      <div className="product-media">
        <img
          src={productImage(product.image_url)}
          alt={product.name_ar}
          loading={index < 3 ? "eager" : "lazy"}
          decoding="async"
        />
        <span className={`badge ${product.is_open ? "open" : "sold"}`}>{product.status_label}</span>
      </div>
      <div className="product-body">
        <h3>{product.name_ar}</h3>
        <p>{product.description}</p>
        <div className="price">{formatPrice(product.price)}</div>
        <div className="card-actions">
          <QuantityStepper value={qty} max={Math.max(1, product.quantity)} onChange={setQty} />
          <button
            className="btn btn-orange"
            type="button"
            disabled={!product.is_open}
            onClick={() => addItem(product, qty)}
          >
            أضف للطلب
          </button>
        </div>
      </div>
    </article>
  );
}
