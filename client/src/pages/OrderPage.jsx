import { Link } from "react-router-dom";
import { api } from "../api/client.js";
import { useCatalog } from "../hooks/useCatalog.js";
import { Footer } from "../components/Footer.jsx";
import { Header } from "../components/Header.jsx";
import { QuantityStepper } from "../components/QuantityStepper.jsx";
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
    <div className="app-shell">
      <Header shopName={settings?.shop_name} />
      <section className="order-page container">
        <Link to="/" className="muted">
          كمّل التسوّق
        </Link>
        <div className="section-head">
          <h2>طلبك جاهز لواتساب</h2>
        </div>
        {items.length === 0 ? (
          <div className="empty">
            <p>الطلب فاضي. اختَر منتجات من قائمة اليوم، أو اطلب طلب خاص حسب مناسبتك.</p>
            <a className="btn btn-green" href="/#special">
              اطلب طلب خاص
            </a>
          </div>
        ) : (
          <>
            <div className="order-list">
              {items.map((item) => (
                <div className="order-item" key={item.id}>
                  <img src={productImage(item.image_url)} alt={item.name_ar} />
                  <div>
                    <strong>{item.name_ar}</strong>
                    <div className="muted">{formatPrice(item.price)}</div>
                    <button className="btn btn-ghost" type="button" onClick={() => remove(item.id)}>
                      احذف
                    </button>
                  </div>
                  <div>
                    <QuantityStepper value={item.qty} onChange={(value) => setQty(item.id, value)} />
                    <div className="price">{formatPrice(item.price * item.qty)}</div>
                  </div>
                </div>
              ))}
            </div>
            <p>
              الإجمالي: <strong>{formatPrice(total)}</strong>
            </p>
            <button className="btn btn-green" type="button" onClick={sendWhatsApp}>
              اطلب عبر واتساب
            </button>
          </>
        )}
      </section>
      <Footer settings={settings} />
    </div>
  );
}
