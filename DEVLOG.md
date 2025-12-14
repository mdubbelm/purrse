# DEVLOG - Purrse

Een chronologisch logboek van de ontwikkeling van Purrse, de digitale loyaltypasjes app met poezenthema. Bedoeld als basis voor een mogelijke blogserie.

---

## Dag 1 - Zaterdag 14 december 2025

### Het idee

Te veel plastic pasjes in mijn portemonnee. Albert Heijn, Kruidvat, HEMA, de bibliotheek, sportschool... Het past allemaal niet meer. Apps als Stocard en Catima bestaan al, maar waarom niet zelf bouwen?

### Discovery gesprek met Johanna (Product Owner)

Voordat ik ging bouwen, heb ik eerst met Johanna (de Product Owner agent) gespraat om helder te krijgen wat ik eigenlijk wil. Ze stelde me 10 vragen:

1. **Wat is het doel?** → Plastic pasjes vervangen door scanbare codes
2. **Platform?** → PWA (past bij mijn ervaring, geen App Store gedoe)
3. **Data opslag?** → Lokaal eerst, cloud later optioneel
4. **Pasjes toevoegen?** → Scanner + handmatig als backup
5. **Winkelinfo?** → Database bekende winkels + handmatig
6. **Categorieën?** → Niet nu, misschien later
7. **Favorieten?** → Ja, bovenaan pinnen
8. **Look & feel?** → Poezenthema! Met opstartanimatie
9. **Naam?** → Purrse (kat + portemonnee, snapje?)
10. **Offline?** → Absoluut, moet werken bij de kassa

### De naam: Purrse

Ik ben best trots op de naam. "Purr" (spinnen van een kat) + "purse" (portemonnee). Perfect voor een pasjes-app met poezenthema.

### Project setup

Vandaag de basis neergezet:
- Projectmap aangemaakt
- CLAUDE.md geschreven met alle beslissingen
- Dit devlog gestart
- Git repository opgezet op GitHub

### De eerste pixels

Na het plannen: tijd om te bouwen! Sophie (de Frontend Developer agent) heeft de basis app opgezet:

**Tech keuzes:**
- Vite als build tool (snel, modern)
- Vanilla JavaScript (geen framework nodig voor MVP)
- CSS custom properties voor het poezenthema

**Wat er nu staat:**
- Splash screen met een schattige oranje kat die zachtjes op en neer beweegt
- De tekst "Je pasjes, altijd bij de poot" (leuke tagline toch?)
- Warm kleurenpalet: oranje (#FFB347) als hoofdkleur, roze accent (#FF8C94)
- Lege staat met "Nog geen pasjes" melding
- Een + knop om pasjes toe te voegen (doet nog niks)

**Wat ik heb geleerd:**
1. SVG is perfect voor app icons - schaalt mooi, klein bestandje
2. `env(safe-area-inset-top)` is nodig voor de iPhone notch
3. Vite's hot reload is magisch - wijziging → direct zichtbaar

### Testen

De app draait nu lokaal:
- Desktop: `http://localhost:5173`
- iPhone (zelfde wifi): `http://192.168.178.119:5173`

### Volgende stappen

1. ~~Vite project initialiseren~~ ✓
2. ~~Basis HTML/CSS structuur~~ ✓
3. IndexedDB service opzetten
4. Eerste pasje kunnen toevoegen (handmatig)
5. Pasje weergeven met barcode

### Reflectie

Het helpt enorm om eerst de vragen te beantwoorden voordat je gaat bouwen. Nu heb ik een helder beeld van de MVP en wat "later" kan.

De splash screen met de kat is nu al leuk om te zien. Het voelt al als een echte app!

---

*Wordt vervolgd...*
