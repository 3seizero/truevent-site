export default function OpenText({ placeholder, value, onChange, error }) {
  return (
    <div>
      <textarea
        className={`text-area${error ? ' field-error' : ''}`}
        placeholder={placeholder || ''}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
      />
      {error && <div className="error-msg">{error}</div>}
    </div>
  )
}
