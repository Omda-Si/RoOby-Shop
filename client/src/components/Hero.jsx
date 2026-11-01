import { formatArabicDate, formatPrice, productImage } from "../utils/format.js";

export function Hero({ settings, featured }) {
  const spotlight = featured?.[0];

  return (
    <section className="hero container">
      <div>
        <div className="eyebrow live-pill">
          <span className="live-dot" />
          متجر أونلاين • {formatArabicDate()}
        </div>
        <h1>{settings?.tagline || "حلو يومك يبدأ من هنا!"}</h1>
        <p>
          حلويات بيتية تطلبها أونلاين. شوف شنو المتوفر اليوم، اختَر الكمية،
          واطلب مباشرة عبر واتساب. ما في محل مفتوح، الطلب من الموقع.
        </p>
        <div className="hero-actions">
          <a className="btn btn-orange" href="#today">
            شوف المتوفر اليوم
          </a>
          <a className="btn btn-green" href="#special">
            طلب خاص
          </a>
          <a className="btn btn-ghost" href="#festival">
            المناسبات
          </a>
        </div>
      </div>
      <div className="hero-stage">
        <span className="float-glow glow-a" />
        <span className="float-glow glow-b" />
        <div className="hero-3d">
          <img
            className="hero-photo"
            src={productImage(spotlight?.image_url)}
            alt={spotlight?.name_ar || "منتج اليوم"}
          />
        </div>
        {spotlight ? (
          <div className="hero-chip price">
            <strong>{spotlight.name_ar}</strong>
            <div>{formatPrice(spotlight.price)}</div>
          </div>
        ) : null}
        <div className="hero-chip date">اختيارات اليوم</div>
      </div>
    </section>
  );
}
