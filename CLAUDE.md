# TRUE Event — Restyling 2026

## Descrizione
Restyling completo del sito truevent.eu — piattaforma B2B luxury travel per eventi curated in Italia.
Struttura a crescita: da sito pubblico a ecosistema completo con landing pages, form, area riservata
con contratti, backend per gestione contenuti.

## Struttura cartelle
Restyling-2026/
├── truevent-v4.html           # Template originale HTML/CSS/JS (prima iterazione)
├── assets/                    # Asset sorgenti (img, video, partners SVG)
│   ├── img/
│   ├── video/
│   └── partners/
├── truevent/                  # Progetto Vite React (MODIFICARE QUI)
│   ├── src/
│   │   ├── App.jsx            # Router principale
│   │   ├── main.jsx           # Entry point (BrowserRouter basename="/restyling")
│   │   ├── config.js          # Helper asset() con BASE_URL
│   │   ├── components/        # Navbar, Hero, About, Destinations, ecc.
│   │   ├── pages/Home.jsx
│   │   └── styles/global.css  # Tutti gli stili
│   ├── public/assets/         # Asset statici copiati (NON modificare direttamente)
│   └── vite.config.js         # base: '/restyling/'
├── dist/                      # Deploy — file compilati copiati qui (non buildati automaticamente)
├── index.html                 # Entry point deploy (copia di truevent/dist/index.html)
└── assets/index-*.{js,css}    # Bundle compilato per deploy

## Workflow per modifiche
```
cd truevent
# modifica src/...
npm run build
cd ..
cp truevent/dist/index.html .
rm -f assets/index-*.js assets/index-*.css
cp truevent/dist/assets/index-*.js assets/
cp truevent/dist/assets/index-*.css assets/
git add -A && git commit -m "..." && git push
```
Poi su Plesk: pull manuale (il webhook automatico non è configurato).

## Stack tecnico
- **Frontend**: React 19 + Vite + react-router-dom
- **Font**: Roboto + Roboto Mono (Google Fonts)
- **Routing**: BrowserRouter con `basename="/restyling"` (deploy in sottocartella)
- **Base path**: `/restyling/` in vite.config.js — tutti gli asset passano per `config.js::asset()`
- **Deploy**: GitHub (3seizero/truevent-site, pubblica) → Plesk su truevent.eu/restyling/
- **Backend futuro**: Firebase o Supabase (auth, db, cloud functions per email/PDF)

## Palette colori
- Black: #09080C
- White: #F5F0E8
- Gold: #C8A96E
- Gold light: #DFC898
- Gray: #78706A
- Dark: #101018
- Mid: #18171E

## URL e repo
- Sito live: https://truevent.eu/restyling/
- GitHub: https://github.com/3seizero/truevent-site (pubblica)
- Sito originale di riferimento: https://truevent.eu

## Sezioni homepage (componenti)
1. Navbar (hamburger + overlay)
2. Hero (video background desktop/mobile + fallback PNG)
3. About (intro + 3 valori)
4. PhotoBand (4 foto — ancora placeholder Unsplash, da sostituire)
5. Destinations (4 card: Puglia, Dolomites, Sardegna, Sicily)
6. Fullbleed CTA
7. Participate (3 card: Exhibitors, Buyers, Partners)
8. Program (stats + 4 days)
9. Team (7 membri, hover oro sulle iniziali)
10. Press (marquee con 11 loghi SVG)
11. Testimonials (3 quote)
12. Partners (4 gruppi con loghi SVG reali)
13. Footer (logo, social IG+LinkedIn con icone, badge App Store + Google Play)

## Roadmap
### Fase attuale (sito pubblico)
- [x] Homepage con tutte le sezioni
- [x] Video hero desktop/mobile
- [x] Loghi press SVG (bianchi filter invert)
- [x] Loghi partner SVG
- [x] Deploy su /restyling/
- [ ] Sostituire 4 foto Photo Band (da mettere in truevent/public/assets/img/ come photoband-01..04)
- [ ] Pagine destinazioni (landing per Puglia, Dolomites, Sardegna, Sicily)

### Fase successiva (form + backend)
- [ ] Form Apply as Exhibitor/Buyer/Partner con validazione
- [ ] Invio email (autoresponder + admin) — Resend/SendGrid o Firebase Functions
- [ ] Generazione PDF contratti allegati alle email — @react-pdf/renderer
- [ ] Area riservata con accesso password — Firebase Auth
- [ ] Form composizione contratti partecipazione
- [ ] Pannello admin: gestione richieste, stati avanzamento contratti
- [ ] CMS leggero per contenuti testuali delle pagine

### Fase finale
- [ ] Migrazione dominio a mercatomaglie.it  (✗ TRUE dominio truevent.eu)
- [ ] Analytics, SEO, privacy/cookie completi

## Note importanti
- **TUTTI i path asset** devono passare per `asset()` da `config.js` — mai `/assets/...` hardcoded
- **Rebuild obbligatorio** dopo ogni modifica a src/ — vedi workflow sopra
- **Plesk non fa pull automatico**: va triggerato manualmente dopo ogni push (webhook da configurare)
- **Non modificare** direttamente `truevent/public/assets/` — sono copie dai sorgenti
- **Foto Photo Band** sono ancora placeholder Unsplash, sostituirle quando arrivano i file reali

## Team (per contesto)
- Luigi De Santis — Founder & Managing Director
- Francesco De Santis — Director of Sales
- Dominique Barbeau — Director of Events
- Carlo Contino Circolone (CCC) — Director of Marketing, Brand & Digital Operations (utente)
- Alessandro Alei — Director of Logistic
- Tatiana Colonna — Buyer & Exhibitors Relations Coordinator
- Sara Gaballo — Sales Coordinator
