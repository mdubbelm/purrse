/**
 * Winkeldatabase voor automatische herkenning van loyaltypasjes
 *
 * De prefixes zijn gebaseerd op bekende EAN-13 voorvoegsels van Nederlandse winkels.
 * Niet alle winkels gebruiken hun standaard prefix voor loyaltypasjes.
 * Bij geen match kan de gebruiker handmatig de winkel invoeren.
 */

export const STORES = {
  // === SUPERMARKTEN ===
  '2620082': { name: 'Albert Heijn', color: '#00A0E2', category: 'supermarkt' },
  '2721210': { name: 'Jumbo', color: '#FECC00', category: 'supermarkt' },
  '4006381': { name: 'Lidl', color: '#0050AA', category: 'supermarkt' },
  '4002239': { name: 'Aldi', color: '#00529B', category: 'supermarkt' },
  '8718906': { name: 'Plus', color: '#E30613', category: 'supermarkt' },
  '8710849': { name: 'Dirk', color: '#E4002B', category: 'supermarkt' },
  '8710404': { name: 'Hoogvliet', color: '#E30613', category: 'supermarkt' },
  '8717371': { name: 'Coop', color: '#00A551', category: 'supermarkt' },

  // === DROGISTERIJEN ===
  '8710624': { name: 'Kruidvat', color: '#E4002B', category: 'drogist' },
  '8712561': { name: 'Etos', color: '#00A0E2', category: 'drogist' },
  '8718951': { name: 'DA', color: '#E4002B', category: 'drogist' },
  '8718868': { name: 'Trekpleister', color: '#E30613', category: 'drogist' },

  // === WARENHUIZEN & DISCOUNTERS ===
  '8713576': { name: 'HEMA', color: '#C8102E', category: 'warenhuis' },
  '8718429': { name: 'Action', color: '#E30613', category: 'discounter' },
  '8711649': { name: 'Blokker', color: '#FF6600', category: 'warenhuis' },
  '8718503': { name: 'Big Bazar', color: '#FFC107', category: 'discounter' },

  // === MODE ===
  '4015643': { name: 'H&M', color: '#E50010', category: 'mode' },
  '4006392': { name: 'C&A', color: '#E30613', category: 'mode' },
  '8710371': { name: 'Zeeman', color: '#00529B', category: 'mode' },
  '5054186': { name: 'Primark', color: '#004B87', category: 'mode' },

  // === ELEKTRONICA ===
  '4012022': { name: 'MediaMarkt', color: '#E30613', category: 'elektronica' },
  '8718867': { name: 'Coolblue', color: '#0090E3', category: 'elektronica' },

  // === BOUWMARKT & TUIN ===
  '8712423': { name: 'Gamma', color: '#FFCC00', category: 'bouwmarkt' },
  '8712289': { name: 'Praxis', color: '#00A551', category: 'bouwmarkt' },
  '8713589': { name: 'Intratuin', color: '#009639', category: 'tuin' },

  // === BOEKEN & MEDIA ===
  '9789023': { name: 'Bruna', color: '#E30613', category: 'boeken' },
  '8719322': { name: 'Bol.com', color: '#0000CC', category: 'webshop' },

  // === MEUBELS & WONEN ===
  '4020628': { name: 'IKEA', color: '#0051BA', category: 'wonen' },
  '8718469': { name: 'Leen Bakker', color: '#00529B', category: 'wonen' },
  '8714789': { name: 'Kwantum', color: '#E30613', category: 'wonen' },
};

/**
 * Detecteer winkel op basis van barcode prefix
 * Probeert meerdere prefix-lengtes (7, 6, 5 cijfers)
 *
 * @param {string} barcode - De gescande of ingevoerde barcode
 * @returns {Object|null} - Winkel info of null bij geen match
 */
export function detectStore(barcode) {
  if (!barcode || barcode.length < 5) return null;

  // Probeer verschillende prefix lengtes (van lang naar kort)
  const prefixLengths = [7, 6, 5];

  for (const len of prefixLengths) {
    const prefix = barcode.substring(0, len);
    if (STORES[prefix]) {
      return { ...STORES[prefix], prefix };
    }
  }

  return null;
}

/**
 * Geef alle winkels in een bepaalde categorie
 *
 * @param {string} category - Categorie naam
 * @returns {Array} - Array van winkel objecten
 */
export function getStoresByCategory(category) {
  return Object.entries(STORES)
    .filter(([, store]) => store.category === category)
    .map(([prefix, store]) => ({ ...store, prefix }));
}

/**
 * Alle beschikbare categorieën
 */
export const CATEGORIES = [
  'supermarkt',
  'drogist',
  'warenhuis',
  'discounter',
  'mode',
  'elektronica',
  'bouwmarkt',
  'tuin',
  'boeken',
  'webshop',
  'wonen'
];
