import { useEffect, useState } from "react";
import { api } from "../../api/client.js";

export function SettingsAdmin() {
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.settings().then(setForm);
  }, []);

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    const saved = await api.saveSettings(form);
    setForm(saved);
    setMessage("اتحفظت إعدادات المحل");
  }

  if (!form) return null;

  return (
    <form className="panel admin-form" onSubmit={onSubmit}>
      <h1>إعدادات المحل</h1>
      <div className="form-grid">
        <label className="field">
          اسم المحل
          <input value={form.shop_name} onChange={(event) => setField("shop_name", event.target.value)} />
        </label>
        <label className="field">
          رقم واتساب
          <input value={form.whatsapp_number} onChange={(event) => setField("whatsapp_number", event.target.value)} />
        </label>
        <label className="field full">
          شعار الصفحة
          <input value={form.tagline} onChange={(event) => setField("tagline", event.target.value)} />
        </label>
        <label className="field full">
          خبر اليوم
          <textarea
            rows="3"
            value={form.daily_news || ""}
            onChange={(event) => setField("daily_news", event.target.value)}
            placeholder="ظهر في الصفحة الرئيسية فوق المنتجات"
          />
        </label>
        <label className="switch">
          <input
            type="checkbox"
            checked={form.special_order_enabled !== false}
            onChange={(event) => setField("special_order_enabled", event.target.checked)}
          />
          أظهر الطلب الخاص في المتجر
        </label>
        <label className="field full">
          رسالة الطلب الخاص
          <textarea
            rows="3"
            value={form.special_order_note || ""}
            onChange={(event) => setField("special_order_note", event.target.value)}
            placeholder="تقدر تطلب كيكة أو صينية خاصة حسب مناسبتك."
          />
        </label>
        <label className="switch">
          <input
            type="checkbox"
            checked={Boolean(form.festival_enabled)}
            onChange={(event) => setField("festival_enabled", event.target.checked)}
          />
          أظهر خبر العيد أو المناسبة
        </label>
        <label className="field">
          عنوان المناسبة
          <input
            value={form.festival_title || ""}
            onChange={(event) => setField("festival_title", event.target.value)}
            placeholder="عيد الفطر، رمضان، رأس السنة"
          />
        </label>
        <label className="field full">
          خبر المناسبة
          <textarea
            rows="3"
            value={form.festival_note || ""}
            onChange={(event) => setField("festival_note", event.target.value)}
            placeholder="استقبال طلبات كعك العيد من اليوم."
          />
        </label>
        <label className="field full">
          نبذة
          <textarea rows="3" value={form.about} onChange={(event) => setField("about", event.target.value)} />
        </label>
        <label className="field">
          الهاتف
          <input value={form.phone || ""} onChange={(event) => setField("phone", event.target.value)} />
        </label>
        <label className="field">
          العنوان
          <input value={form.address || ""} onChange={(event) => setField("address", event.target.value)} />
        </label>
        <label className="field full">
          تيك توك
          <input value={form.tiktok || ""} onChange={(event) => setField("tiktok", event.target.value)} />
        </label>
        <label className="switch">
          <input
            type="checkbox"
            checked={form.show_unavailable}
            onChange={(event) => setField("show_unavailable", event.target.checked)}
          />
          أظهر المنتجات اللي خلصت بختم "خلص اليوم"
        </label>
      </div>
      {message ? <p>{message}</p> : null}
      <button className="btn btn-orange" type="submit">
        حفظ الإعدادات
      </button>
    </form>
  );
}
