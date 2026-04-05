const MEMBERS = [
  { init: 'LDS', name: 'Luigi De Santis', role: 'Founder & Managing Director' },
  { init: 'FDS', name: 'Francesco De Santis', role: 'Director of Sales', delay: 'd1' },
  { init: 'DB', name: 'Dominique Barbeau', role: 'Director of Events', delay: 'd2' },
  { init: 'CCC', name: 'Carlo Contino Circolone', role: 'Director of Marketing, Brand & Digital Operations', delay: 'd3' },
  { init: 'AA', name: 'Alessandro Alei', role: 'Director of Logistic', delay: 'd1' },
  { init: 'TC', name: 'Tatiana Colonna', role: 'Buyer & Exhibitors Relations Coordinator', delay: 'd2' },
  { init: 'SG', name: 'Sara Gaballo', role: 'Sales Coordinator', delay: 'd3' },
]

export default function Team() {
  return (
    <section id="team" className="sec">
      <div className="label label-dark rv" style={{marginBottom:'22px'}}>The Team</div>
      <h2 className="h2 rv d1" style={{color:'var(--black)'}}>
        PEOPLE<br/>BEHIND<br/>TRUE
      </h2>
      <p className="rv d2" style={{marginTop:'20px',fontFamily:"'Roboto Mono',monospace",fontSize:'10px',letterSpacing:'.06em',textTransform:'uppercase',color:'rgba(0,0,0,.45)',maxWidth:'440px',lineHeight:1.9}}>
        A CLOSE-KNIT TEAM OF HOSPITALITY PROFESSIONALS, CREATIVES AND STRATEGISTS
        WHO SHARE ONE MISSION: TO DESIGN EXPERIENCES WHERE BUSINESS FEELS HUMAN.
      </p>
      <div className="team-grid">
        {MEMBERS.map(m => (
          <div key={m.init} className={`tc rv ${m.delay || ''}`}>
            <div className="tc-init">{m.init}</div>
            <div className="tc-name">{m.name}</div>
            <div className="tc-role">{m.role}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
