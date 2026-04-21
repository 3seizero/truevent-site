import { useState, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import RatingScale from '../components/RatingScale'
import OpenText from '../components/OpenText'
import { API_URL } from '../config'

// Import form schemas
import pugliaFeedback from '../data/forms/puglia-2026-feedback.json'

const FORMS = {
  'puglia-2026-getyourfeedback': pugliaFeedback,
}

function resolveForm(event, edition, formType) {
  const key = `${event}-${edition}-${formType}`
  return FORMS[key] || null
}

export default function SurveyPage() {
  const { event, edition, formType } = useParams()
  const form = resolveForm(event, edition, formType)

  const [respondent, setRespondent] = useState({ name: '', email: '', company: '', role: '' })
  const [answers, setAnswers] = useState({})
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const progress = useMemo(() => {
    if (!form) return 0
    const total = form.questions.length + 2 // +2 for name and email
    let filled = 0
    if (respondent.name) filled++
    if (respondent.email) filled++
    form.questions.forEach(q => {
      if (answers[q.key] !== undefined && answers[q.key] !== '') filled++
    })
    return Math.round((filled / total) * 100)
  }, [form, respondent, answers])

  if (!form) {
    return (
      <div className="success-page">
        <div className="survey-logo">TRUE</div>
        <div className="success-title">Survey not found</div>
        <div className="success-text">This survey does not exist or is no longer active.</div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="success-page">
        <div style={{fontSize:'clamp(48px, 12vw, 96px)', fontFamily:"'Roboto', sans-serif", fontWeight:900, letterSpacing:'.18em', textTransform:'uppercase', color:'var(--white)', marginBottom:'24px'}}>TRUE</div>
        <div className="success-check">✓</div>
        <div style={{fontFamily:"'Roboto Mono', monospace", fontSize:'13px', letterSpacing:'.28em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'20px'}}>Thank you</div>
        <div className="success-text">
          Your feedback has been submitted successfully.<br/>
          A confirmation email has been sent to {respondent.email}.<br/><br/>
          Your insights help us shape the future of TRUE.
        </div>
      </div>
    )
  }

  const setAnswer = (key, val) => {
    setAnswers(prev => ({ ...prev, [key]: val }))
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n })
  }

  const setField = (key, val) => {
    setRespondent(prev => ({ ...prev, [key]: val }))
    setErrors(prev => { const n = { ...prev }; delete n[key]; return n })
  }

  const validate = () => {
    const errs = {}
    if (!respondent.name.trim()) errs.name = 'Required'
    if (!respondent.email.trim()) errs.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(respondent.email)) errs.email = 'Invalid email'

    form.questions.forEach(q => {
      if (q.required && (answers[q.key] === undefined || answers[q.key] === '')) {
        errs[q.key] = 'This field is required'
      }
    })

    setErrors(errs)

    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0]
      const el = document.getElementById(`field-${firstKey}`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)

    const payload = {
      form_slug: form.slug,
      respondent,
      answers: form.questions.map(q => ({
        key: q.key,
        question_text: q.text,
        type: q.type,
        value: answers[q.key],
      })),
    }

    try {
      const res = await fetch(`${API_URL}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submit failed')
      setSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      alert(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="survey-page">
      <div className="progress-bar" style={{ width: `${progress}%` }} />

      <div className="survey-header">
        <div className="survey-logo">TRUE</div>
        <div className="survey-subtitle">{form.subtitle}</div>
        <div className="survey-title">{form.title}</div>
        <p className="survey-intro">{form.intro}</p>
      </div>

      <form className="survey-form" onSubmit={handleSubmit} noValidate>
        <div className="respondent-section" id="field-name">
          <div className="respondent-title">About You</div>
          <div className="respondent-grid">
            <div className="field-group">
              <label className="field-label">Full Name *</label>
              <input
                className={`field-input${errors.name ? ' field-error' : ''}`}
                type="text"
                value={respondent.name}
                onChange={e => setField('name', e.target.value)}
                placeholder="Your full name"
              />
              {errors.name && <div className="error-msg">{errors.name}</div>}
            </div>
            <div className="field-group" id="field-email">
              <label className="field-label">Email *</label>
              <input
                className={`field-input${errors.email ? ' field-error' : ''}`}
                type="email"
                value={respondent.email}
                onChange={e => setField('email', e.target.value)}
                placeholder="your@email.com"
              />
              {errors.email && <div className="error-msg">{errors.email}</div>}
            </div>
            <div className="field-group">
              <label className="field-label">Company / Property</label>
              <input
                className="field-input"
                type="text"
                value={respondent.company}
                onChange={e => setField('company', e.target.value)}
                placeholder="Your company"
              />
            </div>
            <div className="field-group">
              <label className="field-label">Your Role</label>
              <select
                className="field-select"
                value={respondent.role}
                onChange={e => setField('role', e.target.value)}
              >
                <option value="">Select role</option>
                <option value="buyer">Buyer</option>
                <option value="exhibitor">Exhibitor / Hotel / DMC</option>
                <option value="partner">Partner</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {form.questions.map((q, i) => (
          <div className="form-section" key={q.key} id={`field-${q.key}`}>
            <div className="question-number">Question {String(i + 1).padStart(2, '0')}</div>
            <div className="question-text">
              {q.text}
              {q.required && <span className="question-required">*</span>}
            </div>
            {q.type === 'rating' ? (
              <RatingScale
                options={q.options}
                value={answers[q.key]}
                onChange={val => setAnswer(q.key, val)}
                error={errors[q.key]}
              />
            ) : (
              <OpenText
                placeholder={q.placeholder}
                value={answers[q.key]}
                onChange={val => setAnswer(q.key, val)}
                error={errors[q.key]}
              />
            )}
          </div>
        ))}

        <div className="submit-section">
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Feedback →'}
          </button>
          <div className="submit-privacy">
            By submitting this form you agree to our{' '}
            <a href="https://www.truevent.eu/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a>.
          </div>
        </div>
      </form>

      <div className="survey-footer">
        <div className="survey-footer-text">
          © TRUE 2026 — <a href="https://truevent.eu" target="_blank" rel="noreferrer">truevent.eu</a>
        </div>
      </div>
    </div>
  )
}
