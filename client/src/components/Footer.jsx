export function Footer({ settings }) {
  const tiktok = settings?.tiktok || "https://www.tiktok.com/@dyrdzcak1sug";
  const whatsapp = String(settings?.whatsapp_number || "249997533834").replace(/\D/g, "");
  const shopName = settings?.shop_name || "RoOby";

  return (
    <footer className="site-footer">
      <span className="footer-glow footer-glow-a" />
      <span className="footer-glow footer-glow-b" />
      <span className="footer-shine" />
      <div className="container footer-grid">
        <div className="footer-brand">
          <img className="footer-logo" src="/logo.png" alt={shopName} />
          <h3>{shopName}</h3>
          <p>{settings?.about}</p>
          <span className="live-pill footer-live">
            <span className="live-dot" />
            المتجر أونلاين • جاهز للطلب
          </span>
        </div>
        <div className="footer-col">
          <h4>تواصل معنا</h4>
          <p>{settings?.address}</p>
          <p className="footer-phone">{settings?.phone}</p>
        </div>
        <div className="footer-col">
          <h4>اطلب وتابع</h4>
          <div className="footer-chips">
            <a className="footer-chip chip-whatsapp" href={`https://wa.me/${whatsapp}`}>
              واتساب الطلبات
            </a>
            <a className="footer-chip chip-tiktok" href={tiktok} target="_blank" rel="noreferrer">
              تيك توك
            </a>
            <a className="footer-chip" href="/#special">
              طلب خاص
            </a>
            <a className="footer-chip" href="/#festival">
              المناسبات والأعياد
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bar">
        <div className="container">{shopName} • حلويات بيتية تطلبها أونلاين</div>
      </div>
    </footer>
  );
}
