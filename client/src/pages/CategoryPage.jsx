import { Link, useParams } from "react-router-dom";
import { Footer } from "../components/Footer.jsx";
import { Header } from "../components/Header.jsx";
import { OrderTray } from "../components/OrderTray.jsx";
import { ProductGrid } from "../components/ProductGrid.jsx";
import { useOrder } from "../context/OrderContext.jsx";
import { useCatalog } from "../hooks/useCatalog.js";

export function CategoryPage() {
  const { slug } = useParams();
  const { data, loading } = useCatalog();
  const { notice, count } = useOrder();
  const category = data?.categories?.find((item) => item.slug === slug);
  const products = (data?.products || []).filter((item) => item.category_slug === slug);

  return (
    <div className={`app-shell ${count ? "has-tray" : ""}`}>
      <Header shopName={data?.settings?.shop_name} />
      {notice ? <div className="notice">{notice}</div> : null}
      <section className="section container">
        <Link to="/" className="muted">
          رجوع للمتجر
        </Link>
        <div className="section-head">
          <h2>{category?.name_ar || (data ? "التصنيف" : "جاري التحميل...")}</h2>
        </div>
        <ProductGrid products={products} loading={loading && !data} />
      </section>
      <OrderTray />
      <Footer settings={data?.settings} />
    </div>
  );
}
