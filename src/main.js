/**
 * Purrse - Main App
 */

import './styles/main.css';
import JsBarcode from 'jsbarcode';
import { Html5Qrcode } from 'html5-qrcode';
import { addCard, getAllCards, toggleFavorite, deleteCard } from './services/db.js';

// DOM elementen
const splash = document.getElementById('splash');
const main = document.getElementById('main');
const addBtn = document.getElementById('add-btn');
const addFormScreen = document.getElementById('add-form-screen');
const closeFormBtn = document.getElementById('close-form-btn');
const addCardForm = document.getElementById('add-card-form');
const cardsContainer = document.getElementById('cards-container');
const emptyState = document.getElementById('empty-state');

// Barcode scherm elementen
const barcodeScreen = document.getElementById('barcode-screen');
const backBtn = document.getElementById('back-btn');
const barcodeSvg = document.getElementById('barcode-svg');
const barcodeCardName = document.getElementById('barcode-card-name');
const barcodeNumber = document.getElementById('barcode-number');
const favoriteCardBtn = document.getElementById('favorite-card-btn');
const deleteCardBtn = document.getElementById('delete-card-btn');

// Scanner elementen
const openScannerBtn = document.getElementById('open-scanner-btn');
const scannerScreen = document.getElementById('scanner-screen');
const closeScannerBtn = document.getElementById('close-scanner-btn');

// Color picker elementen
const colorPicker = document.getElementById('color-picker');
const colorCustomRadio = document.getElementById('color-custom');
const colorCustomSwatch = document.querySelector('.color-swatch-custom');

// Scanner instance
let html5QrCode = null;

// Huidig getoonde kaart
let currentCardId = null;
let currentCardFavorite = false;

// App starten
document.addEventListener('DOMContentLoaded', () => {
  // Splash screen verbergen na 4 seconden
  setTimeout(() => {
    splash.classList.add('hidden');
    main.classList.remove('hidden');
    loadCards();
  }, 4000);

  // Event listeners
  addBtn.addEventListener('click', openForm);
  closeFormBtn.addEventListener('click', closeForm);
  addCardForm.addEventListener('submit', handleSubmit);

  // Scanner
  openScannerBtn.addEventListener('click', openScanner);
  closeScannerBtn.addEventListener('click', closeScanner);

  // Color picker
  colorPicker.addEventListener('input', handleColorPickerChange);
  colorPicker.addEventListener('click', (e) => {
    e.stopPropagation(); // Voorkom dat radio wordt getriggerd
    colorCustomRadio.checked = true;
  });

  // Barcode scherm sluiten via terug-knop
  backBtn.addEventListener('click', closeBarcodeAndRefresh);

  // Favoriet toggle op barcode scherm
  favoriteCardBtn.addEventListener('click', handleToggleFavorite);

  // Pasje verwijderen
  deleteCardBtn.addEventListener('click', handleDeleteCard);

  // Escape toets sluit schermen
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!scannerScreen.classList.contains('hidden')) {
        closeScanner();
      } else if (!barcodeScreen.classList.contains('hidden')) {
        closeBarcodeAndRefresh();
      } else if (!addFormScreen.classList.contains('hidden')) {
        closeForm();
      }
    }
  });
});

/**
 * Open het formulier scherm
 */
function openForm() {
  addFormScreen.classList.remove('hidden');
  // Kleine delay voor focus zodat het werkt na screen transitie
  setTimeout(() => {
    document.getElementById('card-name').focus();
  }, 100);
}

/**
 * Sluit het formulier scherm
 */
function closeForm() {
  addFormScreen.classList.add('hidden');
  addCardForm.reset();
  // Reset custom color swatch
  colorCustomSwatch.style.setProperty('--custom-color', '');
}

/**
 * Handle color picker change
 */
function handleColorPickerChange(e) {
  const color = e.target.value;
  colorCustomSwatch.style.setProperty('--custom-color', color);
  colorCustomRadio.checked = true;
}

/**
 * Formulier verzenden
 */
async function handleSubmit(e) {
  e.preventDefault();

  const formData = new FormData(addCardForm);
  let selectedColor = formData.get('color');

  // Als custom kleur geselecteerd, gebruik de color picker waarde
  if (selectedColor === 'custom') {
    selectedColor = colorPicker.value;
  }

  const cardData = {
    name: formData.get('name').trim(),
    barcode: formData.get('barcode').trim(),
    color: selectedColor
  };

  if (!cardData.name || !cardData.barcode) {
    alert('Vul alle velden in');
    return;
  }

  try {
    await addCard(cardData);
    closeForm();
    loadCards();
  } catch (error) {
    console.error('Fout bij opslaan:', error);
    alert('Er ging iets mis bij het opslaan');
  }
}

/**
 * Laad en toon alle pasjes
 */
async function loadCards() {
  try {
    const cards = await getAllCards();

    if (cards.length === 0) {
      emptyState.classList.remove('hidden');
      // Verwijder bestaande kaarten (behalve empty state)
      const existingCards = cardsContainer.querySelectorAll('.card-item');
      existingCards.forEach(card => card.remove());
      return;
    }

    emptyState.classList.add('hidden');

    // Verwijder bestaande kaarten
    const existingCards = cardsContainer.querySelectorAll('.card-item');
    existingCards.forEach(card => card.remove());

    // Voeg kaarten toe
    cards.forEach(card => {
      const cardElement = createCardElement(card);
      cardsContainer.appendChild(cardElement);
    });
  } catch (error) {
    console.error('Fout bij laden:', error);
  }
}

/**
 * Maak een kaart element
 */
function createCardElement(card) {
  const div = document.createElement('div');
  div.className = `card-item${card.favorite ? ' favorite' : ''}`;
  div.dataset.id = card.id;

  // Eerste letter voor logo placeholder
  const initial = card.name.charAt(0).toUpperCase();

  div.innerHTML = `
    <div class="card-logo" style="background-color: ${card.color}20; color: ${card.color}">
      ${initial}
    </div>
    <div class="card-info">
      <div class="card-name">${escapeHtml(card.name)}</div>
      <div class="card-barcode-preview">${escapeHtml(card.barcode)}</div>
    </div>
    <button class="card-favorite" aria-label="${card.favorite ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}">
      ${card.favorite ? '★' : '☆'}
    </button>
  `;

  // Klik op kaart = toon barcode (later)
  div.addEventListener('click', (e) => {
    if (!e.target.classList.contains('card-favorite')) {
      showBarcode(card);
    }
  });

  // Favoriet toggle
  const favBtn = div.querySelector('.card-favorite');
  favBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    await toggleFavorite(card.id);
    loadCards();
  });

  return div;
}

/**
 * Toon barcode scherm
 */
function showBarcode(card) {
  // Vul de gegevens in
  barcodeCardName.textContent = card.name;
  barcodeNumber.textContent = card.barcode;

  // Genereer de barcode
  try {
    JsBarcode(barcodeSvg, card.barcode, {
      format: detectBarcodeFormat(card.barcode),
      width: 2,
      height: 100,
      displayValue: false,
      background: 'transparent',
      lineColor: '#000000',
      margin: 10
    });
  } catch (error) {
    // Fallback naar CODE128 als het format niet werkt
    console.warn('Barcode format detectie gefaald, gebruik CODE128:', error);
    JsBarcode(barcodeSvg, card.barcode, {
      format: 'CODE128',
      width: 2,
      height: 100,
      displayValue: false,
      background: 'transparent',
      lineColor: '#000000',
      margin: 10
    });
  }

  // Bewaar card gegevens
  currentCardId = card.id;
  currentCardFavorite = card.favorite;
  updateFavoriteButton();

  // Toon barcode scherm
  barcodeScreen.classList.remove('hidden');

  // Update lastUsed
  updateLastUsed(card.id);
}

/**
 * Sluit barcode scherm
 */
function closeBarcode() {
  barcodeScreen.classList.add('hidden');
  currentCardId = null;
  currentCardFavorite = false;
}

/**
 * Sluit barcode scherm en ververs de lijst
 */
function closeBarcodeAndRefresh() {
  closeBarcode();
  loadCards();
}

/**
 * Open de scanner
 */
async function openScanner() {
  // Check of camera API beschikbaar is
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert('Camera wordt niet ondersteund in deze browser.');
    return;
  }

  scannerScreen.classList.remove('hidden');

  try {
    // Vraag eerst expliciet camera permissie
    await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => {
        // Stop de stream direct, html5-qrcode maakt zijn eigen stream
        stream.getTracks().forEach(track => track.stop());
      });

    html5QrCode = new Html5Qrcode('scanner-viewport');

    await html5QrCode.start(
      { facingMode: 'environment' }, // Gebruik achter-camera
      {
        fps: 10,
        qrbox: { width: 250, height: 150 }
      },
      onScanSuccess,
      onScanFailure
    );
  } catch (err) {
    console.error('Camera starten mislukt:', err);

    let message = 'Kon camera niet starten.';
    if (err.name === 'NotAllowedError') {
      message = 'Camera toegang geweigerd. Geef toestemming in je browserinstellingen.';
    } else if (err.name === 'NotFoundError') {
      message = 'Geen camera gevonden op dit apparaat.';
    } else if (err.name === 'NotReadableError') {
      message = 'Camera is in gebruik door een andere app.';
    }

    alert(message);
    closeScanner();
  }
}

/**
 * Sluit de scanner
 */
async function closeScanner() {
  if (html5QrCode) {
    try {
      await html5QrCode.stop();
    } catch (err) {
      console.warn('Scanner stoppen mislukt:', err);
    }
    html5QrCode = null;
  }
  scannerScreen.classList.add('hidden');
}

/**
 * Verwerk gescande barcode
 */
function onScanSuccess(decodedText) {
  // Stop scanner en sluit scherm
  closeScanner();

  // Vul barcode in het formulier in
  document.getElementById('card-barcode').value = decodedText;

  // Focus op naam veld
  document.getElementById('card-name').focus();
}

/**
 * Scanner fout (wordt vaak aangeroepen, negeer)
 */
function onScanFailure() {
  // Negeer - dit gebeurt continu als er geen barcode in beeld is
}

/**
 * Update favoriet knop uiterlijk
 */
function updateFavoriteButton() {
  if (currentCardFavorite) {
    favoriteCardBtn.classList.add('is-favorite');
    favoriteCardBtn.setAttribute('aria-label', 'Verwijder uit favorieten');
  } else {
    favoriteCardBtn.classList.remove('is-favorite');
    favoriteCardBtn.setAttribute('aria-label', 'Voeg toe aan favorieten');
  }
}

/**
 * Toggle favoriet status van huidig pasje
 */
async function handleToggleFavorite() {
  if (!currentCardId) return;

  try {
    await toggleFavorite(currentCardId);
    currentCardFavorite = !currentCardFavorite;
    updateFavoriteButton();
  } catch (error) {
    console.error('Fout bij favoriet toggle:', error);
  }
}

/**
 * Verwijder huidig pasje
 */
async function handleDeleteCard() {
  if (!currentCardId) return;

  const confirmed = confirm('Weet je zeker dat je dit pasje wilt verwijderen?');
  if (!confirmed) return;

  try {
    await deleteCard(currentCardId);
    closeBarcode();
    loadCards();
  } catch (error) {
    console.error('Fout bij verwijderen:', error);
    alert('Er ging iets mis bij het verwijderen');
  }
}

/**
 * Detecteer barcode format op basis van het nummer
 */
function detectBarcodeFormat(barcode) {
  const cleaned = barcode.replace(/\s/g, '');

  // EAN-13: 13 cijfers
  if (/^\d{13}$/.test(cleaned)) return 'EAN13';

  // EAN-8: 8 cijfers
  if (/^\d{8}$/.test(cleaned)) return 'EAN8';

  // UPC-A: 12 cijfers
  if (/^\d{12}$/.test(cleaned)) return 'UPC';

  // Code 39: letters, cijfers en speciale tekens
  if (/^[A-Z0-9\- .$/+%]+$/i.test(cleaned)) return 'CODE39';

  // Fallback
  return 'CODE128';
}

/**
 * Update lastUsed timestamp
 */
async function updateLastUsed(id) {
  try {
    const card = await import('./services/db.js').then(m => m.getCard(id));
    if (card) {
      card.lastUsed = new Date().toISOString();
      await import('./services/db.js').then(m => m.updateCard(card));
    }
  } catch (error) {
    console.error('Kon lastUsed niet updaten:', error);
  }
}

/**
 * Escape HTML om XSS te voorkomen
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Service Worker registreren voor offline werking
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('Purrse: Service Worker geregistreerd'))
      .catch((err) => console.error('Purrse: SW registratie mislukt:', err));
  });
}

console.log('Purrse geladen');
