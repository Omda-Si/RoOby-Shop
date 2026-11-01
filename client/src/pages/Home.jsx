import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FeedbackSection } from "../components/FeedbackSection.jsx";
import { Footer } from "../components/Footer.jsx";
import { Header } from "../components/Header.jsx";
import { Hero } from "../components/Hero.jsx";
import { OrderTray } from "../components/OrderTray.jsx";
import { ProductGrid } from "../components/ProductGrid.jsx";
import { ShopNotices } from "../components/ShopNotices.jsx";
import { useOrder } from "../context/OrderContext.jsx";
import { useCatalog } from "../hooks/useCatalog.js";
import { formatArabicTime } from "../utils/format.js";

export function Home() {
  const { data, error, loading, refresh } = useCatalog();
  const [active, setActive] = useState("all");
  const { notice, count } = useOrder();
  const categories = data?.categories || [];

  const filtered = useMemo(() => {
    const list = data?.today || [];
    if (active === "all") return list;
    return list.filter((product) => product.category_slug === active);
  }, [data, active]);

  return (
    <div className={`app-shell ${count ? "has-tray" : ""}`}>
      <Header shopName={data?.settings?.shop_name} />
      {notice ? <div className="notice">{notice}</div> : null}
      <Hero settings={data?.settings} featured={data?.featured} />
      <ShopNotices settings={data?.settings} />

      <section className="section container" id="today">
        <div className="section-head">
          <div>
            <h2>شنو المتوفر اليوم؟</h2>
            <p className="muted">
              {data?.settings?.availability_updated_at
                ? `اتحدثت القائمة الساعة ${formatArabicTime(data.settings.availability_updated_at)}`
                : "قائمة اليوم جاهزة للطلب عبر واتساب"}
            </p>
          </div>
        </div>
        {data?.settings?.daily_news ? (
          <aside className="today-news">
            <strong>خبر اليوم</strong>
            <p>{data.settings.daily_news}</p>
          </aside>
        ) : null}
        {error && !data ? <p className="muted">{error}</p> : null}
        <div className="pills">
          <button className={`pill ${active === "all" ? "active" : ""}`} onClick={() => setActive("all")}>
            الكل
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`pill ${active === category.slug ? "active" : ""}`}
              onClick={() => setActive(category.slug)}
            >
              {category.name_ar}
            </button>
          ))}
        </div>
        <ProductGrid products={filtered} loading={loading && !data} />
      </section>

      <section className="section container" id="categories">
        <div className="section-head">
          <h2>التصنيفات</h2>
        </div>
        <div className="categories-row">
          {categories.map((category) => (
            <Link key={category.id} className="category-tile" to={`/category/${category.slug}`}>
              {category.name_ar}
            </Link>
          ))}
        </div>
      </section>
      <FeedbackSection feedbacks={data?.feedbacks || []} onSubmitted={refresh} />
      <OrderTray />
      <Footer settings={data?.settings} />
    </div>
  );
}
