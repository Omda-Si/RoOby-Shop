import { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { useAuth } from "../../context/AuthContext.jsx";

export function SettingsAdmin() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState("");
  const [accountMessage, setAccountMessage] = useState("");
  const [accountError, setAccountError] = useState("");
  const [account, setAccount] = useState({
    username: "",
    current_password: "",
    new_password: "",
    confirm_password: ""
  });

  useEffect(() => {
    api.settings().then(setForm);
  }, []);

  useEffect(() => {
    if (user?.username) {
      setAccount((current) => ({ ...current, username: user.username }));
    }
  }, [user]);

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function setAccountField(name, value) {
    setAccount((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    const saved = await api.saveSettings(form);
    setForm(saved);
    setMessage("اتحفظت إعدادات المحل");
  }

  async function onAccountSubmit(event) {
    event.preventDefault();
    setAccountMessage("");
    setAccountError("");
    try {
      const saved = await api.updateAccount(account);
      setUser(saved);
      setAccount({
        username: saved.username,
        current_password: "",
        new_password: "",
        confirm_password: ""
      });
      setAccountMessage(
        account.new_password
          ? "اتغير اسم المستخدم وكلمة المرور. استخدمهم في الدخول الجاي."
          : "اتغير اسم المستخدم."
      );
    } catch (error) {
      setAccountError(error.message);
    }
  }

  if (!form) return null;

  return (
    <div className="settings-stack">
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

      <form className="panel admin-form" onSubmit={onAccountSubmit}>
        <h2>حساب الإدارة</h2>
        <p className="muted">غير اسم المستخدم وكلمة المرور من هنا. لازم تكتب كلمة المرور الحالية للتأكيد.</p>
        <div className="form-grid">
          <label className="field">
            اسم المستخدم الجديد
            <input
              value={account.username}
              onChange={(event) => setAccountField("username", event.target.value)}
              autoComplete="username"
              required
            />
          </label>
          <label className="field">
            كلمة المرور الحالية
            <input
              type="password"
              value={account.current_password}
              onChange={(event) => setAccountField("current_password", event.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          <label className="field">
            كلمة المرور الجديدة
            <input
              type="password"
              value={account.new_password}
              onChange={(event) => setAccountField("new_password", event.target.value)}
              autoComplete="new-password"
              placeholder="اتركها فارغة إذا لا تريد تغييرها"
            />
          </label>
          <label className="field">
            تأكيد كلمة المرور الجديدة
            <input
              type="password"
              value={account.confirm_password}
              onChange={(event) => setAccountField("confirm_password", event.target.value)}
              autoComplete="new-password"
            />
          </label>
        </div>
        {accountError ? <p className="login-error">{accountError}</p> : null}
        {accountMessage ? <p>{accountMessage}</p> : null}
        <button className="btn btn-dark" type="submit">
          حفظ الحساب
        </button>
      </form>
    </div>
  );
}
