import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client.js";
import { formatPrice, productImage } from "../../utils/format.js";

export function ProductsAdmin() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.adminProducts().then(setProducts);
  }, []);

  async function remove(id) {
    if (!window.confirm("تحذف المنتج ده؟")) return;
    await api.deleteProduct(id);
    setProducts((current) => current.filter((item) => item.id !== id));
  }

  return (
    <section>
      <div className="admin-toolbar">
        <h1>المنتجات</h1>
        <Link className="btn btn-orange" to="/admin/products/new">
          أضف منتج جديد
        </Link>
      </div>
      {products.map((product) => (
        <div className="today-row" key={product.id}>
          <img src={productImage(product.image_url)} alt="" />
          <div>
            <strong>{product.name_ar}</strong>
            <div className="muted">
              {product.category_name} • {formatPrice(product.price)}
            </div>
          </div>
          <span>{product.status_label}</span>
          <span>كمية {product.quantity}</span>
          <Link className="btn btn-ghost" to={`/admin/products/${product.id}`}>
            تعديل
          </Link>
          <button className="btn btn-ghost" type="button" onClick={() => remove(product.id)}>
            حذف
          </button>
        </div>
      ))}
    </section>
  );
}
