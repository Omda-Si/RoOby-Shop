import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BottomNav } from "../components/BottomNav.jsx";
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

const CATEGORY_ICONS = {
  cake: "🎂",
  cookies: "🍪",
  oriental: "🍬",
  dates: "🌴",
  cheesecake: "🍰",
  chocolate: "🍫"
};

export function Home() {
  const { data, error, loading, refresh } = useCatalog();
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");
  const { notice, count } = useOrder();
  const categories = data?.categories || [];

  const filtered = useMemo(() => {
    const list = data?.today || [];
    const query = search.trim().toLowerCase();
    return list.filter((product) => {
      const matchCategory = active === "all" || product.category_slug === active;
      const matchSearch =
        !query ||
        product.name_ar?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query);
      return matchCategory && matchSearch;
    });
  }, [data, active, search]);

  return (
    <div className={`app-shell foodcort-shell ${count ? "has-tray" : ""}`}>
      <Header shopName={data?.settings?.shop_name} search={search} onSearch={setSearch} />
      {notice ? <div className="notice">{notice}</div> : null}
      <Hero
        settings={data?.settings}
        featured={data?.featured}
        dailyNews={data?.settings?.daily_news}
      />
      <ShopNotices settings={data?.settings} />

      <section className="section container" id="categories">
        <div className="section-head">
          <h2>التصنيفات</h2>
        </div>
        <div className="category-scroll">
          <button
            className={`category-chip ${active === "all" ? "active" : ""}`}
            onClick={() => setActive("all")}
            type="button"
          >
            <span className="category-icon">✦</span>
            الكل
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`category-chip ${active === category.slug ? "active" : ""}`}
              onClick={() => setActive(category.slug)}
              type="button"
            >
              <span className="category-icon">{CATEGORY_ICONS[category.slug] || "🧁"}</span>
              {category.name_ar}
            </button>
          ))}
        </div>
      </section>

      <section className="section container" id="today">
        <div className="section-head">
          <div>
            <h2>العروض الساخنة اليوم</h2>
            <p className="muted">
              {data?.settings?.availability_updated_at
                ? `اتحدثت القائمة الساعة ${formatArabicTime(data.settings.availability_updated_at)}`
                : "قائمة اليوم جاهزة للطلب عبر واتساب"}
            </p>
          </div>
          <Link className="see-all" to="/order">
            طلبي
          </Link>
        </div>
        {error && !data ? <p className="muted">{error}</p> : null}
        <ProductGrid products={filtered} loading={loading && !data} />
      </section>

      <section className="section container browse-cats">
        <div className="section-head">
          <h2>تصفح كل التصنيفات</h2>
        </div>
        <div className="categories-row">
          {categories.map((category) => (
            <Link key={category.id} className="category-tile" to={`/category/${category.slug}`}>
              <span className="category-icon">{CATEGORY_ICONS[category.slug] || "🧁"}</span>
              {category.name_ar}
            </Link>
          ))}
        </div>
      </section>

      <FeedbackSection feedbacks={data?.feedbacks || []} onSubmitted={refresh} />
      <OrderTray />
      <Footer settings={data?.settings} />
      <BottomNav />
    </div>
  );
}
