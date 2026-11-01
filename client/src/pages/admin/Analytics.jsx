import { useEffect, useState } from "react";
import { api } from "../../api/client.js";
import { formatPrice } from "../../utils/format.js";

export function AnalyticsAdmin() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.analytics().then(setData);
  }, []);

  if (!data) return <div className="empty">جاري تحميل التحليل...</div>;

  const maxDay = Math.max(...data.days.map((item) => item.revenue), 1);
  const maxWeek = Math.max(...data.weeks.map((item) => item.revenue), 1);
  const maxMonth = Math.max(...data.months.map((item) => item.revenue), 1);

  return (
    <section>
      <h1>تحليل المبيعات</h1>
      <p className="muted">السجل يتحدث لما الزبون يضغط "اطلب عبر واتساب". الأرقام لليوم والأسبوع والشهر.</p>
      <div className="stat-grid">
        <article className="stat-card">
          <span>اليوم</span>
          <strong>{formatPrice(data.today.revenue)}</strong>
          <p>{data.today.orders} طلب</p>
        </article>
        <article className="stat-card">
          <span>هذا الأسبوع</span>
          <strong>{formatPrice(data.week.revenue)}</strong>
          <p>{data.week.orders} طلب</p>
        </article>
        <article className="stat-card">
          <span>هذا الشهر</span>
          <strong>{formatPrice(data.month.revenue)}</strong>
          <p>{data.month.orders} طلب</p>
        </article>
      </div>

      <div className="chart-block">
        <h3>آخر ٧ أيام</h3>
        <BarRow items={data.days} max={maxDay} />
      </div>
      <div className="chart-block">
        <h3>آخر ٤ أسابيع</h3>
        <BarRow items={data.weeks} max={maxWeek} />
      </div>
      <div className="chart-block">
        <h3>آخر ٦ أشهر</h3>
        <BarRow items={data.months} max={maxMonth} />
      </div>

      <h3>آخر الطلبات</h3>
      {data.recent.map((order) => (
        <div className="today-row" key={order.id}>
          <span />
          <div>
            <strong>طلب #{order.id}</strong>
            <div className="muted">{new Date(order.created_at).toLocaleString("ar-SD")}</div>
          </div>
          <span>{order.items.map((item) => `${item.name_ar} × ${item.qty}`).join("، ")}</span>
          <strong>{formatPrice(order.total)}</strong>
        </div>
      ))}
    </section>
  );
}

function BarRow({ items, max }) {
  return (
    <div className="bars">
      {items.map((item) => (
        <div className="bar-col" key={item.label}>
          <div className="bar" style={{ height: `${Math.max(8, (item.revenue / max) * 140)}px` }} />
          <small>{item.label}</small>
          <small>{formatPrice(item.revenue)}</small>
        </div>
      ))}
    </div>
  );
}
