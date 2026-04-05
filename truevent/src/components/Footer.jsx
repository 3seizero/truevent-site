import { Link } from 'react-router-dom'

const AppStoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/>
    <path d="M16.5 12.5L12 8l-4.5 4.5M12 8v8"/>
  </svg>
)

const PlayStoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18l18-9L3 3z"/>
  </svg>
)

const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <img src="/assets/img/logo.png" alt="TRUE" style={{height:'36px',width:'auto',marginBottom:'8px'}}/>
          <div className="f-tag">YOU CAN'T TELL THE STORIES YOU DON'T LIVE.<br/>CURATED LUXURY TRAVEL EVENTS — ITALY & BEYOND.</div>
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap',alignItems:'center',marginTop:'4px'}}>
            <a href="https://www.instagram.com/truevnt" target="_blank" rel="noreferrer" className="btn btn-wht" style={{display:'inline-flex',fontSize:'9px',gap:'6px'}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              Instagram ↗
            </a>
            <a href="https://linkedin.com/company/true-event-ps/" target="_blank" rel="noreferrer" className="btn btn-wht" style={{display:'inline-flex',fontSize:'9px',gap:'6px'}}>
              <LinkedInIcon /> LinkedIn ↗
            </a>
          </div>
          <div style={{display:'flex',gap:'10px',marginTop:'14px'}}>
            <a href="https://truevent.eu/downloads/get-the-app.html" target="_blank" rel="noreferrer" style={{opacity:.5,transition:'opacity .3s'}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=.5}>
              <svg width="120" height="40" viewBox="0 0 120 40" fill="none">
                <rect x=".5" y=".5" width="119" height="39" rx="5" stroke="rgba(245,240,232,.3)"/>
                <path d="M30.128 19.784a4.633 4.633 0 012.204-3.886 4.742 4.742 0 00-3.74-2.024c-1.566-.165-3.107.938-3.91.938-.817 0-2.052-.924-3.382-.896a4.978 4.978 0 00-4.193 2.558c-1.816 3.148-.462 7.77 1.28 10.314.875 1.244 1.9 2.63 3.236 2.58 1.308-.054 1.798-.832 3.378-.832 1.566 0 2.028.832 3.39.8 1.404-.022 2.29-1.252 3.13-2.508a10.479 10.479 0 001.434-2.916 4.464 4.464 0 01-2.827-4.128z" fill="#fff"/>
                <path d="M27.455 12.21a4.548 4.548 0 001.04-3.258 4.63 4.63 0 00-2.996 1.55 4.333 4.333 0 00-1.068 3.14 3.834 3.834 0 003.024-1.432z" fill="#fff"/>
                <text x="40" y="15" fill="#fff" fontFamily="Roboto,sans-serif" fontSize="7" fontWeight="400" letterSpacing=".03em">Download on the</text>
                <text x="40" y="27" fill="#fff" fontFamily="Roboto,sans-serif" fontSize="12" fontWeight="700">App Store</text>
              </svg>
            </a>
            <a href="https://truevent.eu/downloads/get-the-app.html" target="_blank" rel="noreferrer" style={{opacity:.5,transition:'opacity .3s'}} onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=.5}>
              <svg width="135" height="40" viewBox="0 0 135 40" fill="none">
                <rect x=".5" y=".5" width="134" height="39" rx="5" stroke="rgba(245,240,232,.3)"/>
                <path d="M13.54 11.66l9.88 5.7-3.04 3.04-10.02-5.78a1.2 1.2 0 010-2.08l3.18-1.88zm13.16 7.6l-3.28 3.28-13.06 7.52a1.2 1.2 0 01-1.2 0L7.1 28.94l9.6-9.68 10 .0zm-3.28-4.52L10.36 8.22 7.1 11.06l3.26 1.88a1.2 1.2 0 011.2 0l12.06 6.96 0-4.16zM6.1 12.38v15.24a1.2 1.2 0 000 .88l2.26-2.26V14.64L6.1 12.38z" fill="#fff" transform="translate(7,5) scale(.85)"/>
                <text x="42" y="15" fill="#fff" fontFamily="Roboto,sans-serif" fontSize="7" fontWeight="400" letterSpacing=".03em">GET IT ON</text>
                <text x="42" y="27" fill="#fff" fontFamily="Roboto,sans-serif" fontSize="12" fontWeight="700">Google Play</text>
              </svg>
            </a>
          </div>
        </div>
        <div>
          <div className="f-col-h">Destinations</div>
          <ul className="f-links">
            <li><Link to="/destinations/puglia">TRUE Puglia</Link></li>
            <li><Link to="/destinations/dolomites">TRUE Dolomites</Link></li>
            <li><Link to="/destinations/sardegna">TRUE Sardegna</Link></li>
            <li><Link to="/destinations/sicily">TRUE Sicily</Link></li>
          </ul>
        </div>
        <div>
          <div className="f-col-h">Participate</div>
          <ul className="f-links">
            <li><Link to="/apply/exhibitor">Become an Exhibitor</Link></li>
            <li><Link to="/apply/buyer">Apply as Buyer</Link></li>
            <li><Link to="/apply/partner">Partner with TRUE</Link></li>
          </ul>
        </div>
        <div>
          <div className="f-col-h">Legal</div>
          <ul className="f-links">
            <li><a href="https://www.truevent.eu/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a></li>
            <li><a href="#">Cookie Policy</a></li>
            <li><a href="#">Terms & Conditions</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="f-copy">© TRUE 2025. All rights reserved.</div>
        <div className="f-credit">Curated & developed by <span>REALLY TRUE</span></div>
      </div>
    </footer>
  )
}
