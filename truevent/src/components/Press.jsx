const LOGOS = [
  { src: '/assets/img/press-corriere.svg', alt: 'Corriere della Sera' },
  { src: '/assets/img/press-repubblica.svg', alt: 'Repubblica' },
  { src: '/assets/img/press-messaggero.svg', alt: 'Il Messaggero' },
  { src: '/assets/img/press-forbes.svg', alt: 'Forbes Italia' },
  { src: '/assets/img/press-travelleisure.svg', alt: 'Travel & Leisure' },
  { src: '/assets/img/press-theitalyinsider-1.svg', alt: 'The Italy Insider' },
  { src: '/assets/img/press-thetravelnews.svg', alt: 'The Travel News' },
  { src: '/assets/img/press-hoteldomani.svg', alt: 'Hotel Domani' },
  { src: '/assets/img/press-guidaviaggi.svg', alt: 'Guida Viaggi' },
  { src: '/assets/img/press-travelquotidiano.svg', alt: 'Travel Quotidiano' },
  { src: '/assets/img/press-sowinesofood.svg', alt: 'So Wine So Food' },
]

export default function Press() {
  const items = [...LOGOS, ...LOGOS]
  return (
    <section id="press" className="sec-slim">
      <div className="label rv" style={{marginBottom:'22px'}}>As Featured In</div>
      <h2 className="h2 rv d1">THE WORLD<br/>IS <span className="gold">WATCHING</span></h2>
      <div className="mq-wrap">
        <div className="mq-track">
          {items.map((l, i) => (
            <div key={i} className="mq-item">
              <img src={l.src} alt={l.alt}/>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
