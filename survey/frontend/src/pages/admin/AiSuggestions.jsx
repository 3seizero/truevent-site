import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../config'

export default function AiSuggestions() {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const generate = () => {
    setLoading(true)
    setError('')
    fetch(`${API_URL}/admin/ai-suggestions?form=${slug}`, { credentials: 'include' })
      .then(r => { if (r.status === 401) { navigate('/admin'); throw new Error() } return r.json() })
      .then(d => { if (d.error) throw new Error(d.error); setData(d) })
      .catch(e => setError(e.message || 'Failed to generate'))
      .finally(() => setLoading(false))
  }

  const renderMarkdown = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} style={s.h2}>{line.replace('## ', '')}</h2>
      if (line.startsWith('### ')) return <h3 key={i} style={s.h3}>{line.replace('### ', '')}</h3>
      if (line.startsWith('- ')) return <div key={i} style={s.li}>• {line.replace('- ', '')}</div>
      if (line.match(/^\d+\.\s/)) return <div key={i} style={s.li}>{line}</div>
      if (line.startsWith('**') && line.endsWith('**')) return <div key={i} style={s.bold}>{line.replace(/\*\*/g, '')}</div>
      if (line.trim() === '') return <div key={i} style={{height:'12px'}} />
      return <div key={i} style={s.p}>{line}</div>
    })
  }

  const s = {
    page: { minHeight:'100dvh', background:'var(--black)', padding:'40px 24px' },
    container: { maxWidth:'760px', margin:'0 auto' },
    back: { fontFamily:"'Roboto Mono', monospace", fontSize:'9px', letterSpacing:'.15em', textTransform:'uppercase', color:'var(--gold)', textDecoration:'none', display:'inline-block', marginBottom:'16px' },
    title: { fontFamily:"'Roboto', sans-serif", fontWeight:900, fontSize:'clamp(24px, 4vw, 36px)', textTransform:'uppercase', color:'var(--white)', marginBottom:'8px' },
    meta: { fontFamily:"'Roboto Mono', monospace", fontSize:'10px', letterSpacing:'.12em', color:'var(--gray)', textTransform:'uppercase', marginBottom:'32px' },
    btn: { fontFamily:"'Roboto Mono', monospace", fontSize:'10px', letterSpacing:'.2em', textTransform:'uppercase', padding:'16px 36px', background:'var(--gold)', color:'var(--black)', border:'none', cursor:'pointer', transition:'all .25s', display:'inline-flex', alignItems:'center', gap:'10px' },
    content: { background:'var(--dark)', border:'1px solid rgba(200,169,110,.1)', padding:'clamp(24px, 4vw, 48px)', marginTop:'32px' },
    h2: { fontFamily:"'Roboto', sans-serif", fontWeight:900, fontSize:'18px', textTransform:'uppercase', color:'var(--white)', marginTop:'28px', marginBottom:'14px', letterSpacing:'-.01em' },
    h3: { fontFamily:"'Roboto', sans-serif", fontWeight:700, fontSize:'14px', textTransform:'uppercase', color:'var(--gold)', marginTop:'20px', marginBottom:'10px' },
    p: { fontFamily:"'Roboto Mono', monospace", fontSize:'11px', lineHeight:1.85, color:'rgba(245,240,232,.65)', letterSpacing:'.03em' },
    li: { fontFamily:"'Roboto Mono', monospace", fontSize:'11px', lineHeight:1.85, color:'rgba(245,240,232,.65)', letterSpacing:'.03em', paddingLeft:'8px', marginBottom:'4px' },
    bold: { fontFamily:"'Roboto Mono', monospace", fontSize:'11px', lineHeight:1.85, color:'var(--white)', fontWeight:700, letterSpacing:'.03em' },
    timestamp: { fontFamily:"'Roboto Mono', monospace", fontSize:'9px', color:'var(--gray)', letterSpacing:'.12em', textTransform:'uppercase', marginTop:'24px', textAlign:'right' },
    spinner: { display:'inline-block', width:'16px', height:'16px', border:'2px solid rgba(9,8,12,.3)', borderTop:'2px solid var(--black)', borderRadius:'50%', animation:'spin 0.8s linear infinite' },
  }

  return (
    <div style={s.page}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={s.container}>
        <Link to={`/admin/responses/${slug}`} style={s.back}>← Back to responses</Link>
        <div style={s.title}>AI Analysis</div>
        <div style={s.meta}>{slug.replace(/-/g, ' ')}</div>

        {!data && !loading && (
          <div>
            <div style={{fontFamily:"'Roboto Mono', monospace", fontSize:'11px', color:'var(--gray)', lineHeight:1.8, marginBottom:'24px', textTransform:'uppercase', letterSpacing:'.04em'}}>
              Generate an AI-powered analysis of all feedback responses. Claude will identify strengths, areas for improvement, and provide actionable recommendations for the next edition.
            </div>
            <button style={s.btn} onClick={generate}>Generate Analysis →</button>
          </div>
        )}

        {loading && (
          <div style={{textAlign:'center', padding:'60px 0'}}>
            <div style={s.spinner} />
            <div style={{fontFamily:"'Roboto Mono', monospace", fontSize:'10px', color:'var(--gray)', textTransform:'uppercase', letterSpacing:'.15em', marginTop:'16px'}}>Analyzing feedback...</div>
          </div>
        )}

        {error && <div className="error-msg" style={{marginTop:'16px'}}>{error}</div>}

        {data && (
          <div style={s.content}>
            {renderMarkdown(data.analysis)}
            <div style={s.timestamp}>
              Based on {data.total_responses} responses — Generated {data.generated_at}
            </div>
            <div style={{marginTop:'24px', display:'flex', gap:'10px'}}>
              <button style={{...s.btn, background:'transparent', border:'1px solid rgba(200,169,110,.3)', color:'var(--gold)'}} onClick={generate}>Regenerate ↻</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
