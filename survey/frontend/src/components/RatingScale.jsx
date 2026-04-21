export default function RatingScale({ options, value, onChange, error }) {
  return (
    <div>
      <div className="rating-group">
        {options.map((opt, i) => (
          <button
            key={i}
            type="button"
            className={`rating-btn${value === i + 1 ? ' selected' : ''}${error ? ' field-error' : ''}`}
            onClick={() => onChange(i + 1)}
          >
            {opt}
          </button>
        ))}
      </div>
      {error && <div className="error-msg">{error}</div>}
    </div>
  )
}
