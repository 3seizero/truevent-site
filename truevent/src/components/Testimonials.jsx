const QUOTES = [
  { text: "TRUE ALLOWS US TO SHOW OUR PROPERTY EXACTLY AS OUR GUESTS EXPERIENCE IT — THROUGH LIGHT, FLAVOUR, SOUND AND HUMAN CONNECTION. THE RELATIONSHIPS WE BUILD HERE FEEL GENUINE AND LONG-LASTING.", author: 'Exhibitor', role: 'Luxury Resort in Puglia' },
  { text: "IN JUST A FEW DAYS WE DISCOVER DESTINATIONS, PEOPLE AND PROPERTIES THAT WOULD NORMALLY TAKE MONTHS OF TRAVEL. TRUE FEELS CURATED, HUMAN AND DEEPLY INSPIRING.", author: 'Senior Travel Advisor', role: 'United Kingdom', delay: 'd2' },
  { text: "AS A PARTNER, TRUE GIVES US THE OPPORTUNITY TO ACTIVATE OUR BRAND IN A CONTEXT THAT TRULY REFLECTS OUR VALUES — THOUGHTFUL, DESIGN-LED AND EXPERIENCE-DRIVEN.", author: 'Strategic Partner', role: 'Global Hospitality Brand', delay: 'd3' },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="sec" style={{background:'var(--dark)'}}>
      <div className="label rv" style={{marginBottom:'22px'}}>Voices</div>
      <h2 className="h2 rv d1">WHAT THEY<br/>SAY ABOUT<br/><span className="gold">TRUE</span></h2>
      <div className="testi-grid">
        {QUOTES.map((q, i) => (
          <div key={i} className={`tcard rv ${q.delay || ''}`}>
            <div className="tq">"</div>
            <div className="tt">{q.text}</div>
            <div className="ta">{q.author}</div>
            <div className="tr">{q.role}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
