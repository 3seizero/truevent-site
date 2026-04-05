import { Link } from 'react-router-dom'

export default function About() {
  return (
    <section id="about" className="sec">
      <div className="label rv" style={{marginBottom:'22px'}}>About TRUE</div>
      <h2 className="h2 rv d1">
        WHERE<br/>
        TRAVEL MEETS<br/>
        <span className="gold">MEANING</span>
      </h2>
      <div className="about-top">
        <div className="rv d2 body-lg">
          <p style={{marginBottom:'20px'}}>
            TRUE IS A <strong style={{color:'var(--white)',fontWeight:400}}>NEW WAY OF LOOKING AT LUXURY TRAVEL.</strong>{' '}
            MORE THAN A TRADE SHOW — A CURATED B2B PLATFORM WHERE ITALY'S MOST REMARKABLE
            HOSPITALITY BRANDS MEET THE WORLD'S MOST INFLUENTIAL TRAVEL ADVISORS, MEDIA AND PARTNERS.
          </p>
          <p style={{marginBottom:'20px'}}>
            EVERY EDITION UNFOLDS INSIDE <strong style={{color:'var(--white)',fontWeight:400}}>LIVING LANDSCAPES,
            HISTORIC TOWNS, VILLAS, HOTELS AND RESORTS</strong> — NEVER IN ANONYMOUS HALLS.
            BUSINESS IS DRIVEN BY MEANING; RELATIONSHIPS BY SHARED EXPERIENCE.
          </p>
          <p>
            WHAT STARTED IN ITALY HAS GROWN INTO A MOVEMENT THAT CELEBRATES CULTURE
            THROUGH CONNECTION AND ELEVATES THE WAY THE WORLD DISCOVERS DESTINATIONS.
          </p>
          <div style={{marginTop:'36px',display:'flex',gap:'12px',flexWrap:'wrap'}}>
            <Link to="/apply/exhibitor" className="btn btn-gold">Join TRUE →</Link>
            <a href="#destinations" className="btn btn-wht">See Editions</a>
          </div>
        </div>
        <div className="about-quote rv d3">
          "WE CREATE THE VIBES, THE STORIES, THE CONNECTIONS — YOU CLOSE THE DEAL."
        </div>
      </div>
      <div className="about-vals">
        <div className="val rv">
          <div className="val-n label">01</div>
          <div className="val-title">Emotion</div>
          <div className="val-desc">Every encounter is designed to move you. Business happens when people feel something real.</div>
        </div>
        <div className="val rv d2">
          <div className="val-n label">02</div>
          <div className="val-title">Connection</div>
          <div className="val-desc">Relationships built in context last. TRUE creates the setting — you write the story.</div>
        </div>
        <div className="val rv d3">
          <div className="val-n label">03</div>
          <div className="val-title">Purpose</div>
          <div className="val-desc">Every edition celebrates territory, culture and the people who keep authenticity alive.</div>
        </div>
      </div>
    </section>
  )
}
