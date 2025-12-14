# CLAUDE.md - Purrse

Purrse is een digitale portemonnee voor loyaltypasjes. Geen plastic meer, alle pasjes scanbaar in één app.

## Waarom dit project?

Te veel plastic pasjes in de portemonnee. Purrse vervangt ze door scanbare barcodes/QR-codes in één overzicht, met favorieten bovenaan.

## Tech stack

- **Type**: PWA (Progressive Web App)
- **Framework**: Vanilla JS + Vite
- **Data opslag**: IndexedDB (lokaal, offline-first)
- **Scanner**: QuaggaJS of html5-qrcode voor barcode scanning
- **Hosting**: GitHub Pages (later, na lokaal testen)
- **Design**: Poezenthema met opstartanimatie

## Kernfunctionaliteit

### MVP (Fase 1)
- [ ] Pasjes toevoegen via camera scanner
- [ ] Pasjes handmatig toevoegen (fallback)
- [ ] Lijst van alle pasjes met barcode weergave
- [ ] Favorieten bovenaan pinnen
- [ ] Volledig offline werkend

### Later (Fase 2+)
- [ ] Database met bekende winkels (logo's, kleuren)
- [ ] Categorieën (optioneel)
- [ ] Cloud backup (optioneel)
- [ ] Export/import functie

## Commands

```bash
npm run dev      # Lokale development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Code quality check
npm run test     # Run tests
```

## Lokaal testen

### Desktop browser
```bash
npm run dev
# Open http://localhost:5173
```

### iPhone 13 simulatie (Safari Responsive Design Mode)
1. Open Safari
2. Develop menu → Enter Responsive Design Mode (⌥⌘R)
3. Kies iPhone 13 uit de device lijst
4. Test touch interacties en camera permissies

### Xcode iOS Simulator (uitgebreider testen)
```bash
# Start simulator
open -a Simulator
# Kies iPhone 13 in: File → Open Simulator → iOS → iPhone 13
# Open http://localhost:5173 in Safari binnen simulator
```

### PWA testen op echte iPhone
```bash
# Start dev server met netwerk toegang
npm run dev -- --host
# Scan QR code of typ IP adres op iPhone
# Voeg toe aan homescreen om als PWA te testen
```

## Architectuur

```
purrse/
├── public/
│   ├── icons/           # App icons + poezenanimatie assets
│   └── manifest.json    # PWA manifest
├── src/
│   ├── components/      # UI componenten
│   │   ├── CardList.js
│   │   ├── CardItem.js
│   │   ├── Scanner.js
│   │   └── AddCardForm.js
│   ├── services/
│   │   ├── db.js        # IndexedDB wrapper
│   │   └── scanner.js   # Barcode scanner service
│   ├── utils/
│   │   └── barcodes.js  # Barcode type detectie
│   ├── styles/
│   │   └── main.css
│   ├── app.js           # Main app logic
│   └── main.js          # Entry point
├── sw.js                # Service Worker (offline)
└── index.html
```

## Data model

```javascript
// IndexedDB schema
const card = {
  id: 'uuid',
  name: 'Albert Heijn',        // Winkelnaam
  barcode: '2900012345678',    // Barcode nummer
  barcodeType: 'EAN13',        // Type: EAN13, QR, CODE128, etc.
  logo: null,                  // Base64 of URL (optioneel)
  color: '#00A0E2',            // Kaartkleur (optioneel)
  favorite: false,             // Favoriet ja/nee
  createdAt: '2025-12-14',
  lastUsed: '2025-12-14'
};
```

## Design richtlijnen

- **Thema**: Poezenthema (Susan werkt dit uit)
- **Opstartanimatie**: Korte, vrolijke poezenanimatie
- **Kleurpalet**: Wordt bepaald door Susan, passend bij poezenthema
- **Offline indicator**: Duidelijk zichtbaar wanneer offline
- **Toegankelijkheid**: WCAG AA compliant (Judy checkt)

## Referentie apps

- [Catima](https://catima.app/) - Open source, simpel
- [Stocard](https://stocardapp.com/) - Commercieel, feature-rijk

## Deployment (later)

Pas deployen naar GitHub Pages wanneer:
- [ ] MVP lokaal getest en werkend
- [ ] Getest op iPhone (simulator of echt device)
- [ ] Alle tests slagen
- [ ] Build slaagt

```bash
# Deployment workflow (wanneer klaar)
git checkout -b feat/mvp
npm run lint && npm run test && npm run build
npm run preview  # Test build lokaal
# Na review: merge naar main → auto-deploy naar GitHub Pages
```

## Team

| Agent | Rol |
|-------|-----|
| Johanna | Product Owner - feature prioritering |
| Susan | UI Designer - poezenthema uitwerken |
| Judy | Accessibility - WCAG compliance |
| Sophie | Frontend Developer - implementatie |
| Emmy | Performance - offline & snelheid |

---

**Laatste update**: December 2025
