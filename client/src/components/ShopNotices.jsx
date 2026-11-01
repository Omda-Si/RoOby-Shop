import {
  buildCustomWhatsAppUrl,
  festivalOrderMessage,
  specialOrderMessage
} from "../utils/whatsapp.js";

export function ShopNotices({ settings }) {
  if (!settings) return null;

  const shopName = settings.shop_name || "RoOby";
  const phone = settings.whatsapp_number;
  const showSpecial = settings.special_order_enabled && settings.special_order_note;
  const showFestival = settings.festival_enabled && (settings.festival_title || settings.festival_note);

  if (!showSpecial && !showFestival) return null;

  return (
    <section className="section container shop-notices" id="notices">
      <div className="notice-grid">
        {showFestival ? (
          <article className="shop-notice festival-notice" id="festival">
            <span className="notice-kicker">خبر المناسبة</span>
            <h3>{settings.festival_title || "مناسبات وأعياد"}</h3>
            <p>{settings.festival_note}</p>
            <a
              className="btn btn-orange"
              href={buildCustomWhatsAppUrl(
                phone,
                festivalOrderMessage(shopName, settings.festival_title, settings.festival_note)
              )}
              target="_blank"
              rel="noreferrer"
            >
              اسأل عن المناسبة في واتساب
            </a>
          </article>
        ) : null}
        {showSpecial ? (
          <article className="shop-notice special-notice" id="special">
            <span className="notice-kicker">طلب خاص</span>
            <h3>هل تريد طلب مخصوص؟</h3>
            <p>{settings.special_order_note}</p>
            <a
              className="btn btn-green"
              href={buildCustomWhatsAppUrl(phone, specialOrderMessage(shopName, settings.special_order_note))}
              target="_blank"
              rel="noreferrer"
            >
              اطلب طلب خاص عبر واتساب
            </a>
          </article>
        ) : null}
      </div>
    </section>
  );
}
