import { useEffect, useState } from "react";
import { api } from "../../api/client.js";

export function CommentsAdmin() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.adminFeedbacks().then(setItems);
  }, []);

  async function approve(id) {
    const saved = await api.approveFeedback(id);
    setItems((current) => current.map((item) => (item.id === saved.id ? saved : item)));
  }

  async function remove(id) {
    if (!window.confirm("تحذف التعليق ده؟")) return;
    await api.deleteFeedback(id);
    setItems((current) => current.filter((item) => item.id !== id));
  }

  const pending = items.filter((item) => !item.approved);
  const published = items.filter((item) => item.approved);

  return (
    <section>
      <h1>تعليقات الزبائن</h1>
      <p className="muted">التعليق ما بظهر للزبائن إلا بعد ما توافق عليه.</p>

      <h3>بانتظار الموافقة ({pending.length})</h3>
      {pending.length === 0 ? <p className="muted">ما في تعليقات جديدة.</p> : null}
      {pending.map((item) => (
        <div className="today-row" key={item.id}>
          <span />
          <div>
            <strong>{item.name}</strong>
            <div className="muted">{"★".repeat(item.rating)}</div>
          </div>
          <p>{item.comment}</p>
          <div className="header-actions">
            <button className="btn btn-orange" type="button" onClick={() => approve(item.id)}>
              موافقة
            </button>
            <button className="btn btn-ghost" type="button" onClick={() => remove(item.id)}>
              حذف
            </button>
          </div>
        </div>
      ))}

      <h3>منشورة في المتجر ({published.length})</h3>
      {published.map((item) => (
        <div className="today-row" key={item.id}>
          <span />
          <div>
            <strong>{item.name}</strong>
            <div className="muted">{"★".repeat(item.rating)}</div>
          </div>
          <p>{item.comment}</p>
          <button className="btn btn-ghost" type="button" onClick={() => remove(item.id)}>
            حذف
          </button>
        </div>
      ))}
    </section>
  );
}
