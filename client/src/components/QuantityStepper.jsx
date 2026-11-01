export function QuantityStepper({ value, onChange, max = 20 }) {
  return (
    <div className="stepper">
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))} aria-label="تنقيص">
        −
      </button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} aria-label="زيادة">
        +
      </button>
    </div>
  );
}
