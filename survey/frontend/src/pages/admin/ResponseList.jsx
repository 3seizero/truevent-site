import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { API_URL } from '../../config'
import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function ResponseList() {
  const { slug } = useParams()
  const [data, setData] = useState({ submissions: [], total: 0, page: 1, pages: 0 })
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [showStats, setShowStats] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const navigate = useNavigate()

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const fetchData = (p) => {
    setLoading(true)
    fetch(`${API_URL}/admin/responses?form=${slug}&page=${p}`, { credentials: 'include' })
      .then(r => { if (r.status === 401) { navigate('/admin'); throw new Error() } return r.json() })
      .then(d => { setData(d); setPage(p) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  const fetchStats = () => {
    fetch(`${API_URL}/admin/stats?form=${slug}`, { credentials: 'include' })
      .then(r => r.json())
      .then(setStats)
      .catch(() => {})
  }

  useEffect(() => { fetchData(1); fetchStats() }, [slug])

  const RATING_LABELS = { 1: 'BAD', 2: 'AVERAGE', 3: 'GOOD', 4: 'OUTSTANDING' }

  const fetchAllResponses = async () => {
    const all = []
    let p = 1, totalPages = 1
    while (p <= totalPages) {
      const res = await fetch(`${API_URL}/admin/responses?form=${slug}&page=${p}`, { credentials: 'include' })
      const d = await res.json()
      all.push(...d.submissions)
      totalPages = d.pages
      p++
    }
    // Fetch full details for each
    const detailed = await Promise.all(all.map(async s => {
      const res = await fetch(`${API_URL}/admin/responses/${s.id}`, { credentials: 'include' })
      return res.json()
    }))
    return detailed
  }

  const buildRows = (responses) => {
    return responses.map(r => {
      const row = { Name: r.respondent_name, Email: r.respondent_email, Company: r.respondent_company, Role: r.respondent_role, Date: new Date(r.submitted_at).toLocaleDateString('en-GB') }
      r.answers.forEach(a => {
        row[a.question_text] = a.answer_type === 'rating' ? (RATING_LABELS[a.answer_rating] || '') : (a.answer_text || '')
      })
      return row
    })
  }

  const exportXLSX = async () => {
    const responses = await fetchAllResponses()
    const rows = buildRows(responses)
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Responses')
    // Auto column width
    const cols = Object.keys(rows[0] || {}).map(k => ({ wch: Math.max(k.length, 15) }))
    ws['!cols'] = cols
    XLSX.writeFile(wb, `${slug}-export.xlsx`)
  }

  const exportPDF = async () => {
    const responses = await fetchAllResponses()
    const rows = buildRows(responses)
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

    // Header
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('TRUE', 14, 18)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Survey Report — ${slug.replace(/-/g, ' ').toUpperCase()}`, 14, 26)
    doc.text(`${rows.length} responses — Exported ${new Date().toLocaleDateString('en-GB')}`, 14, 32)

    if (rows.length > 0) {
      const headers = Object.keys(rows[0])
      const body = rows.map(r => headers.map(h => r[h] || ''))
      autoTable(doc, {
        head: [headers],
        body,
        startY: 38,
        styles: { fontSize: 6, cellPadding: 2 },
        headStyles: { fillColor: [200, 169, 110], textColor: [9, 8, 12], fontStyle: 'bold', fontSize: 6 },
        alternateRowStyles: { fillColor: [245, 240, 232] },
        margin: { left: 14, right: 14 },
      })
    }

    doc.save(`${slug}-export.pdf`)
  }

  const exportCSV = () => {
    window.open(`${API_URL}/admin/export?form=${slug}`, '_blank')
  }

  const s = {
    page: { minHeight:'100dvh', background:'var(--black)', padding:'40px 24px' },
    container: { maxWidth:'900px', margin:'0 auto' },
    header: { marginBottom:'40px' },
    logo: { fontFamily:"'Roboto', sans-serif", fontWeight:900, fontSize:'24px', letterSpacing:'.18em', color:'var(--white)', textDecoration:'none' },
    back: { fontFamily:"'Roboto Mono', monospace", fontSize:'9px', letterSpacing:'.15em', textTransform:'uppercase', color:'var(--gold)', textDecoration:'none', display:'inline-block', marginBottom:'16px' },
    title: { fontFamily:"'Roboto', sans-serif", fontWeight:900, fontSize:'clamp(24px, 4vw, 36px)', textTransform:'uppercase', color:'var(--white)', marginBottom:'8px' },
    meta: { fontFamily:"'Roboto Mono', monospace", fontSize:'10px', letterSpacing:'.12em', color:'var(--gray)', textTransform:'uppercase' },
    actions: { display:'flex', gap:'10px', marginTop:'20px', flexWrap:'wrap' },
    btn: { fontFamily:"'Roboto Mono', monospace", fontSize:'9px', letterSpacing:'.18em', textTransform:'uppercase', padding:'10px 20px', cursor:'pointer', border:'1px solid rgba(200,169,110,.3)', background:'transparent', color:'var(--gold)', transition:'all .25s' },
    table: { width:'100%', borderCollapse:'collapse', marginTop:'24px' },
    th: { fontFamily:"'Roboto Mono', monospace", fontSize:'8px', letterSpacing:'.22em', textTransform:'uppercase', color:'var(--gold)', textAlign:'left', padding:'12px 14px', borderBottom:'1px solid rgba(200,169,110,.15)' },
    td: { fontFamily:"'Roboto Mono', monospace", fontSize:'11px', color:'var(--white)', padding:'14px', borderBottom:'1px solid rgba(200,169,110,.06)' },
    tdGray: { fontFamily:"'Roboto Mono', monospace", fontSize:'10px', color:'var(--gray)', padding:'14px', borderBottom:'1px solid rgba(200,169,110,.06)' },
    row: { cursor:'pointer', transition:'background .2s' },
    pager: { display:'flex', justifyContent:'center', gap:'8px', marginTop:'24px' },
    pageBtn: { fontFamily:"'Roboto Mono', monospace", fontSize:'10px', padding:'8px 14px', border:'1px solid rgba(200,169,110,.2)', background:'transparent', color:'var(--gray)', cursor:'pointer' },
    pageBtnActive: { background:'var(--gold)', color:'var(--black)', borderColor:'var(--gold)' },
    statCard: { background:'var(--dark)', border:'1px solid rgba(200,169,110,.1)', padding:'20px', marginBottom:'3px' },
    statQ: { fontFamily:"'Roboto Mono', monospace", fontSize:'10px', color:'var(--gray)', textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'10px' },
    statBar: { display:'flex', height:'6px', background:'rgba(245,240,232,.05)', marginBottom:'4px', overflow:'hidden' },
    statLabel: { fontFamily:"'Roboto Mono', monospace", fontSize:'9px', color:'var(--gray)', display:'flex', justifyContent:'space-between' },
  }

  const ratingColors = ['#e74c3c', '#f39c12', '#27ae60', '#C8A96E']

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <Link to="/admin/dashboard" style={s.back}>← Dashboard</Link>
          <div style={s.title}>{slug.replace(/-/g, ' ')}</div>
          <div style={s.meta}>{data.total} responses</div>
          <div style={s.actions}>
            <button style={s.btn} onClick={() => setShowStats(!showStats)}>{showStats ? 'Hide Stats' : 'Show Stats'}</button>
            <button style={s.btn} onClick={exportXLSX}>Export XLSX ↓</button>
            <button style={s.btn} onClick={exportPDF}>Export PDF ↓</button>
            <button style={s.btn} onClick={exportCSV}>Export CSV ↓</button>
            {/* <Link to={`/admin/ai/${slug}`} style={{...s.btn, background:'var(--gold)', color:'var(--black)', textDecoration:'none'}}>AI Analysis ✦</Link> */}
          </div>
        </div>

        {showStats && stats && (
          <div style={{marginBottom:'40px'}}>
            <div style={{fontFamily:"'Roboto Mono', monospace", fontSize:'9px', letterSpacing:'.22em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'16px'}}>Statistics</div>
            {stats.ratings.map(r => (
              <div key={r.question_key} style={s.statCard}>
                <div style={s.statQ}>{r.question_text}</div>
                <div style={{fontFamily:"'Roboto', sans-serif", fontWeight:900, fontSize:'24px', color:'var(--gold)', marginBottom:'8px'}}>{parseFloat(r.avg_rating).toFixed(1)}<span style={{fontSize:'12px', color:'var(--gray)'}}> / 4</span></div>
                <div style={s.statBar}>
                  {[r.count_1, r.count_2, r.count_3, r.count_4].map((c, i) => (
                    <div key={i} style={{width:`${(c / r.response_count) * 100}%`, background:ratingColors[i]}} />
                  ))}
                </div>
                <div style={s.statLabel}>
                  <span>Bad ({r.count_1})</span>
                  <span>Avg ({r.count_2})</span>
                  <span>Good ({r.count_3})</span>
                  <span>Outstanding ({r.count_4})</span>
                </div>
              </div>
            ))}

            {stats.text_answers && stats.text_answers.length > 0 && (
              <div style={{marginTop:'24px'}}>
                <div style={{fontFamily:"'Roboto Mono', monospace", fontSize:'9px', letterSpacing:'.22em', textTransform:'uppercase', color:'var(--gold)', marginBottom:'16px'}}>Open Responses</div>
                {stats.text_answers.map(tq => (
                  <div key={tq.question_key} style={s.statCard}>
                    <div style={s.statQ}>{tq.question_text}</div>
                    <div style={{display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'16px'}}>
                      {Object.entries(tq.keywords).map(([word, count]) => {
                        const max = Object.values(tq.keywords)[0] || 1
                        const opacity = 0.3 + (count / max) * 0.7
                        return (
                          <span key={word} style={{
                            fontFamily:"'Roboto Mono', monospace", fontSize:'10px', letterSpacing:'.06em',
                            padding:'5px 10px', background:`rgba(200,169,110,${opacity * 0.15})`,
                            border:`1px solid rgba(200,169,110,${opacity * 0.4})`,
                            color:`rgba(245,240,232,${opacity})`, textTransform:'uppercase',
                          }}>
                            {word} <span style={{color:'var(--gold)', fontWeight:700, marginLeft:'4px'}}>{count}</span>
                          </span>
                        )
                      })}
                    </div>
                    <div style={{maxHeight:'300px', overflowY:'auto'}}>
                      {tq.answers.map((a, i) => (
                        <div key={i} style={{
                          fontFamily:"'Roboto Mono', monospace", fontSize:'11px', lineHeight:1.7,
                          color:'rgba(245,240,232,.55)', padding:'10px 0',
                          borderBottom:'1px solid rgba(200,169,110,.05)',
                        }}>
                          "{a}"
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div style={{textAlign:'center', color:'var(--gray)', fontFamily:"'Roboto Mono', monospace", fontSize:'11px', textTransform:'uppercase'}}>Loading...</div>
        ) : (
          <>
            {isMobile ? (
              <div style={{display:'flex', flexDirection:'column', gap:'3px'}}>
                {data.submissions.map(sub => (
                  <div key={sub.id} onClick={() => navigate(`/admin/response/${sub.id}`)}
                    style={{background:'var(--dark)', border:'1px solid rgba(200,169,110,.1)', padding:'18px 16px', cursor:'pointer', transition:'border-color .2s'}}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,169,110,.35)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(200,169,110,.1)'}>
                    <div style={{fontFamily:"'Roboto', sans-serif", fontWeight:700, fontSize:'14px', color:'var(--white)', marginBottom:'4px'}}>{sub.respondent_name}</div>
                    <div style={{fontFamily:"'Roboto Mono', monospace", fontSize:'10px', color:'var(--gray)', marginBottom:'2px'}}>{sub.respondent_email}</div>
                    <div style={{fontFamily:"'Roboto Mono', monospace", fontSize:'10px', color:'var(--gray)', display:'flex', justifyContent:'space-between', marginTop:'8px'}}>
                      <span>{sub.respondent_company}{sub.respondent_role ? ` · ${sub.respondent_role}` : ''}</span>
                      <span style={{color:'var(--gold)'}}>{new Date(sub.submitted_at).toLocaleDateString('en-GB')}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>Name</th>
                    <th style={s.th}>Email</th>
                    <th style={s.th}>Company</th>
                    <th style={s.th}>Role</th>
                    <th style={s.th}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.submissions.map(sub => (
                    <tr key={sub.id} style={s.row}
                      onClick={() => navigate(`/admin/response/${sub.id}`)}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,169,110,.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={s.td}>{sub.respondent_name}</td>
                      <td style={s.tdGray}>{sub.respondent_email}</td>
                      <td style={s.tdGray}>{sub.respondent_company}</td>
                      <td style={s.tdGray}>{sub.respondent_role}</td>
                      <td style={s.tdGray}>{new Date(sub.submitted_at).toLocaleDateString('en-GB')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {data.pages > 1 && (
              <div style={s.pager}>
                {Array.from({ length: data.pages }, (_, i) => (
                  <button key={i} style={{...s.pageBtn, ...(page === i+1 ? s.pageBtnActive : {})}}
                    onClick={() => fetchData(i+1)}>{i+1}</button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
