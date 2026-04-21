import { asset } from '../config'

const SURVEY = 'https://survey.truevent.eu'

export default function Hero() {
  return (
    <section id="hero">
      <div className="hero-bg">
        <div className="hero-fallback"></div>
        <video autoPlay muted loop playsInline poster={asset('assets/img/hero-fallback.png')}>
          <source src={asset('assets/video/hero-desktop.mp4')} media="(min-width: 769px)" type="video/mp4"/>
          <source src={asset('assets/video/hero-mobile.mp4')} type="video/mp4"/>
        </video>
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-grain"></div>
      <div className="hero-content">
        <h1 className="h1 hero-title">
          YOU CAN'T<br/>
          TELL THE<br/>
          STORIES YOU<br/>
          <span className="gold-text">DON'T LIVE.</span>
        </h1>
        <p className="body-lg hero-sub">
          CURATED B2B EXPERIENCES WHERE ITALY'S MOST REMARKABLE HOSPITALITY BRANDS
          MEET THE WORLD'S MOST INFLUENTIAL TRAVEL ADVISORS — THROUGH EMOTION, NOT EXHIBITION.
        </p>
        <div className="hero-row">
          <div className="hero-stats">
            <div><div className="stat-n">4</div><div className="stat-l">Destinations</div></div>
            <div><div className="stat-n">200+</div><div className="stat-l">Exhibitors</div></div>
            <div><div className="stat-n">1,500+</div><div className="stat-l">Buyers</div></div>
            <div><div className="stat-n">4</div><div className="stat-l">Editions / Year</div></div>
          </div>
          <div className="hero-actions">
            <a href={`${SURVEY}/2026/exhibitor-application`} target="_blank" rel="noreferrer" className="btn btn-gold">Apply Now →</a>
            <div className="scroll-ind">
              <div className="scroll-bar"></div>
              Scroll to explore
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
