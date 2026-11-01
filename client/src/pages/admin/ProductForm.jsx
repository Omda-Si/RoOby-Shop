import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/client.js";

const empty = {
  name_ar: "",
  description: "",
  price: 2000,
  category_id: "",
  quantity: 10,
  is_available_today: true,
  is_sold_out: false,
  is_featured: false,
  layout_variant: "standard"
};

export function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.categories().then(setCategories);
    if (id && id !== "new") {
      api.adminProducts().then((products) => {
        const product = products.find((item) => String(item.id) === id);
        if (product) {
          setForm({
            ...product,
            category_id: product.category_id || ""
          });
        }
      });
    }
  }, [id]);

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        quantity: Number(form.quantity),
        category_id: form.category_id || null
      };
      const saved =
        id && id !== "new" ? await api.updateProduct(id, payload) : await api.createProduct(payload);
      if (file) {
        await api.uploadProductImage(saved.id, file);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form className="panel admin-form" onSubmit={onSubmit}>
      <h1>{id === "new" || !id ? "منتج جديد" : "تعديل المنتج"}</h1>
      <div className="form-grid">
        <label className="field">
          اسم المنتج
          <input value={form.name_ar} onChange={(event) => setField("name_ar", event.target.value)} required />
        </label>
        <label className="field">
          السعر بالجنيه
          <input type="number" min="0" value={form.price} onChange={(event) => setField("price", event.target.value)} />
        </label>
        <label className="field full">
          وصف قصير
          <textarea rows="3" value={form.description} onChange={(event) => setField("description", event.target.value)} />
        </label>
        <label className="field">
          التصنيف
          <select value={form.category_id} onChange={(event) => setField("category_id", event.target.value)}>
            <option value="">بدون تصنيف</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name_ar}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          شكل البطاقة
          <select value={form.layout_variant} onChange={(event) => setField("layout_variant", event.target.value)}>
            <option value="standard">عادي</option>
            <option value="featured">مميز</option>
            <option value="wide">عريض</option>
            <option value="tall">طويل</option>
            <option value="stamp">ختم</option>
          </select>
        </label>
        <label className="field">
          الكمية المتوفرة
          <input type="number" min="0" value={form.quantity} onChange={(event) => setField("quantity", event.target.value)} />
        </label>
        <label className="field">
          صورة المنتج
          <input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] || null)} />
        </label>
        <label className="switch">
          <input
            type="checkbox"
            checked={form.is_available_today}
            onChange={(event) => setField("is_available_today", event.target.checked)}
          />
          متوفر اليوم
        </label>
        <label className="switch">
          <input type="checkbox" checked={form.is_featured} onChange={(event) => setField("is_featured", event.target.checked)} />
          منتج مميز
        </label>
        <label className="switch">
          <input
            type="checkbox"
            checked={form.is_sold_out}
            onChange={(event) => setField("is_sold_out", event.target.checked)}
          />
          خلص اليوم
        </label>
      </div>
      {error ? <p>{error}</p> : null}
      <button className="btn btn-orange" type="submit">
        حفظ المنتج
      </button>
    </form>
  );
}
