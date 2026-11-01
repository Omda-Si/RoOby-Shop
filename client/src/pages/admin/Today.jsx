import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../api/client.js";
import { formatPrice, productImage } from "../../utils/format.js";

export function TodayAdmin() {
  const [items, setItems] = useState([]);
  const [notices, setNotices] = useState({
    daily_news: "",
    special_order_enabled: true,
    special_order_note: "",
    festival_enabled: false,
    festival_title: "",
    festival_note: ""
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([api.adminProducts(), api.settings()]).then(([products, settings]) => {
      setItems(products);
      setNotices({
        daily_news: settings.daily_news || "",
        special_order_enabled: settings.special_order_enabled !== false,
        special_order_note: settings.special_order_note || "",
        festival_enabled: Boolean(settings.festival_enabled),
        festival_title: settings.festival_title || "",
        festival_note: settings.festival_note || ""
      });
    });
  }, []);

  function update(id, patch) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function setNotice(name, value) {
    setNotices((current) => ({ ...current, [name]: value }));
  }

  async function publish() {
    const saved = await api.saveToday(
      items.map((item) => ({
        id: item.id,
        is_available_today: item.is_available_today,
        quantity: Number(item.quantity),
        is_sold_out: Boolean(item.is_sold_out) || Number(item.quantity) === 0,
        is_featured: item.is_featured
      })),
      notices
    );
    setItems(saved);
    setMessage("اتنشر خبر اليوم، الطلب الخاص، والمناسبة على المتجر");
  }

  return (
    <section>
      <div className="admin-toolbar">
        <div>
          <h1>إدارة منتجات اليوم</h1>
          <p className="muted">
            اكتبي خبر اليوم، الطلب الخاص، وخبر العيد أو المناسبة. بعدين انشري عشان الزبائن يشوفوا التحديث فوراً.
          </p>
        </div>
        <div className="header-actions">
          <Link className="btn btn-ghost" to="/admin/products/new">
            أضف منتج جديد
          </Link>
          <button className="btn btn-orange" type="button" onClick={publish}>
            انشر على المتجر
          </button>
        </div>
      </div>

      <div className="panel news-editor">
        <label className="field">
          خبر اليوم
          <textarea
            rows="3"
            value={notices.daily_news}
            onChange={(event) => setNotice("daily_news", event.target.value)}
            placeholder="مثال: اليوم في كيكة شوكولاتة وكنافة. الكمية محدودة."
          />
        </label>
        <p className="muted">الخبر ده يظهر للزبائن فوق قائمة المنتجات. امسحيه لو ما في خبر اليوم.</p>
      </div>

      <div className="panel news-editor">
        <label className="switch">
          <input
            type="checkbox"
            checked={notices.special_order_enabled}
            onChange={(event) => setNotice("special_order_enabled", event.target.checked)}
          />
          أظهر كرت الطلب الخاص للزبائن
        </label>
        <label className="field">
          رسالة الطلب الخاص
          <textarea
            rows="3"
            value={notices.special_order_note}
            onChange={(event) => setNotice("special_order_note", event.target.value)}
            placeholder="مثال: تقدر تطلب كيكة مكتوب عليها اسم، أو صينية حسب مناسبتك."
          />
        </label>
        <p className="muted">الزبون يقرأ الرسالة دي ويضغط واتساب عشان يكتب نوع الطلب والكمية وتاريخ الاستلام.</p>
      </div>

      <div className="panel news-editor">
        <label className="switch">
          <input
            type="checkbox"
            checked={notices.festival_enabled}
            onChange={(event) => setNotice("festival_enabled", event.target.checked)}
          />
          أظهر خبر العيد أو المناسبة
        </label>
        <label className="field">
          عنوان المناسبة
          <input
            value={notices.festival_title}
            onChange={(event) => setNotice("festival_title", event.target.value)}
            placeholder="مثال: عيد الفطر، رمضان، رأس السنة"
          />
        </label>
        <label className="field">
          خبر المناسبة
          <textarea
            rows="3"
            value={notices.festival_note}
            onChange={(event) => setNotice("festival_note", event.target.value)}
            placeholder="مثال: استقبال طلبات كعك العيد من اليوم. اطلبوا بدري."
          />
        </label>
        <p className="muted">
          فعّلي المربع ده بس وقت العيد أو المناسبة. لما تخلص، شيلّي العلامة عشان الكرت يختفي من المتجر.
        </p>
      </div>

      {message ? <p>{message}</p> : null}
      <div className="today-row today-row-head">
        <span />
        <span>المنتج</span>
        <span>متوفر اليوم</span>
        <span>الكمية</span>
        <span>خلص</span>
        <span>مميز</span>
      </div>
      {items.map((item) => (
        <div className="today-row" key={item.id}>
          <img src={productImage(item.image_url)} alt="" />
          <div>
            <strong>{item.name_ar}</strong>
            <div className="muted">{formatPrice(item.price)}</div>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={item.is_available_today}
              onChange={(event) => update(item.id, { is_available_today: event.target.checked })}
            />
            نعم
          </label>
          <input
            type="number"
            min="0"
            value={item.quantity}
            onChange={(event) => update(item.id, { quantity: event.target.value })}
          />
          <label className="switch">
            <input
              type="checkbox"
              checked={item.is_sold_out || Number(item.quantity) === 0}
              onChange={(event) =>
                update(item.id, { is_sold_out: event.target.checked, quantity: event.target.checked ? 0 : item.quantity })
              }
            />
            خلص
          </label>
          <label className="switch">
            <input
              type="checkbox"
              checked={item.is_featured}
              onChange={(event) => update(item.id, { is_featured: event.target.checked })}
            />
            نعم
          </label>
        </div>
      ))}
    </section>
  );
}
