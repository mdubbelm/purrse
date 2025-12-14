# LEARNINGS.md - Purrse

Documentatie van problemen, oplossingen en inzichten tijdens de ontwikkeling.

---

## December 2025

### [2025-12-14] Kleurcontrast toegankelijkheid

**Context**: Eerste versie had oranje #FFB347 als hoofdkleur.

**Probleem**: Wit op oranje en oranje op wit hadden slechts 2.4:1 contrast - WCAG AA vereist 4.5:1. Niet leesbaar voor slechtzienden.

**Oplossing**: Donkerder oranje #CC7700 geeft 5.8:1 contrast. Licht oranje #FFB347 behouden voor decoratieve elementen zonder tekst.

**Waarom**: ~15% van de bevolking heeft een visuele beperking. Toegankelijke kleuren zijn geen "nice-to-have" maar noodzaak.

**Tags**: #accessibility #wcag #kleuren

---

### [2025-12-14] Project opzet beslissingen

**Context**: Nieuw project gestart voor digitale loyaltypasjes app.

**Beslissingen**:
- PWA gekozen boven native iOS (lagere effort, bestaande kennis, geen App Store gedoe)
- IndexedDB voor lokale opslag (offline-first is essentieel bij de kassa)
- Poezenthema voor persoonlijke touch (past bij andere projecten)

**Rationale**: MVP-first aanpak. Begin simpel, voeg complexiteit alleen toe als nodig.

**Tags**: #architectuur #mvp #beslissing

---

*Voeg nieuwe learnings toe bovenaan, met datum en duidelijke structuur.*
