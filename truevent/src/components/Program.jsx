const SURVEY = 'https://survey.truevent.eu'

const DAYS = [
  { n: 'Day 1', date: 'Arrival Day, Icebreaker and Opening Party', desc: 'CHECK-IN AND WELCOME. ICEBREAKER EVENING: AN INFORMAL FIRST GATHERING TO MEET FELLOW PARTICIPANTS OVER FOOD, WINE AND THE SPIRIT OF THE DESTINATION.' },
  { n: 'Day 2', date: 'Networking Day and Destination Party', desc: 'FULL DAY OF SCHEDULED ONE-TO-ONE B2B APPOINTMENTS BETWEEN EXHIBITORS AND BUYERS. FIRST OFFICIAL EVENING EVENT HOSTED IN AN ICONIC DESTINATION VENUE.', delay: 'd1' },
  { n: 'Day 3', date: 'Networking Day and Closing Party', desc: 'SECOND DAY OF CURATED B2B APPOINTMENTS. AFTERNOON DESTINATION EXPERIENCE. CLOSING GALA EVENING WITH NETWORKING COCKTAIL AND DINNER.', delay: 'd2' },
  { n: 'Day 4', date: 'Departure Day', desc: 'FAREWELL BREAKFAST. CHECK-OUT AND DEPARTURE. OPTIONAL DESTINATION EXTENSION AVAILABLE ON REQUEST FOR THOSE WHO WISH TO STAY AND EXPLORE.', delay: 'd3' },
]

export default function Program() {
  return (
    <section id="program" className="sec">
      <div className="label rv" style={{marginBottom:'22px'}}>Event Program</div>
      <h2 className="h2 rv d1">HOW<br/><span className="gold">TRUE</span><br/>WORKS</h2>
      <div className="prog-grid">
        <div>
          <div className="prog-stats">
            <div className="rv d1"><div className="ps-n">4</div><div className="ps-l">Days</div></div>
            <div className="rv d2"><div className="ps-n">2</div><div className="ps-l">B2B Days</div></div>
            <div className="rv d3"><div className="ps-n">3</div><div className="ps-l">Dinner Parties</div></div>
          </div>
          <p className="body rv d2" style={{marginBottom:'32px'}}>
            EACH TRUE EDITION IS A CURATED FOUR-DAY EXPERIENCE. BUYERS AND EXHIBITORS MEET
            THROUGH A STRUCTURED SCHEDULE OF FACE-TO-FACE APPOINTMENTS, WHILE IMMERSIVE
            EVENING EVENTS BRING THE HOST DESTINATION TO LIFE — TURNING EVERY ENCOUNTER
            INTO A STORY WORTH TELLING.
          </p>
          <a href={`${SURVEY}/2026/buyer-application`} target="_blank" rel="noreferrer" className="btn btn-gold rv d3">Apply to Attend →</a>
        </div>
        <div className="days">
          {DAYS.map(d => (
            <div key={d.n} className={`day rv ${d.delay || ''}`}>
              <div className="day-n label">{d.n}</div>
              <div>
                <div className="day-date label-gray">{d.date}</div>
                <div className="day-desc">{d.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
