# Purrse

Een digitale portemonnee voor loyaltypasjes. Geen plastic meer, alle pasjes scanbaar in één app.

## Features

- Pasjes scannen met je camera
- Handmatig pasjes toevoegen
- Favorieten bovenaan pinnen
- Werkt volledig offline
- Poezenthema met opstartanimatie

## Installatie

```bash
# Clone de repository
git clone https://github.com/mdubbelm/purrse.git
cd purrse

# Installeer dependencies
npm install

# Start development server
npm run dev
```

## Development

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build voor productie
npm run preview  # Preview productie build
npm run lint     # Check code kwaliteit
npm run test     # Run tests
```

## Testen op iPhone

### Safari Responsive Design Mode
1. `npm run dev`
2. Open Safari → Develop → Responsive Design Mode (⌥⌘R)
3. Kies iPhone 13

### Echte iPhone
```bash
npm run dev -- --host
# Open het IP adres op je iPhone
```

## Tech Stack

- Vanilla JavaScript
- Vite (build tool)
- IndexedDB (lokale opslag)
- Service Worker (offline)

## Licentie

MIT

---

*Purrse - omdat je portemonnee niet mag spinnen van al die plastic pasjes.*
