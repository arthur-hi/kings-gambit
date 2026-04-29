// Cards are now loaded from mutiny/cards/*.js into window.MutinyPacks
// ══════════════════════════════════════════════
// CUSTOM CARD STORAGE (session-scoped)
// ══════════════════════════════════════════════

const CUSTOM_CARDS_KEY = 'mutiny-custom-cards-session';

function getCustomCards() {
  try {
    const data = sessionStorage.getItem(CUSTOM_CARDS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) { return {}; }
}

function saveCustomCard(playerId, cardData) {
  const all = getCustomCards();
  all[playerId] = cardData;
  sessionStorage.setItem(CUSTOM_CARDS_KEY, JSON.stringify(all));
}

function clearCustomCard(playerId) {
  const all = getCustomCards();
  delete all[playerId];
  sessionStorage.setItem(CUSTOM_CARDS_KEY, JSON.stringify(all));
}

function getCustomCardsArray() {
  const all = getCustomCards();
  return Object.values(all)
    .filter(c => c && (typeof c === 'string' ? c.trim().length > 0 : c.text && c.text.trim().length > 0))
    .map(c => {
      // Legacy migration: wrap pre-v2 cards into the structured format
      if (typeof c === 'string') {
        return { v: 2, text: c, tags: ['custom'] };
      }
      if (!c.v || c.v < 2) {
        return { v: 2, text: c.text, tags: c.tags || ['custom'] };
      }
      return c;
    });
}

// ══════════════════════════════════════════════
// GAME STATE
// ══════════════════════════════════════════════

let activePlayers = [];
let currentPlayerIndex = 0;
let isSpinning = false;
let deck = [];
let activeCurse = null;

// ── Directional state ──────────────────────────
// 1 = clockwise (default), -1 = counter-clockwise
let gameDirection = 1;

// Filter state
const ALL_TAGS = [
  { key: 'social', label: 'Social', icon: '🎉' },
  { key: 'duel', label: 'Duel', icon: '⚔️' },
  { key: 'physical', label: 'Physical', icon: '💪' },
  { key: 'memory', label: 'Memory', icon: '🧠' },
  { key: 'spicy', label: 'Spicy', icon: '🌶️' },
  { key: 'callout', label: 'Callout', icon: '📢' }
];
const TAGS_STORAGE_KEY = 'kings-gambit-mutiny-tags';

function getSelectedTags() {
  try {
    const data = localStorage.getItem(TAGS_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) { /* ignore */ }
  return ALL_TAGS.map(t => t.key); // default: all enabled
}

function saveSelectedTags(tags) {
  localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
}

let selectedTags = getSelectedTags();

// DOM Elements (game UI — not available until game starts)
let container, coin, promptDisplay, turnEmoji, turnName;
let mutinyOverlay, mutinyTitle, mutinyText, mutinyContinueBtn;
let backBtn, exitOverlay, exitStayBtn, exitQuitBtn;
let curseBanner, curseText;
let filterBtn, filterOverlay, filterDrawer, filterCloseBtn, filterList;
let cbtmTimer, cbtmStartBtn, cbtmVoteActions, cbtmWinBtn, cbtmLoseBtn, cbtmExplainBtn, cbtmExplanation, cbtmDoneBtn;
let cbtmInterval = null;

// ══════════════════════════════════════════════
// CREW MANIFEST — Pre-game screen
// ══════════════════════════════════════════════

const crewManifest = document.getElementById('crew-manifest');
const crewAvatarGrid = document.getElementById('crew-avatar-grid');
const setSailBtn = document.getElementById('set-sail-btn');

// Card Builder modal elements
const cardBuilderOverlay = document.getElementById('card-builder-overlay');
const builderAvatar = document.getElementById('builder-avatar');
const builderPlayerName = document.getElementById('builder-player-name');
const cardEditable = document.getElementById('card-editable');
const builderTagRow = document.getElementById('builder-tag-row');
const cardBuilderSave = document.getElementById('card-builder-save');
const cardBuilderClose = document.getElementById('card-builder-close');
const cardPreviewEl    = document.getElementById('card-preview');

let activeBuilderPlayerId = null; // which player's card is being edited

function renderCrewManifest() {
  crewAvatarGrid.innerHTML = '';
  const customCards = getCustomCards();

  activePlayers.forEach(p => {
    const hasCard = !!(customCards[p.id] && customCards[p.id].text && customCards[p.id].text.trim());

    const item = document.createElement('div');
    item.className = `crew-avatar-item${hasCard ? ' has-card' : ''}`;
    item.dataset.id = p.id;

    // Avatar frame
    const frame = document.createElement('div');
    frame.className = 'crew-avatar-frame';
    if (p.emoji.endsWith('.png') || p.emoji.endsWith('.gif')) {
      frame.innerHTML = (window.UI && window.UI.renderAvatarImg) ? window.UI.renderAvatarImg(p.emoji) : `<img src="${p.emoji}" class="avatar-image" draggable="false">`;
    } else {
      frame.textContent = p.emoji;
    }

    // Name label
    const name = document.createElement('div');
    name.className = 'crew-avatar-name';
    name.textContent = p.name;

    item.appendChild(frame);
    item.appendChild(name);

    item.addEventListener('click', () => openCardBuilder(p));
    crewAvatarGrid.appendChild(item);
  });
  
  if (window.UI && window.UI.startAnimatedCanvases) {
    window.UI.startAnimatedCanvases();
  }
}

function openCardBuilder(player) {
  activeBuilderPlayerId = player.id;

  // Set player identity in builder header
  builderAvatar.innerHTML = '';
  if (player.emoji.endsWith('.png') || player.emoji.endsWith('.gif')) {
    builderAvatar.innerHTML = (window.UI && window.UI.renderAvatarImg) ? window.UI.renderAvatarImg(player.emoji) : `<img src="${player.emoji}" class="avatar-image" draggable="false">`;
  } else {
    builderAvatar.textContent = player.emoji;
  }
  builderPlayerName.textContent = player.name;

  // Load existing card data (if any)
  const existing = getCustomCards()[player.id];
  cardEditable.innerHTML = existing ? parsePillsToHtml(existing.text) : '';
  updateCardPreview();

  // Show overlay
  cardBuilderOverlay.classList.add('is-visible');

  if (window.UI && window.UI.startAnimatedCanvases) {
    window.UI.startAnimatedCanvases();
  }

  // Focus the text area after short delay (avoids keyboard issues on mobile)
  setTimeout(() => {
    cardEditable.focus();
    // Place cursor at end
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(cardEditable);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }, 300);
}

function parsePillsToHtml(text) {
  if (!text) return '';
  return text
    .replace(/{player}/g, '<span class="mutiny-pill" data-type="{player}" contenteditable="false">🎯 @player</span>')
    .replace(/{left}/g, '<span class="mutiny-pill" data-type="{left}" contenteditable="false">◀ @left</span>')
    .replace(/{random}/g, '<span class="mutiny-pill" data-type="{random}" contenteditable="false">🎲 @random</span>')
    .replace(/{across}/g, '<span class="mutiny-pill" data-type="{across}" contenteditable="false">↔ @across</span>')
    .replace(/{next}/g, '<span class="mutiny-pill" data-type="{next}" contenteditable="false">⏭ @next</span>')
    .replace(/{right}/g, '<span class="mutiny-pill" data-type="{right}" contenteditable="false">▶ @right</span>')
    .replace(/{direction}/g, '<span class="mutiny-pill" data-type="{direction}" contenteditable="false">🧭 @direction</span>');
}


// ──────────────────────────────────────────────
// CARD BUILDER PREVIEW
// ──────────────────────────────────────────────

/**
 * Resolves all pill tokens using the builder's player as current player,
 * assuming clockwise direction, and updates the read-only preview panel.
 */
function updateCardPreview() {
  if (!cardPreviewEl) return;

  // Extract raw token string from editable pills
  const clone = cardEditable.cloneNode(true);
  clone.querySelectorAll('.mutiny-pill').forEach(pill => {
    pill.replaceWith(pill.dataset.type);
  });
  const rawText = clone.textContent.trim();

  if (!rawText) {
    cardPreviewEl.innerHTML = 'Start writing to see your card...';
    cardPreviewEl.classList.add('is-empty');
    return;
  }
  cardPreviewEl.classList.remove('is-empty');

  // Resolve tokens — builder player is "current", clockwise (direction = 1)
  const pCount = activePlayers.length;
  if (pCount === 0) { cardPreviewEl.textContent = rawText; return; }

  const builderPlayer = activePlayers.find(p => p.id === activeBuilderPlayerId);
  if (!builderPlayer) { cardPreviewEl.textContent = rawText; return; }

  const cIndex  = activePlayers.indexOf(builderPlayer);
  const pPlayer  = builderPlayer.name;
  const pLeft    = activePlayers[(cIndex - 1 + pCount) % pCount].name;
  const pRight   = activePlayers[(cIndex + 1) % pCount].name;
  const pNext    = pRight; // clockwise
  const pAcross  = activePlayers[(cIndex + Math.floor(pCount / 2)) % pCount].name;
  let randIdx    = Math.floor(Math.random() * pCount);
  while (randIdx === cIndex && pCount > 1) randIdx = Math.floor(Math.random() * pCount);
  const pRandom  = activePlayers[randIdx].name;
  const pDir     = 'clockwise';

  const resolved = rawText
    .replace(/{player}/g,    pPlayer)
    .replace(/{left}/g,      pLeft)
    .replace(/{right}/g,     pRight)
    .replace(/{next}/g,      pNext)
    .replace(/{across}/g,    pAcross)
    .replace(/{random}/g,    pRandom)
    .replace(/{direction}/g, pDir);

  // Wrap resolved values in styled preview-token spans
  const uniqueValues = [pPlayer, pLeft, pRight, pNext, pAcross, pRandom, pDir]
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .map(n => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  let highlighted = resolved;
  if (uniqueValues.length) {
    const regex = new RegExp(`(${uniqueValues.join('|')})`, 'g');
    highlighted = resolved.replace(regex, '<span class="preview-token">$1</span>');
  }

  cardPreviewEl.innerHTML = highlighted;
}

function closeCardBuilder() {
  cardBuilderOverlay.classList.remove('is-visible');
  activeBuilderPlayerId = null;
  cardEditable.blur();
  if (cardPreviewEl) {
    cardPreviewEl.innerHTML = 'Start writing to see your card...';
    cardPreviewEl.classList.add('is-empty');
  }
}

// Token chip logic — tap to insert at cursor
function setupTokenChips() {
  document.querySelectorAll('.card-token-chip').forEach(chip => {
    const token = chip.dataset.token;

    // Tap/click to insert
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      insertTokenAtCursor(token, chip);
    });

    // Drag start
    chip.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', token);
      e.dataTransfer.effectAllowed = 'copy';
    });
  });

  // Drop target on the editable area
  cardEditable.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });

  cardEditable.addEventListener('drop', (e) => {
    e.preventDefault();
    const token = e.dataTransfer.getData('text/plain');
    if (token) {
      // Position caret at drop point
      let range;
      if (document.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(e.clientX, e.clientY);
      } else if (document.caretPositionFromPoint) {
        const pos = document.caretPositionFromPoint(e.clientX, e.clientY);
        if (pos) {
          range = document.createRange();
          range.setStart(pos.offsetNode, pos.offset);
          range.collapse(true);
        }
      }
      if (range) {
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
      insertToken(token);
      updateCardPreview();
    }
  });

  // Setup template buttons
  document.querySelectorAll('.card-template-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      cardEditable.innerHTML = btn.dataset.template;
      updateCardPreview();
      if (navigator.vibrate) navigator.vibrate(20);
    });
  });

  // Live preview on every keystroke
  cardEditable.addEventListener('input', updateCardPreview);
}

function insertTokenAtCursor(token, chipEl) {
  chipEl.classList.add('inserting');
  setTimeout(() => chipEl.classList.remove('inserting'), 300);

  cardEditable.focus();
  insertToken(token);
  updateCardPreview();
  if (navigator.vibrate) navigator.vibrate(30);
}

function insertToken(tokenHtml) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) {
    // If no selection, just append
    cardEditable.insertAdjacentHTML('beforeend', tokenHtml);
    return;
  }

  let range = sel.getRangeAt(0);

  // Ensure the selection is inside cardEditable
  if (!cardEditable.contains(range.commonAncestorContainer)) {
    // Place at end
    range = document.createRange();
    range.selectNodeContents(cardEditable);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
  }

  range.deleteContents();
  const temp = document.createElement('div');
  temp.innerHTML = tokenHtml;
  const node = temp.firstChild;
  range.insertNode(node);

  // Move cursor after the inserted token
  range.setStartAfter(node);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

// Card Builder event listeners
cardBuilderSave.addEventListener('click', () => {
  if (!activeBuilderPlayerId) return;

  // Convert pills back to raw text for storage
  const clone = cardEditable.cloneNode(true);
  clone.querySelectorAll('.mutiny-pill').forEach(pill => {
    pill.replaceWith(pill.dataset.type);
  });

  const rawText = clone.textContent.trim();
  if (!rawText) {
    // Nothing written — just close
    closeCardBuilder();
    return;
  }

  const tags = ['custom'];
  saveCustomCard(activeBuilderPlayerId, { text: rawText, tags });

  // Haptic + close
  if (navigator.vibrate) navigator.vibrate([30, 20, 60]);
  closeCardBuilder();

  // Refresh the avatar grid to show badge
  renderCrewManifest();

  // Show toast
  if (window.UI && window.UI.showToast) {
    const player = activePlayers.find(p => p.id === activeBuilderPlayerId);
    const name = player ? player.name : 'Player';
    window.UI.showToast(`${name}'s card is locked in! ⚓`);
  }
});



cardBuilderClose.addEventListener('click', closeCardBuilder);

// Close on overlay backdrop tap (but not when scrolling modal)
cardBuilderOverlay.addEventListener('click', (e) => {
  if (e.target === cardBuilderOverlay) closeCardBuilder();
});

// SET SAIL button
setSailBtn.addEventListener('click', () => {
  crewManifest.classList.add('is-leaving');
  setTimeout(() => {
    crewManifest.style.display = 'none';
    startGame();
  }, 400);
});

// ══════════════════════════════════════════════
// GAME INIT
// ══════════════════════════════════════════════

function initTagsForPlayerCount() {
  const currentCount = activePlayers.length;
  const lastCount = parseInt(localStorage.getItem('mutiny-last-player-count') || '0', 10);

  if (currentCount === 2 && lastCount !== 2) {
    const tagsToDisable = ['social', 'spicy', 'physical'];
    let changed = false;
    selectedTags = selectedTags.filter(t => {
      if (tagsToDisable.includes(t)) { changed = true; return false; }
      return true;
    });
    if (changed) saveSelectedTags(selectedTags);
  } else if (currentCount > 2 && lastCount > 0 && lastCount <= 2) {
    const tagsToEnable = ['social', 'spicy', 'physical'];
    let changed = false;
    tagsToEnable.forEach(tag => {
      if (!selectedTags.includes(tag)) { selectedTags.push(tag); changed = true; }
    });
    if (changed) saveSelectedTags(selectedTags);
  }

  localStorage.setItem('mutiny-last-player-count', currentCount.toString());

  if (currentCount === 2) {
    const toastShown = sessionStorage.getItem('mutiny-2p-toast-shown');
    if (!toastShown) {
      setTimeout(() => {
        if (window.UI && window.UI.showToast) {
          window.UI.showToast("Cards for larger groups are turned off. You can enable them in filters ⚙️");
        }
      }, 500);
      sessionStorage.setItem('mutiny-2p-toast-shown', 'true');
    }
  }
}

function init() {
  activePlayers = window.Storage.getActivePlayers();
  if (activePlayers.length < 2) {
    alert("You need at least 2 players!");
    window.location.href = 'index.html';
    return;
  }

  initTagsForPlayerCount();

  // Show the crew manifest, set up token chips
  setupTokenChips();
  renderCrewManifest();
}

function startGame() {
  // Reveal game UI
  const gameContainer = document.getElementById('mutiny-container');
  gameContainer.style.display = 'flex';

  // Cache DOM elements now that the game UI is visible
  container = document.getElementById('mutiny-container');
  coin = document.getElementById('mutiny-coin');
  promptDisplay = document.getElementById('mutiny-prompt');
  turnEmoji = document.getElementById('turn-emoji');
  turnName = document.getElementById('turn-name');

  mutinyOverlay = document.getElementById('mutiny-overlay');
  mutinyTitle = document.getElementById('mutiny-title');
  mutinyText = document.getElementById('mutiny-text');
  mutinyContinueBtn = document.getElementById('mutiny-continue-btn');

  backBtn = document.getElementById('back-btn');
  exitOverlay = document.getElementById('exit-overlay');
  exitStayBtn = document.getElementById('exit-stay-btn');
  exitQuitBtn = document.getElementById('exit-quit-btn');

  curseBanner = document.getElementById('curse-banner');
  curseText = document.getElementById('curse-text');

  filterBtn = document.getElementById('filter-btn');
  filterOverlay = document.getElementById('filter-overlay');
  filterDrawer = document.getElementById('filter-drawer');
  filterCloseBtn = document.getElementById('filter-close');
  filterList = document.getElementById('filter-list');

  cbtmTimer = document.getElementById('cbtm-timer');
  cbtmStartBtn = document.getElementById('cbtm-start-btn');
  cbtmVoteActions = document.getElementById('cbtm-vote-actions');
  cbtmWinBtn = document.getElementById('cbtm-win-btn');
  cbtmLoseBtn = document.getElementById('cbtm-lose-btn');
  cbtmExplainBtn = document.getElementById('cbtm-explain-btn');
  cbtmExplanation = document.getElementById('cbtm-explanation');
  cbtmDoneBtn = document.getElementById('cbtm-done-btn');

  // Build deck including custom cards
  fillDeck();

  // Generate atmospheric stars
  const starsEl = document.getElementById('mutiny-stars');
  if (starsEl) {
    starsEl.innerHTML = '';
    for (let i = 0; i < 35; i++) {
      const star = document.createElement('div');
      star.className = 'mutiny-star';
      const size = 1 + Math.random() * 2.5;
      star.style.cssText = [
        `width:${size}px`,
        `height:${size}px`,
        `top:${Math.random() * 65}%`,
        `left:${Math.random() * 100}%`,
        `animation-duration:${1.8 + Math.random() * 4}s`,
        `animation-delay:${Math.random() * 4}s`
      ].join(';');
      starsEl.appendChild(star);
    }
  }

  currentPlayerIndex = 0;
  updateTurnUI();
  if (window.UI && window.UI.startAnimatedCanvases) window.UI.startAnimatedCanvases();

  coin.addEventListener('click', handleSpin);
  mutinyContinueBtn.addEventListener('click', handleContinue);

  backBtn.addEventListener('click', () => exitOverlay.classList.add('is-visible'));
  exitStayBtn.addEventListener('click', () => exitOverlay.classList.remove('is-visible'));
  exitQuitBtn.addEventListener('click', () => window.location.href = 'index.html');

  filterBtn.addEventListener('click', openSettingsDrawer);
  filterCloseBtn.addEventListener('click', closeSettingsDrawer);
  filterOverlay.addEventListener('click', closeSettingsDrawer);
  renderSettingsDrawer();

  const playerTag = document.querySelector('#mutiny-card .modal-player-tag');

  // CBTM: Explain toggle
  cbtmExplainBtn.addEventListener('click', () => {
    const isShown = cbtmExplanation.style.display === 'block';
    cbtmExplanation.style.display = isShown ? 'inline-block' : 'block';
    cbtmExplainBtn.textContent = isShown ? 'Explain' : 'Hide';
    if (playerTag) {
      playerTag.classList.toggle('is-shrunk', !isShown);
      cbtmExplanation.classList.toggle('is-open', !isShown);
    }
  });

  // CBTM: Start pitch timer
  cbtmStartBtn.addEventListener('click', () => {
    cbtmStartBtn.style.display = 'none';
    cbtmExplainBtn.style.display = 'none';
    cbtmExplanation.style.display = 'inline-block';
    cbtmTimer.style.display = 'block';
    cbtmDoneBtn.style.display = 'block';

    playerTag.classList.remove('is-shrunk');
    cbtmExplanation.classList.remove('is-open');

    let seconds = 30;
    cbtmTimer.textContent = seconds;
    cbtmInterval = setInterval(() => {
      seconds--;
      cbtmTimer.textContent = seconds;
      if (seconds <= 0) {
        clearInterval(cbtmInterval);
        cbtmInterval = null;
        cbtmTimer.style.display = 'none';
        cbtmDoneBtn.style.display = 'none';
        cbtmVoteActions.style.display = 'flex';
      }
    }, 1000);
  });

  // CBTM: Done early
  cbtmDoneBtn.addEventListener('click', () => {
    if (cbtmInterval) { clearInterval(cbtmInterval); cbtmInterval = null; }
    cbtmTimer.style.display = 'none';
    cbtmDoneBtn.style.display = 'none';
    cbtmVoteActions.style.display = 'flex';
  });

  cbtmWinBtn.addEventListener('click', handleContinue);
  cbtmLoseBtn.addEventListener('click', handleContinue);
}

// ══════════════════════════════════════════════
// DECK + GAME LOGIC
// ══════════════════════════════════════════════

function fillDeck() {
  const disabledTags = ALL_TAGS
    .map(t => t.key)
    .filter(tag => !selectedTags.includes(tag));

  // Determine active packs
  let activePackIds = null;
  try {
    const data = localStorage.getItem('kings-gambit-mutiny-packs');
    if (data) activePackIds = JSON.parse(data);
  } catch (e) {}

  let allPackCards = [];
  if (window.MutinyPacks) {
    window.MutinyPacks.forEach(pack => {
      // If activePackIds is null, all packs are active by default
      if (!activePackIds || activePackIds.includes(pack.id)) {
        allPackCards.push(...pack.cards);
      }
    });
  }

  // Standard cards filtered by tag preferences
  const standardCards = allPackCards.filter(card => {
    const filterableTags = card.tags.filter(t => t !== 'persistent' && t !== 'cbtm');
    if (filterableTags.length === 0) return true;
    return !filterableTags.every(tag => disabledTags.includes(tag));
  });

  // Custom cards always included (bypass filter, like persistent cards)
  const customCards = getCustomCardsArray();

  deck = [...standardCards, ...customCards];

  // Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function updateTurnUI() {
  const p = activePlayers[currentPlayerIndex];
  const dirLabel = gameDirection === 1 ? '↻' : '↺';

  if (p.emoji.endsWith('.png') || p.emoji.endsWith('.gif')) {
    // Use shared renderAvatarImg so avatar mode is respected
    turnEmoji.innerHTML = (window.UI && window.UI.renderAvatarImg)
      ? window.UI.renderAvatarImg(p.emoji)
      : `<img src="${p.emoji}" class="avatar-image" draggable="false">`;
  } else {
    turnEmoji.textContent = p.emoji;
  }

  turnName.textContent = `${dirLabel} Capt. ${p.name}'s turn`;

  if (window.UI && window.UI.startAnimatedCanvases) {
    window.UI.startAnimatedCanvases();
  }
}

function getReplacedPrompt(rawString) {
  const cIndex = currentPlayerIndex;
  const pCount = activePlayers.length;

  const pPlayer = activePlayers[cIndex].name;
  const pLeft  = activePlayers[(cIndex - 1 + pCount) % pCount].name;
  const pRight = activePlayers[(cIndex + 1) % pCount].name;
  // Direction-aware next player
  const nextIdx = (cIndex + gameDirection + pCount) % pCount;
  const pNext  = activePlayers[nextIdx].name;

  let randIdx = Math.floor(Math.random() * pCount);
  while (randIdx === cIndex && pCount > 1) {
    randIdx = Math.floor(Math.random() * pCount);
  }
  const pRandom = activePlayers[randIdx].name;

  const acrossIdx = (cIndex + Math.floor(pCount / 2)) % pCount;
  const pAcross = activePlayers[acrossIdx].name;

  const pDir = gameDirection === 1 ? 'clockwise' : 'counter-clockwise';

  return rawString
    .replace(/{player}/g, pPlayer)
    .replace(/{left}/g,   pLeft)
    .replace(/{right}/g,  pRight)
    .replace(/{next}/g,   pNext)
    .replace(/{random}/g, pRandom)
    .replace(/{across}/g, pAcross)
    .replace(/{direction}/g, pDir);
}

// ──────────────────────────────────────────────
// CREW COMPASS — Visualiser for group cards
// ──────────────────────────────────────────────

function buildCrewRing(highlightIndex) {
  const ring = document.getElementById('crew-ring');
  if (!ring) return;
  ring.innerHTML = '';

  const count = activePlayers.length;
  // Use container width for outer edge calculation
  const ringWidth = ring.clientWidth || 200;
  const avatarHalfWidth = 24; // Assuming 48px avatar
  const radius = (ringWidth / 2) - avatarHalfWidth;

  activePlayers.forEach((p, i) => {
    const angleDeg = (360 / count) * i - 90; // start at top
    const angleRad = (angleDeg * Math.PI) / 180;
    const x = radius * Math.cos(angleRad);
    const y = radius * Math.sin(angleRad);

    const item = document.createElement('div');
    item.className = `crew-ring-avatar${i === highlightIndex ? ' is-active' : ''}`;
    // Position with left/top so CSS transform animations don't override the translation
    item.style.left = `calc(50% + ${x}px)`;
    item.style.top = `calc(50% + ${y}px)`;
    //item.style.transform = `rotate(0deg)`;

    if (p.emoji.endsWith('.png') || p.emoji.endsWith('.gif')) {
      const imgHtml = (window.UI && window.UI.renderAvatarImg)
        ? window.UI.renderAvatarImg(p.emoji)
        : `<img src="${p.emoji}" class="avatar-image" draggable="false">`;
      item.innerHTML = imgHtml;
    } else {
      item.textContent = p.emoji;
    }

    ring.appendChild(item);
  });

  // Drive spin animation via CSS class (also enables the sibling counter-rotation selector)
  ring.classList.toggle('rotateCW',  gameDirection === 1);
  ring.classList.toggle('rotateCCW', gameDirection === -1);

  if (window.UI && window.UI.startAnimatedCanvases) {
    window.UI.startAnimatedCanvases();
  }
}

function handleSpin() {
  if (isSpinning) return;
  isSpinning = true;

  coin.classList.remove('spin-fast', 'is-plank', 'is-treasure');
  void coin.offsetWidth;

  const p = activePlayers[currentPlayerIndex];

  let eventType = null;
  if (_queuedEvent) {
    eventType = _queuedEvent;
    _queuedEvent = null;
    console.log(`[mutiny] Dequeued forced event: ${eventType}`);
  } else if (window.MutinyEvents) {
    eventType = window.MutinyEvents.evaluate(p);
  }

  if (eventType === 'PLANK') {
    coin.classList.add('is-plank');
  } else if (eventType === 'TREASURE') {
    coin.classList.add('is-treasure');
  }

  coin.classList.add('spin-fast');

  setTimeout(() => {
    coin.classList.remove('spin-fast');

    // Shockwave ring
    const scene = coin.closest('.mutiny-coin-scene');
    if (scene) {
      const sw = document.createElement('div');
      sw.className = 'mutiny-shockwave';
      scene.appendChild(sw);
      setTimeout(() => sw.remove(), 900);
    }

    if (navigator.vibrate) navigator.vibrate([40, 30, 80]);

    if (eventType === 'PLANK') {
      triggerPlankEvent(p);
    } else if (eventType === 'TREASURE') {
      triggerTreasureEvent(p);
    } else if (eventType === 'TIDES') {
      triggerTidesEvent();
    } else {
      drawStandardCard();
    }
  }, 1400);
}

function triggerPlankEvent(p) {
  const transOverlay = document.getElementById('transition-overlay');
  const plankPanel   = document.getElementById('plank-panel');
  const plankText    = document.getElementById('plank-text');
  const passPanel    = document.getElementById('pass-panel');

  if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);

  if (passPanel) passPanel.style.display = 'none';

  if (plankText) {
    plankText.textContent = `${p.name}, drink for as long as you can!`;
  }

  transOverlay.classList.add('is-visible');
  if (plankPanel) {
    plankPanel.style.display = 'flex';
  }

  setTimeout(() => {
    if (plankPanel) plankPanel.style.display = 'none';
    transOverlay.classList.remove('is-visible');
    _runTransition(); // Pass the phone
  }, 3500);
}

function triggerTreasureEvent(p) {
  const FRAMES = [
    'bones', 'gold-coins-and-dark-marks', 'sea-waves', 'skeletons-and-bones',
    'skulls', 'smoking-pipes', 'steering-wheel', 'tentacles', 'under-the-sea'
  ];

  const unlocked = p.unlocked_frames || [];
  const locked = FRAMES.filter(f => !unlocked.includes(f));

  const overlay    = document.getElementById('treasure-overlay');
  const track      = document.getElementById('treasure-track');
  const result     = document.getElementById('treasure-result');
  const actions    = document.getElementById('treasure-actions');
  const winnerName = document.getElementById('treasure-winner-name');
  const subtitle   = document.getElementById('treasure-subtitle');
  const bgGif      = document.getElementById('treasure-bg-gif');

  // Reset state
  overlay.classList.add('is-visible');
  track.innerHTML = '';
  track.style.transition = 'none';
  track.style.transform = 'translateX(0)';
  result.style.display = 'none';
  actions.style.display = 'none';
  if (subtitle) subtitle.textContent = 'Opening Avatar Frame...';

  // Restart background GIF
  if (bgGif) { const s = bgGif.src; bgGif.src = ''; bgGif.src = s; }

  // Pick winner
  let winningFrame, isDuplicate = false;
  if (locked.length === 0) {
    isDuplicate = true;
    winningFrame = FRAMES[Math.floor(Math.random() * FRAMES.length)];
  } else {
    winningFrame = locked[Math.floor(Math.random() * locked.length)];
  }

  // Build reel items
  const TOTAL_ITEMS  = 50;
  const WINNING_IDX  = 43;
  const ITEM_WIDTH   = 88; // px
  const GAP          = 8;  // px, matches CSS gap
  const STRIDE       = ITEM_WIDTH + GAP;

  const trackItems = [];
  for (let i = 0; i < TOTAL_ITEMS; i++) {
    const frame = (i === WINNING_IDX) ? winningFrame : FRAMES[Math.floor(Math.random() * FRAMES.length)];
    const el = document.createElement('div');
    el.className = 'treasure-reel-item';
    el.innerHTML = `<img src="frames/mutiny/${frame}.png" draggable="false">`;
    trackItems.push({ el, frame, isWinner: i === WINNING_IDX });
    track.appendChild(el);
  }

  // Animate — wait one frame so the DOM is painted and we can measure
  requestAnimationFrame(() => {
    const containerWidth = track.parentElement.clientWidth || 340;
    const CENTER = containerWidth / 2;

    // We want item WINNING_IDX centred. Item i's centre is at:
    //   8 (padding-left) + i*STRIDE + ITEM_WIDTH/2
    // We want that to equal CENTER after translateX:
    //   translateX = CENTER - (8 + WINNING_IDX*STRIDE + ITEM_WIDTH/2)
    const winnerCenter = 8 + WINNING_IDX * STRIDE + ITEM_WIDTH / 2;
    const finalX = CENTER - winnerCenter + (Math.random() * 30 - 15); // small random overshoot

    // Start with item 0 centred so the reel visibly scrolls
    const initialX = CENTER - (8 + ITEM_WIDTH / 2);
    track.style.transform = `translateX(${initialX}px)`;

    // Kick off animation after a tiny delay so the browser registers the start position
    setTimeout(() => {
      track.style.transition = 'transform 4s cubic-bezier(0.05, 0.85, 0.1, 1)';
      track.style.transform = `translateX(${finalX}px)`;

      // Show result after scroll lands
      setTimeout(() => {
        trackItems[WINNING_IDX].el.classList.add('is-winner');
        winnerName.textContent = isDuplicate
          ? `${winningFrame.replace(/-/g, ' ')} (duplicate — take 2 sips! 🍺)`
          : `${winningFrame.replace(/-/g, ' ')} frame`;
        result.style.display = 'block';
        actions.style.display = 'flex';
        if (subtitle) subtitle.textContent = isDuplicate ? 'Already owned...' : 'New frame unlocked!';
      }, 4300);
    }, 60);
  });

  const closeTreasure = () => {
    overlay.classList.remove('is-visible');
    _runTransition();
  };

  document.getElementById('treasure-equip-now-btn').onclick = () => {
    if (!isDuplicate) {
      window.Storage.unlockFrame(p.id, winningFrame);
      window.Storage.updatePlayer(p.id, p.name, p.emoji, undefined, winningFrame);
      p.active_frame = winningFrame;
      if (!p.unlocked_frames) p.unlocked_frames = [];
      if (!p.unlocked_frames.includes(winningFrame)) p.unlocked_frames.push(winningFrame);
    }
    closeTreasure();
  };

  document.getElementById('treasure-equip-later-btn').onclick = () => {
    if (!isDuplicate) {
      window.Storage.unlockFrame(p.id, winningFrame);
      if (!p.unlocked_frames) p.unlocked_frames = [];
      if (!p.unlocked_frames.includes(winningFrame)) p.unlocked_frames.push(winningFrame);
    }
    closeTreasure();
  };
}


function triggerTidesEvent() {
  const transOverlay  = document.getElementById('transition-overlay');
  const reversePanel  = document.getElementById('reverse-panel');
  const reverseDirEl  = document.getElementById('reverse-direction-text');
  const passPanel     = document.getElementById('pass-panel');

  if (passPanel) passPanel.style.display = 'none';

  gameDirection *= -1;
  if (navigator.vibrate) navigator.vibrate([100, 80, 100]); 
  const dirWord = gameDirection === 1 ? 'CLOCKWISE ↻' : 'COUNTER-CLOCKWISE ↺';
  if (reverseDirEl) reverseDirEl.textContent = `Direction is now ${dirWord}`;

  transOverlay.classList.add('is-visible');
  if (reversePanel) {
    reversePanel.style.display = 'flex';
    const svg = reversePanel.querySelector('.wind-lines');
    if (svg) {
      const clone = svg.cloneNode(true);
      svg.replaceWith(clone);
    }
  }
  
  setTimeout(() => {
    if (reversePanel) reversePanel.style.display = 'none';
    transOverlay.classList.remove('is-visible');
    _runTransition(); // Pass the phone
  }, 2500);
}

function drawStandardCard() {
    if (deck.length === 0) fillDeck();
    const cardObj = deck.pop();
    const rawStr = cardObj.text;

    const finalPrompt = getReplacedPrompt(rawStr);

    let title = "THE CAPTAIN'S ORDER";
    const lower = finalPrompt.toLowerCase();
    if (lower.includes('everyone') || lower.includes('minority')) {
      title = "GROUP ORDER";
    } else if (lower.includes('round') || lower.includes('until') || lower.includes('curse')) {
      title = "A FOUL CURSE";
    }

    const p = activePlayers[currentPlayerIndex];
    const mutinyModalAvatar = document.getElementById('mutiny-modal-avatar');
    const mutinyModalName   = document.getElementById('mutiny-modal-name');
    const groupVisualizer   = document.getElementById('group-visualizer');

    // Determine if this is a group/social card
    const isGroupCard = cardObj.tags.some(t => ['social', 'callout'].includes(t));

    if (isGroupCard) {
      // Show Crew Compass, hide single-player avatar
      if (mutinyModalAvatar) mutinyModalAvatar.style.display = 'none';
      if (mutinyModalName)   mutinyModalName.style.display   = 'none';
      if (groupVisualizer) {
        groupVisualizer.style.display = 'flex';
        buildCrewRing(currentPlayerIndex);
      }
    } else {
      // Show single-player avatar, hide Crew Compass
      if (mutinyModalAvatar) mutinyModalAvatar.style.display = 'flex';
      if (mutinyModalName)   mutinyModalName.style.display   = '';
      if (groupVisualizer)   groupVisualizer.style.display   = 'none';

      if (p.emoji.endsWith('.png') || p.emoji.endsWith('.gif')) {
        const avatarHtml = (window.UI && window.UI.renderAvatarImg)
          ? window.UI.renderAvatarImg(p)
          : `<img src="${p.emoji}" class="avatar-image" draggable="false">`;
        mutinyModalAvatar.innerHTML = avatarHtml;
        if (window.UI && window.UI.startAnimatedCanvases) window.UI.startAnimatedCanvases();
      } else {
        mutinyModalAvatar.innerHTML = '';
        mutinyModalAvatar.textContent = p.emoji;
      }
      mutinyModalName.textContent = p.name;
    }

    mutinyTitle.textContent = title;
    mutinyText.textContent  = finalPrompt;
    mutinyOverlay.classList.add('is-visible');

    // Snapshot static canvases after the modal renders
    if (window.UI && window.UI.snapshotStaticCanvases) {
      requestAnimationFrame(() => window.UI.snapshotStaticCanvases());
    }
    if (window.UI && window.UI.startAnimatedCanvases) {
      window.UI.startAnimatedCanvases();
    }

    if (cardObj.tags.includes('cbtm')) {
      mutinyTitle.textContent = "COULD BE THE MOVE?";
      mutinyText.style.display = 'none';
      container.classList.add('flash-purple');
      mutinyContinueBtn.style.display = 'none';
      cbtmExplainBtn.style.display = 'block';
      cbtmExplanation.style.display = 'inline-block';
      cbtmExplainBtn.textContent = 'Explain';
      cbtmStartBtn.style.display = 'block';
      cbtmTimer.style.display = 'none';
      cbtmDoneBtn.style.display = 'none';
      cbtmVoteActions.style.display = 'none';
    } else {
      mutinyText.style.display = 'block';
      mutinyContinueBtn.style.display = 'block';
      cbtmExplainBtn.style.display = 'none';
      cbtmExplanation.style.display = 'inline-block';
      cbtmStartBtn.style.display = 'none';
      cbtmTimer.style.display = 'none';
      cbtmDoneBtn.style.display = 'none';
      cbtmVoteActions.style.display = 'none';
    }

    if (navigator.vibrate) navigator.vibrate(50);
    triggerFlashIfGroup(finalPrompt);

    if (cardObj.tags.includes('persistent')) {
      activeCurse = finalPrompt;
      curseText.textContent = finalPrompt;
      curseBanner.style.display = 'block';
    }
}

function _closeMutinyCard() {
  mutinyOverlay.classList.remove('is-visible');
  container.classList.remove('flash-gold', 'flash-red', 'flash-purple');

  if (cbtmInterval) { clearInterval(cbtmInterval); cbtmInterval = null; }
  cbtmStartBtn.style.display = 'none';
  cbtmTimer.style.display = 'none';
  cbtmDoneBtn.style.display = 'none';
  cbtmVoteActions.style.display = 'none';
  cbtmExplainBtn.style.display = 'none';
  cbtmExplanation.style.display = 'none';
  mutinyText.style.display = 'block';
  mutinyContinueBtn.style.display = 'block';

  const playerTag = document.querySelector('#mutiny-card .modal-player-tag');
  if (playerTag) playerTag.classList.remove('is-shrunk');
}

function handleContinue() {
  _closeMutinyCard();
  _runTransition();
}

// ──────────────────────────────────────────────
// TRANSITION SYSTEM — Reverse & Pass the Phone
// ──────────────────────────────────────────────

function _runTransition() {
  const transOverlay  = document.getElementById('transition-overlay');
  const passPanel     = document.getElementById('pass-panel');
  const passAvatarEl  = document.getElementById('pass-avatar');
  const passNameEl    = document.getElementById('pass-name');

  if (!transOverlay) {
    // Fallback if HTML not yet updated
    currentPlayerIndex = (currentPlayerIndex + 1) % activePlayers.length;
    updateTurnUI();
    isSpinning = false;
    return;
  }

  transOverlay.classList.add('is-visible');
  _showPassPanel(passPanel, passAvatarEl, passNameEl, transOverlay);
}

function _showPassPanel(passPanel, passAvatarEl, passNameEl, transOverlay) {
  const reversePanel = document.getElementById('reverse-panel');
  const plankPanel   = document.getElementById('plank-panel');
  if (reversePanel) reversePanel.style.display = 'none';
  if (plankPanel) plankPanel.style.display = 'none';

  // Calculate next player AFTER potential direction flip
  const pCount  = activePlayers.length;
  const nextIdx = (currentPlayerIndex + gameDirection + pCount) % pCount;
  const next    = activePlayers[nextIdx];

  if (passNameEl) passNameEl.textContent = next.name;
  if (passAvatarEl) {
    if (next.emoji.endsWith('.png') || next.emoji.endsWith('.gif')) {
      const avatarHtml = (window.UI && window.UI.renderAvatarImg)
        ? window.UI.renderAvatarImg(next.emoji)
        : `<img src="${next.emoji}" class="avatar-image" draggable="false">`;
      passAvatarEl.innerHTML = avatarHtml;
    } else {
      passAvatarEl.textContent = next.emoji;
    }
  }

  if (passPanel) passPanel.style.display = 'flex';

  // Force the pop animation to restart each time
  if (passAvatarEl) {
    passAvatarEl.style.animation = 'none';
    void passAvatarEl.offsetWidth; // reflow
    passAvatarEl.style.animation = '';
  }

  if (window.UI && window.UI.startAnimatedCanvases) {
    window.UI.startAnimatedCanvases();
  }

  if (navigator.vibrate) navigator.vibrate(60); // one short pulse

  // Snapshot static canvases for the pass avatar
  if (window.UI && window.UI.snapshotStaticCanvases) {
    requestAnimationFrame(() => window.UI.snapshotStaticCanvases());
  }

  // Auto-dismiss after 2.5 s, then advance turn
  setTimeout(() => {
    if (transOverlay) transOverlay.classList.remove('is-visible');
    currentPlayerIndex = nextIdx;
    updateTurnUI();
    isSpinning = false;
  }, 2500);
}

function triggerFlashIfGroup(text) {
  const lower = text.toLowerCase();
  container.classList.remove('flash-gold', 'flash-red', 'flash-purple');

  if (lower.includes('minority') || lower.includes('everyone') || lower.includes('point')) {
    container.classList.add('flash-gold');
  } else if (lower.includes('loser drinks')) {
    container.classList.add('flash-red');
  }
}

// ══════════════════════════════════════════════
// SETTINGS DRAWER
// ══════════════════════════════════════════════

function openSettingsDrawer() {
  filterOverlay.classList.add('is-visible');
  filterDrawer.classList.add('is-open');
  renderSettingsDrawer();
}

function closeSettingsDrawer() {
  filterOverlay.classList.remove('is-visible');
  filterDrawer.classList.remove('is-open');
}

function renderSettingsDrawer() {
  // 1. Rules Tab (Tags)
  filterList.innerHTML = '';
  ALL_TAGS.forEach(tag => {
    const row = document.createElement('div');
    row.className = 'filter-tag-row';

    const label = document.createElement('span');
    label.className = 'filter-tag-label';
    label.innerHTML = `<span class="filter-tag-icon">${tag.icon}</span> ${tag.label}`;

    const toggle = document.createElement('label');
    toggle.className = 'toggle-switch';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = selectedTags.includes(tag.key);

    const slider = document.createElement('span');
    slider.className = 'toggle-slider';

    input.addEventListener('change', () => {
      if (input.checked) {
        if (!selectedTags.includes(tag.key)) selectedTags.push(tag.key);
      } else {
        selectedTags = selectedTags.filter(t => t !== tag.key);
      }
      saveSelectedTags(selectedTags);
      fillDeck();
      if (navigator.vibrate) navigator.vibrate(30);
    });

    toggle.appendChild(input);
    toggle.appendChild(slider);

    row.appendChild(label);
    row.appendChild(toggle);
    filterList.appendChild(row);
  });

  // Events Toggle
  let settings = {};
  try {
    const data = localStorage.getItem('kings-gambit-settings');
    if (data) settings = JSON.parse(data);
  } catch (e) {}

  const tidesToggle = document.getElementById('setting-tides');
  const plankToggle = document.getElementById('setting-plank');
  if (tidesToggle) {
    tidesToggle.checked = settings.mutinyTidesEnabled !== false;
    tidesToggle.onchange = () => {
      settings.mutinyTidesEnabled = tidesToggle.checked;
      localStorage.setItem('kings-gambit-settings', JSON.stringify(settings));
    };
  }
  if (plankToggle) {
    plankToggle.checked = settings.mutinyPlankEnabled !== false;
    plankToggle.onchange = () => {
      settings.mutinyPlankEnabled = plankToggle.checked;
      localStorage.setItem('kings-gambit-settings', JSON.stringify(settings));
    };
  }

  // 2. Packs Tab
  const packList = document.getElementById('pack-list');
  if (packList) {
    packList.innerHTML = '';
    let activePackIds = null;
    try {
      const pData = localStorage.getItem('kings-gambit-mutiny-packs');
      if (pData) activePackIds = JSON.parse(pData);
    } catch(e) {}

    if (window.MutinyPacks) {
      window.MutinyPacks.forEach(pack => {
        const item = document.createElement('div');
        item.className = 'pack-item';
        
        const isPackActive = !activePackIds || activePackIds.includes(pack.id);
        
        const info = document.createElement('div');
        info.className = 'pack-info';
        info.innerHTML = `<span class="pack-name">${pack.name}</span><span class="pack-desc">${pack.description}</span>`;
        
        const toggle = document.createElement('label');
        toggle.className = 'toggle-switch';
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = isPackActive;
        input.onchange = () => {
          let currentActive = activePackIds || window.MutinyPacks.map(p => p.id);
          if (input.checked && !currentActive.includes(pack.id)) currentActive.push(pack.id);
          else if (!input.checked) currentActive = currentActive.filter(id => id !== pack.id);
          activePackIds = currentActive;
          localStorage.setItem('kings-gambit-mutiny-packs', JSON.stringify(currentActive));
          fillDeck();
        };
        const slider = document.createElement('span');
        slider.className = 'toggle-slider';
        toggle.appendChild(input);
        toggle.appendChild(slider);
        
        item.appendChild(info);
        item.appendChild(toggle);
        packList.appendChild(item);
      });
    }
  }

  // 3. Secret Tab
  const secretList = document.getElementById('secret-player-list');
  if (secretList) {
    secretList.innerHTML = '';
    const players = window.Storage.getActivePlayers();
    players.forEach(p => {
      const item = document.createElement('div');
      item.className = 'secret-item';
      
      const pInfo = document.createElement('div');
      pInfo.className = 'secret-player';
      const av = document.createElement('div');
      av.className = 'secret-avatar';
      if (p.emoji.endsWith('.png') || p.emoji.endsWith('.gif')) {
        av.innerHTML = window.UI && window.UI.renderAvatarImg ? window.UI.renderAvatarImg(p.emoji) : `<img src="${p.emoji}" class="avatar-image" draggable="false">`;
      } else {
        av.textContent = p.emoji;
      }
      pInfo.appendChild(av);
      const n = document.createElement('span');
      n.textContent = p.name;
      pInfo.appendChild(n);
      
      const toggle = document.createElement('button');
      toggle.className = `secret-toggle${p.is_planked ? ' is-active' : ''}`;
      toggle.innerHTML = '⚓';
      toggle.onclick = () => {
        p.is_planked = !p.is_planked;
        toggle.className = `secret-toggle${p.is_planked ? ' is-active' : ''}`;
        window.Storage.updatePlayer(p.id, p.name, p.emoji, p.is_planked);
        activePlayers = window.Storage.getActivePlayers();
      };
      
      item.appendChild(pInfo);
      item.appendChild(toggle);
      secretList.appendChild(item);
    });
  }
}

// Setup tabs
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.settings-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.settings-pane').forEach(p => p.classList.remove('is-active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('is-active');
    });
  });
});

// ══════════════════════════════════════════════
// BOOT
// ══════════════════════════════════════════════
init();

// ══════════════════════════════════════════════
// DEV TOOLS — window.mutiny
// ══════════════════════════════════════════════
let _queuedEvent = null;

window.mutiny = {
  /**
   * Queue a specific event to fire on the next spin.
   * Usage: mutiny.queue('TREASURE')  |  mutiny.queue('PLANK')  |  mutiny.queue('TIDES')
   */
  queue: (eventType) => {
    const valid = ['PLANK', 'TIDES', 'TREASURE'];
    const key = eventType.toUpperCase();
    if (!valid.includes(key)) {
      console.warn(`[mutiny] Unknown event '${eventType}'. Valid: ${valid.join(', ')}`);
      return;
    }
    _queuedEvent = key;
    console.log(`[mutiny] Event '${key}' queued for next spin. 🍚`);
  },

  /**
   * Clear any queued event.
   */
  clear: () => {
    _queuedEvent = null;
    console.log('[mutiny] Queued event cleared.');
  }
};
