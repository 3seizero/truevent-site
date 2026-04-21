import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../config'

const RATING_LABELS = { 1: 'BAD', 2: 'AVERAGE', 3: 'GOOD', 4: 'OUTSTANDING' }
const RATING_COLORS = { 1: '#e74c3c', 2: '#f39c12', 3: '#27ae60', 4: '#C8A96E' }

export default function ResponseDetail() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API_URL}/admin/responses/${id}`, { credentials: 'include' })
      .then(r => { if (r.status === 401) { navigate('/admin'); throw new Error() } return r.json() })
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const s = {
    page: { minHeight:'100dvh', background:'var(--black)', padding:'40px 24px' },
    container: { maxWidth:'700px', margin:'0 auto' },
    back: { fontFamily:"'Roboto Mono', monospace", fontSize:'9px', letterSpacing:'.15em', textTransform:'uppercase', color:'var(--gold)', textDecoration:'none', display:'inline-block', marginBottom:'16px' },
    title: { fontFamily:"'Roboto', sans-serif", fontWeight:900, fontSize:'clamp(22px, 4vw, 32px)', textTransform:'uppercase', color:'var(--white)', marginBottom:'4px' },
    meta: { fontFamily:"'Roboto Mono', monospace", fontSize:'10px', color:'var(--gray)', letterSpacing:'.08em', marginBottom:'32px' },
    infoBox: { background:'var(--dark)', border:'1px solid rgba(200,169,110,.1)', padding:'24px', marginBottom:'24px' },
    infoLabel: { fontFamily:"'Roboto Mono', monospace", fontSize:'9px', letterSpacing:'.22em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'12px' },
    infoName: { fontFamily:"'Roboto', sans-serif", fontWeight:700, fontSize:'16px', color:'var(--white)' },
    infoSub: { fontFamily:"'Roboto Mono', monospace", fontSize:'11px', color:'var(--gray)', marginTop:'2px' },
    answerCard: { borderBottom:'1px solid rgba(200,169,110,.06)', padding:'24px 0' },
    qNum: { fontFamily:"'Roboto Mono', monospace", fontSize:'9px', letterSpacing:'.22em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'6px' },
    qText: { fontFamily:"'Roboto', sans-serif", fontWeight:700, fontSize:'13px', textTransform:'uppercase', letterSpacing:'.02em', color:'var(--white)', marginBottom:'12px' },
    rating: { fontFamily:"'Roboto Mono', monospace", fontSize:'12px', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' },
    text: { fontFamily:"'Roboto Mono', monospace", fontSize:'12px', lineHeight:1.8, color:'rgba(245,240,232,.7)', letterSpacing:'.03em' },
  }

  if (loading) return <div style={s.page}><div style={{textAlign:'center', color:'var(--gray)', fontFamily:"'Roboto Mono', monospace", fontSize:'11px', textTransform:'uppercase', paddingTop:'100px'}}>Loading...</div></div>
  if (!data) return <div style={s.page}><div style={{textAlign:'center', color:'var(--gray)', paddingTop:'100px'}}>Not found</div></div>

  return (
    <div style={s.page}>
      <div style={s.container}>
        <Link to={`/admin/responses/${data.form_slug}`} style={s.back}>← Back to responses</Link>
        <div style={s.title}>{data.respondent_name}</div>
        <div style={s.meta}>{data.form_title} — {new Date(data.submitted_at).toLocaleString('en-GB')}</div>

        <div style={s.infoBox}>
          <div style={s.infoLabel}>Respondent</div>
          <div style={s.infoName}>{data.respondent_name}</div>
          <div style={s.infoSub}>{data.respondent_email}</div>
          <div style={s.infoSub}>{data.respondent_company}{data.respondent_role ? ` — ${data.respondent_role}` : ''}</div>
        </div>

        {data.answers.map((a, i) => (
          <div key={a.question_key} style={s.answerCard}>
            <div style={s.qNum}>Question {String(i + 1).padStart(2, '0')}</div>
            <div style={s.qText}>{a.question_text}</div>
            {a.answer_type === 'rating' ? (
              <div style={{...s.rating, color: RATING_COLORS[a.answer_rating] || '#78706A'}}>
                {RATING_LABELS[a.answer_rating] || '—'}
              </div>
            ) : (
              <div style={s.text}>{a.answer_text || '—'}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
