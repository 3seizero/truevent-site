import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }

  const toggle = () => {
    const next = !menuOpen
    setMenuOpen(next)
    document.body.style.overflow = next ? 'hidden' : ''
  }

  return (
    <>
      <div id="overlay" className={menuOpen ? 'open' : ''}>
        <nav className="ov-nav">
          <a className="ov-link" href="#about" onClick={close}>About</a>
          <a className="ov-link" href="#destinations" onClick={close}>Destinations</a>
          <a className="ov-link" href="#participate" onClick={close}>Join</a>
          <a className="ov-link" href="#program" onClick={close}>Program</a>
          <a className="ov-link" href="#team" onClick={close}>Team</a>
          <a className="ov-link" href="#partners" onClick={close}>Partners</a>
        </nav>
        <div className="ov-bottom">
          <Link to="/apply/exhibitor" className="btn btn-gold" onClick={close}>Apply as Exhibitor →</Link>
          <Link to="/apply/buyer" className="btn btn-wht" onClick={close}>Apply as Buyer</Link>
        </div>
        <div className="ov-label">truevnt — truevent.eu</div>
      </div>

      <header id="nav" className={scrolled ? 'scrolled' : ''}>
        <Link to="/" className="nav-logo">TRUE</Link>
        <button className={`hamburger${menuOpen ? ' open' : ''}`} onClick={toggle} aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>
    </>
  )
}
