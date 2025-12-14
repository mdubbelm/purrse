/**
 * Purrse - IndexedDB Database Service
 * Lokale opslag voor pasjes (offline-first)
 */

const DB_NAME = 'purrse';
const DB_VERSION = 1;
const STORE_NAME = 'cards';

let db = null;

/**
 * Open de database connectie
 */
export async function openDB() {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      // Maak cards store aan
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('favorite', 'favorite', { unique: false });
        store.createIndex('name', 'name', { unique: false });
      }
    };
  });
}

/**
 * Genereer een uniek ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Voeg een nieuw pasje toe
 */
export async function addCard(cardData) {
  const database = await openDB();

  const card = {
    id: generateId(),
    name: cardData.name,
    barcode: cardData.barcode,
    barcodeType: cardData.barcodeType || 'CODE128',
    color: cardData.color || '#CC7700',
    favorite: false,
    createdAt: new Date().toISOString(),
    lastUsed: new Date().toISOString()
  };

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add(card);

    request.onsuccess = () => resolve(card);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Haal alle pasjes op (favorieten eerst)
 */
export async function getAllCards() {
  const database = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      // Sorteer: favorieten eerst, dan op naam
      const cards = request.result.sort((a, b) => {
        if (a.favorite && !b.favorite) return -1;
        if (!a.favorite && b.favorite) return 1;
        return a.name.localeCompare(b.name);
      });
      resolve(cards);
    };
    request.onerror = () => reject(request.error);
  });
}

/**
 * Haal een specifiek pasje op
 */
export async function getCard(id) {
  const database = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Update een pasje
 */
export async function updateCard(card) {
  const database = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(card);

    request.onsuccess = () => resolve(card);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Toggle favoriet status
 */
export async function toggleFavorite(id) {
  const card = await getCard(id);
  if (card) {
    card.favorite = !card.favorite;
    return updateCard(card);
  }
  return null;
}

/**
 * Verwijder een pasje
 */
export async function deleteCard(id) {
  const database = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);
  });
}
