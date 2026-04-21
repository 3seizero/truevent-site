import { asset } from '../config'

const SURVEY = 'https://survey.truevent.eu'

export default function Fullbleed() {
  return (
    <div className="fullbleed">
      <div className="fb-img"><img src={asset('assets/img/fullbleed-event.jpg')} alt="TRUE Event" loading="lazy"/></div>
      <div className="fb-ov"></div>
      <div className="fb-content">
        <div className="label rv" style={{marginBottom:'20px'}}>Be Part of TRUE</div>
        <h2 className="h2 rv d1">
          CHOOSE<br/>YOUR<br/><span className="gold">PATH</span>
        </h2>
        <p className="body rv d2" style={{maxWidth:'380px',marginTop:'22px',marginBottom:'32px'}}>
          WHETHER YOU ARE A HOTELIER, A TRAVEL ADVISOR OR A BRAND PARTNER —
          TRUE OFFERS A SPACE WHERE YOUR STORY CAN BE HEARD AND FELT.
        </p>
        <div className="rv d3" style={{display:'flex',gap:'12px',flexWrap:'wrap'}}>
          <a href={`${SURVEY}/2026/exhibitor-application`} target="_blank" rel="noreferrer" className="btn btn-gold">Become an Exhibitor →</a>
          <a href={`${SURVEY}/2026/buyer-application`} target="_blank" rel="noreferrer" className="btn btn-wht">Apply as Buyer</a>
        </div>
      </div>
    </div>
  )
}
