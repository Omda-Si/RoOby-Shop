import { useEffect, useState } from "react";
import { api } from "../../api/client.js";

export function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    api.categories().then(setCategories);
  }, []);

  async function addCategory(event) {
    event.preventDefault();
    const created = await api.createCategory({ name_ar: name, sort_order: categories.length + 1 });
    setCategories((current) => [...current, created]);
    setName("");
  }

  async function save(category) {
    const saved = await api.updateCategory(category.id, category);
    setCategories((current) => current.map((item) => (item.id === saved.id ? saved : item)));
  }

  async function remove(id) {
    if (!window.confirm("تحذف التصنيف؟")) return;
    await api.deleteCategory(id);
    setCategories((current) => current.filter((item) => item.id !== id));
  }

  return (
    <section>
      <h1>التصنيفات</h1>
      <form className="admin-toolbar" onSubmit={addCategory}>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="اسم تصنيف جديد" required />
        <button className="btn btn-orange" type="submit">
          أضف تصنيف
        </button>
      </form>
      {categories.map((category) => (
        <div className="today-row" key={category.id}>
          <span />
          <input
            value={category.name_ar}
            onChange={(event) =>
              setCategories((current) =>
                current.map((item) => (item.id === category.id ? { ...item, name_ar: event.target.value } : item))
              )
            }
          />
          <input
            type="number"
            value={category.sort_order}
            onChange={(event) =>
              setCategories((current) =>
                current.map((item) => (item.id === category.id ? { ...item, sort_order: event.target.value } : item))
              )
            }
          />
          <button className="btn btn-ghost" type="button" onClick={() => save(category)}>
            حفظ
          </button>
          <button className="btn btn-ghost" type="button" onClick={() => remove(category.id)}>
            حذف
          </button>
        </div>
      ))}
    </section>
  );
}
