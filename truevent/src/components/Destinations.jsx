import { asset } from '../config'

const DESTS = [
  { slug: 'dolomites', tag: 'Mountain Chapter',  name: 'Dolomites', dates: 'Jun 2026', img: 'assets/img/dest-dolomiti.webp',  desc: 'DESIGN-LED RETREATS, ALPINE CULTURE AND SOFT ADVENTURE — A SLOWER APPROACH TO HIGH-ALTITUDE HOSPITALITY.' },
  { slug: 'sardegna',  tag: 'Coastal Chapter',   name: 'Sardegna',  dates: 'Sep 2026', img: 'assets/img/dest-sardegna.webp',  desc: 'RUGGED COASTLINES, CRYSTALLINE WATERS AND A DISTINCT ISLAND IDENTITY THAT GOES FAR BEYOND SUMMER.', delay: 'd1' },
  { slug: 'sicily',    tag: 'Island Stories',    name: 'Sicily',    dates: 'Nov 2026', img: 'assets/img/dest-sicilia.webp',   desc: 'LAYERS OF CULTURE, CUISINE AND LANDSCAPES WHERE EVERY ENCOUNTER FEELS CINEMATIC AND DEEPLY HUMAN.', delay: 'd2' },
]

export default function Destinations() {
  return (
    <section id="destinations">
      <div className="dest-head">
        <div className="label rv">True Destinations 2026</div>
        <div className="dest-intro">
          <h2 className="h2 rv d1">
            WHERE<br/>TRUE COMES<br/><span className="gold">TO LIFE</span>
          </h2>
          <p className="body rv d2" style={{maxWidth:'300px'}}>
            EACH EDITION IS ANCHORED IN ONE TERRITORY, EXPLORED SLOWLY AND IN DEPTH.
            HANDPICKED DESTINATIONS CHOSEN FOR THEIR IDENTITY AND POWER TO TURN
            EVERY MEETING INTO AN OPPORTUNITY.
          </p>
        </div>
      </div>
      <div className="dest-grid">
        {DESTS.map(d => (
          <div key={d.slug} className={`dest-card rv ${d.delay || ''}`}>
            <div className="dc-img"><img src={asset(d.img)} alt={d.name} loading="lazy"/></div>
            <div className="dc-ov"></div>
            <div className="dc-tag">{d.tag}</div>
            <div className="dc-arrow">↗</div>
            <div className="dc-body">
              <div className="dc-name">{d.name}</div>
              <div className="dc-dates">{d.dates}</div>
              <div className="dc-desc">{d.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export { DESTS }
