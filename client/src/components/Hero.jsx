import { formatArabicDate, formatPrice, productImage } from "../utils/format.js";

export function Hero({ settings, featured, dailyNews }) {
  const spotlight = featured?.[0];

  return (
    <section className="hero container">
      <div className="promo-banner">
        <div>
          <span className="promo-chip">عرض اليوم • {formatArabicDate()}</span>
          <h1>{settings?.tagline || "حلو يومك يبدأ من هنا!"}</h1>
          <p>
            {dailyNews ||
              "حلويات بيتية تطلبها أونلاين. شوف المتوفر، اختَر الكمية، واطلب عبر واتساب."}
          </p>
          <div className="hero-actions">
            <a className="btn btn-orange" href="#today">
              شوف المتوفر
            </a>
            <a className="btn btn-ghost" href="#special">
              طلب خاص
            </a>
          </div>
        </div>
        <div className="promo-visual">
          <img
            className="hero-photo"
            src={productImage(spotlight?.image_url)}
            alt={spotlight?.name_ar || "منتج اليوم"}
            fetchPriority="high"
            decoding="async"
          />
          {spotlight ? (
            <div className="promo-price">
              <strong>{spotlight.name_ar}</strong>
              <span>{formatPrice(spotlight.price)}</span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
