import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import { BottomNav } from "../components/BottomNav.jsx";
import { Footer } from "../components/Footer.jsx";
import { Header } from "../components/Header.jsx";
import { QuantityStepper } from "../components/QuantityStepper.jsx";
import { useCatalog } from "../hooks/useCatalog.js";
import { useOrder } from "../context/OrderContext.jsx";
import { formatPrice, productImage } from "../utils/format.js";
import { buildWhatsAppUrl } from "../utils/whatsapp.js";

export function OrderPage() {
  const { items, total, setQty, remove } = useOrder();
  const { data } = useCatalog();
  const settings = data?.settings;

  async function sendWhatsApp() {
    const url = buildWhatsAppUrl(settings?.whatsapp_number, settings?.shop_name || "RoOby", items);
    try {
      await api.recordOrder(items);
    } catch {
      // The WhatsApp order should still open even if the local record fails.
    }
    window.open(url, "_blank");
  }

  return (
    <div className="app-shell foodcort-shell">
      <Header shopName={settings?.shop_name} />
      <section className="order-page container">
        <Link to="/" className="muted back-link">
          كمّل التسوّق
        </Link>
        <div className="section-head">
          <h2>سلتي</h2>
        </div>
        {items.length === 0 ? (
          <div className="empty">
            <p>الطلب فاضي. اختَر منتجات من قائمة اليوم، أو اطلب طلب خاص حسب مناسبتك.</p>
            <a className="btn btn-orange" href="/#special">
              اطلب طلب خاص
            </a>
          </div>
        ) : (
          <>
            <div className="cart-banner">خصم على الطلبات الخاصة والمناسبات — اسأل عبر واتساب</div>
            <div className="order-list">
              {items.map((item) => (
                <div className="order-item" key={item.id}>
                  <img src={productImage(item.image_url)} alt={item.name_ar} />
                  <div>
                    <strong>{item.name_ar}</strong>
                    <div className="muted">{formatPrice(item.price)}</div>
                    <button className="text-btn" type="button" onClick={() => remove(item.id)}>
                      احذف
                    </button>
                  </div>
                  <div className="order-item-side">
                    <QuantityStepper value={item.qty} onChange={(value) => setQty(item.id, value)} />
                    <div className="price">{formatPrice(item.price * item.qty)}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-total">
              <span>الإجمالي</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <button className="btn btn-orange btn-block" type="button" onClick={sendWhatsApp}>
              اطلب عبر واتساب
            </button>
          </>
        )}
      </section>
      <Footer settings={settings} />
      <BottomNav />
    </div>
  );
}
