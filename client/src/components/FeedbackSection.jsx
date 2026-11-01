import { useState } from "react";
import { api } from "../api/client.js";

export function FeedbackSection({ feedbacks = [], onSubmitted }) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");

  async function onSubmit(event) {
    event.preventDefault();
    setMessage("");
    try {
      await api.sendFeedback({ name, comment, rating });
      setName("");
      setComment("");
      setRating(5);
      setMessage("شكراً ليك. التعليق بانتظار موافقة الإدارة قبل ما يظهر في الصفحة");
      onSubmitted?.();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section className="section container" id="feedback">
      <div className="section-head">
        <div>
          <h2>كلام الزبائن</h2>
          <p className="muted">آراء الناس تظهر هنا تحت، بعد موافقة الإدارة.</p>
        </div>
      </div>
      <div className="feedback-grid">
        {feedbacks.map((item) => (
          <article className="feedback-card" key={item.id}>
            <strong>{item.name}</strong>
            <div className="stars">{"★".repeat(item.rating)}{"☆".repeat(5 - item.rating)}</div>
            <p>{item.comment}</p>
          </article>
        ))}
      </div>
      <form className="panel feedback-form" onSubmit={onSubmit}>
        <h3>اترك تعليقك</h3>
        <div className="form-grid">
          <label className="field">
            اسمك
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <label className="field">
            التقييم
            <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
              <option value="5">٥ نجوم</option>
              <option value="4">٤ نجوم</option>
              <option value="3">٣ نجوم</option>
              <option value="2">نجمتين</option>
              <option value="1">نجمة</option>
            </select>
          </label>
          <label className="field full">
            التعليق
            <textarea rows="3" value={comment} onChange={(event) => setComment(event.target.value)} required />
          </label>
        </div>
        {message ? <p>{message}</p> : null}
        <button className="btn btn-orange" type="submit">
          انشر تعليقي
        </button>
      </form>
    </section>
  );
}
