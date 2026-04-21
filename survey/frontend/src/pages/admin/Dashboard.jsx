import { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../config'

const DESTINATIONS = [
  { value: '', label: 'All Destinations' },
  { value: 'puglia', label: 'Puglia' },
  { value: 'dolomites', label: 'Dolomites' },
  { value: 'sardegna', label: 'Sardegna' },
  { value: 'sicily', label: 'Sicily' },
  { value: 'tuscany', label: 'Tuscany' },
  { value: 'amalfi', label: 'Amalfi Coast' },
  { value: 'westcoast', label: 'Road to TRUE West Coast' },
]

export default function Dashboard() {
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterDest, setFilterDest] = useState('')
  const [filterYear, setFilterYear] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API_URL}/admin/forms`, { credentials: 'include' })
      .then(r => {
        if (r.status === 401) { localStorage.removeItem('admin_auth'); navigate('/admin'); throw new Error('Unauthorized') }
        return r.json()
      })
      .then(setForms)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const years = useMemo(() => {
    const y = [...new Set(forms.map(f => f.edition))].sort((a, b) => b - a)
    return [{ value: '', label: 'All Editions' }, ...y.map(v => ({ value: String(v), label: String(v) }))]
  }, [forms])

  const filtered = useMemo(() => {
    return forms.filter(f => {
      if (filterDest && f.event !== filterDest) return false
      if (filterYear && String(f.edition) !== filterYear) return false
      return true
    })
  }, [forms, filterDest, filterYear])

  const totalResponses = useMemo(() => filtered.reduce((sum, f) => sum + (parseInt(f.submission_count) || 0), 0), [filtered])

  const s = {
    page: { minHeight:'100dvh', background:'var(--black)', padding:'40px 24px' },
    header: { maxWidth:'900px', margin:'0 auto 32px' },
    logo: { fontFamily:"'Roboto', sans-serif", fontWeight:900, fontSize:'24px', letterSpacing:'.18em', color:'var(--white)', textDecoration:'none' },
    subtitle: { fontFamily:"'Roboto Mono', monospace", fontSize:'10px', letterSpacing:'.28em', textTransform:'uppercase', color:'var(--gold)', marginTop:'8px' },
    filters: { maxWidth:'900px', margin:'0 auto 24px', display:'flex', gap:'10px', flexWrap:'wrap', alignItems:'center' },
    select: { fontFamily:"'Roboto Mono', monospace", fontSize:'10px', letterSpacing:'.1em', textTransform:'uppercase', padding:'10px 14px', background:'var(--dark)', border:'1px solid rgba(200,169,110,.2)', color:'var(--white)', cursor:'pointer', outline:'none', WebkitAppearance:'none', borderRadius:0 },
    statsRow: { maxWidth:'900px', margin:'0 auto 24px', display:'flex', gap:'24px', flexWrap:'wrap' },
    statBox: { display:'flex', alignItems:'baseline', gap:'8px' },
    statN: { fontFamily:"'Roboto', sans-serif", fontWeight:900, fontSize:'28px', color:'var(--gold)', lineHeight:1 },
    statL: { fontFamily:"'Roboto Mono', monospace", fontSize:'9px', letterSpacing:'.15em', textTransform:'uppercase', color:'var(--gray)' },
    grid: { maxWidth:'900px', margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:'3px' },
    card: { background:'var(--dark)', border:'1px solid rgba(200,169,110,.1)', padding:'32px 28px', textDecoration:'none', transition:'border-color .3s' },
    event: { fontFamily:"'Roboto Mono', monospace", fontSize:'9px', letterSpacing:'.22em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'8px' },
    title: { fontFamily:"'Roboto', sans-serif", fontWeight:900, fontSize:'20px', textTransform:'uppercase', letterSpacing:'-.01em', color:'var(--white)', marginBottom:'6px' },
    type: { fontFamily:"'Roboto Mono', monospace", fontSize:'9px', letterSpacing:'.15em', textTransform:'uppercase', color:'var(--gray)', marginBottom:'20px' },
    count: { fontFamily:"'Roboto', sans-serif", fontWeight:900, fontSize:'36px', color:'var(--gold)', lineHeight:1 },
    countLabel: { fontFamily:"'Roboto Mono', monospace", fontSize:'9px', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--gray)', marginTop:'4px' },
    logout: { fontFamily:"'Roboto Mono', monospace", fontSize:'9px', letterSpacing:'.18em', textTransform:'uppercase', color:'var(--gray)', background:'none', border:'none', cursor:'pointer' },
  }

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
          <div>
            <Link to="/admin/dashboard" style={s.logo}>TRUE</Link>
            <div style={s.subtitle}>Survey Dashboard</div>
          </div>
          <button style={s.logout} onClick={() => { localStorage.removeItem('admin_auth'); navigate('/admin') }}>Logout ✕</button>
        </div>
      </div>

      {!loading && forms.length > 0 && (
        <>
          <div style={s.filters}>
            <select style={s.select} value={filterDest} onChange={e => setFilterDest(e.target.value)}>
              {DESTINATIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
            <select style={s.select} value={filterYear} onChange={e => setFilterYear(e.target.value)}>
              {years.map(y => <option key={y.value} value={y.value}>{y.label}</option>)}
            </select>
            <div style={s.statBox}>
              <div style={s.statN}>{filtered.length}</div>
              <div style={s.statL}>Forms</div>
            </div>
            <div style={s.statBox}>
              <div style={s.statN}>{totalResponses}</div>
              <div style={s.statL}>Total Responses</div>
            </div>
          </div>
        </>
      )}

      {loading ? (
        <div style={{textAlign:'center', color:'var(--gray)', fontFamily:"'Roboto Mono', monospace", fontSize:'11px', letterSpacing:'.1em', textTransform:'uppercase'}}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{textAlign:'center', color:'var(--gray)', fontFamily:"'Roboto Mono', monospace", fontSize:'11px', letterSpacing:'.1em', textTransform:'uppercase'}}>
          {forms.length === 0 ? 'No forms found' : 'No forms match the selected filters'}
        </div>
      ) : (
        <div style={s.grid}>
          {filtered.map(f => (
            <Link key={f.id} to={`/admin/responses/${f.slug}`} style={s.card}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,169,110,.35)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(200,169,110,.1)'}>
              <div style={s.event}>{f.event} {f.edition}</div>
              <div style={s.title}>{f.title}</div>
              <div style={s.type}>{f.form_type}</div>
              <div style={s.count}>{f.submission_count}</div>
              <div style={s.countLabel}>Responses</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
