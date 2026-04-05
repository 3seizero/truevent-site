const GROUPS = [
  { label: 'Institutional Partners', logos: [
    { src: '/assets/partners/puglia.svg', alt: 'Puglipromozione' },
    { src: '/assets/partners/comunepalermo.svg', alt: 'Comune di Palermo' },
    { src: '/assets/partners/altabadia.svg', alt: 'Alta Badia' },
  ]},
  { label: 'Official DMCs', delay: 'd1', logos: [
    { src: '/assets/partners/essence.svg', alt: 'Essence of Sicily' },
    { src: '/assets/partners/dream.svg', alt: 'Dream Beyond' },
    { src: '/assets/partners/fatravel.svg', alt: 'FA Travel' },
    { src: '/assets/partners/indigenus.svg', alt: 'Indigenus' },
  ]},
  { label: 'Main Partners', delay: 'd2', logos: [
    { src: '/assets/partners/blastness.svg', alt: 'Blastness' },
    { src: '/assets/partners/flywire.svg', alt: 'Flywire' },
    { src: '/assets/partners/neos.svg', alt: 'Neos' },
    { src: '/assets/partners/skyalps.svg', alt: 'SkyAlps' },
    { src: '/assets/partners/autentico.svg', alt: 'Autentico Hotels' },
  ]},
  { label: 'Logistic Partner', delay: 'd3', logos: [
    { src: '/assets/partners/primerent.svg', alt: 'Primerent' },
  ]},
]

export default function Partners() {
  return (
    <section id="partners" className="sec">
      <div className="label rv" style={{marginBottom:'22px'}}>Our Partners</div>
      <h2 className="h2 rv d1">WHO MAKES<br/><span className="gold">TRUE</span><br/>POSSIBLE</h2>
      <div style={{marginTop:'60px'}}>
        {GROUPS.map(g => (
          <div key={g.label} className={`pg rv ${g.delay || ''}`}>
            <div className="pg-lbl">{g.label}</div>
            <div className="pg-row">
              {g.logos.map(l => (
                <img key={l.alt} className="pi-logo" src={l.src} alt={l.alt}/>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
