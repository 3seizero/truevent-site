import { Link } from 'react-router-dom'

const CARDS = [
  { icon: '◈', label: 'Exhibitors', name: 'PRESENT\nYOUR PROPERTY', desc: "A SELECTION OF ITALY'S FINEST HOTELS, EXCLUSIVE DMCS, VILLAS, CRUISES, PRIVATE JETS AND BESPOKE EXPERIENCES. MEET THE RIGHT BUYERS IN THE RIGHT SETTING — BUILD RELATIONSHIPS THAT CONVERT.", cta: 'Apply as Exhibitor →', to: '/apply/exhibitor' },
  { icon: '◉', label: 'Buyers', name: 'DISCOVER\nEXCELLENCE', desc: "HIGHLY SELECTED FRONTLINE TRAVEL ADVISORS FROM ENGLISH-SPEAKING MARKETS. DISCOVER PROPERTIES CURATED FOR QUALITY, NOT QUANTITY — AN IMMERSIVE EXPERIENCE DESIGNED FOR THE WORLD'S TOP ADVISORS.", cta: 'Apply as Buyer →', to: '/apply/buyer', delay: 'd2' },
  { icon: '◇', label: 'Partners', name: 'ALIGN\nYOUR BRAND', desc: "TOURISM BOARDS AND BRANDS PROMOTING THE BEST OF ITALY AND BEYOND. ALIGN YOUR PRESENCE WITH A FORMAT BUILT ON AUTHENTICITY, CONTENT AND COMMUNITY.", cta: 'Become a Partner →', to: '/apply/partner', delay: 'd3' },
]

export default function Participate() {
  return (
    <section id="participate" className="sec">
      <div className="label rv" style={{marginBottom:'22px'}}>The Summit</div>
      <h2 className="h2 rv d1">WHO MAKES<br/><span className="gold">TRUE</span></h2>
      <div className="part-grid">
        {CARDS.map(c => (
          <div key={c.label} className={`part-card rv ${c.delay || ''}`}>
            <div className="part-icon">{c.icon}</div>
            <div className="part-lbl label">{c.label}</div>
            <div className="part-name" style={{whiteSpace:'pre-line'}}>{c.name}</div>
            <div className="part-desc">{c.desc}</div>
            <Link to={c.to} className="btn btn-gld-o">{c.cta}</Link>
          </div>
        ))}
      </div>
    </section>
  )
}
