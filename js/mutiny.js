const mutinyCards = [
  { text: "{player}, do an action to {left}. they repeat it and add one. continue until someone fails. loser drinks.", tags: ['duel', 'physical', 'memory'] },
  { text: "{player}, race {across} to finish your drink. loser takes another drink.", tags: ['physical'] },
  { text: "travel: whoever has travelled to the most countries drinks.", tags: ['physical'] },
  { text: "tea or coffee: everyone picks a side. the minority group drinks.", tags: ['social'] },
  { text: "{player}, tell 2 truths and 1 lie. everyone who guesses wrong drinks.", tags: ['social', 'memory'] },
  { text: "{player}, touch your toes without bending your legs or drink.", tags: ['physical'] },
  { text: "beards: all bearded players drink.", tags: ['callout'] },
  { text: "longest hair: the player with the longest hair drinks.", tags: ['callout'] },
  { text: "currencies: {player}, start naming currencies. first to repeat or fail drinks.", tags: ['memory'] },

  { text: "{player}, give any player a hug.", tags: ['spicy'] },
  { text: "european countries: {player}, start naming countries in europe. first to repeat or fail drinks.", tags: ['memory'] },
  { text: "sample: everyone offers {player} their drink. you pick one and take a sip.", tags: ['social'] },
  { text: "{player}, take a selfie with {right}. both drink.", tags: ['duel'] },
  { text: "biggest hands: the person with the biggest hands drinks.", tags: ['callout'] },
  { text: "banned word: {player}, pick a word that is banned for two rounds. anyone who says it drinks.", tags: ['physical'] },
  { text: "no english: {player}, don't speak english for one round.", tags: ['physical'] },
  { text: "pizza or burgers: everyone picks a side. the minority group drinks.", tags: ['social'] },
  { text: "trivia: {player}, ask {right} a question. correct = you drink, wrong = they drink.", tags: ['duel'] },
  { text: "{player}, try to walk in a straight line or drink.", tags: ['physical'] },
  { text: "{player}, flex and take a drink.", tags: ['physical'] },
  { text: "just drink: {player}, exactly what it says. drink.", tags: ['physical'] },
  { text: "left choice: {player}, do whatever {left} wants or drink.", tags: ['duel'] },
  { text: "nicest smell: {player}, pick the player who smells nicest; they drink.", tags: ['spicy'] },
  { text: "king: {player}, command everyone to do anything. if they can't, they drink.", tags: ['social'] },
  { text: "lipstick: anyone wearing lipstick drinks and kisses someone on the cheek.", tags: ['spicy'] },
  { text: "the invisible man: everyone ignores {player} for one round.", tags: ['social'] },
  { text: "us presidents: {player}, start naming presidents. first to repeat or fail drinks.", tags: ['memory'] },
  { text: "shortest player: the shortest player sits on the floor for one round.", tags: ['callout'] },
  { text: "the mixologist: {player}, take some drink from {right} and add it to yours.", tags: ['duel'] },
  { text: "double trouble: {player}, you have to drink double for one round.", tags: ['physical'] },
  { text: "straightest teeth: the player with the straightest teeth drinks.", tags: ['callout'] },
  { text: "mexican wave: {player} drinks, then {left}, then the next, until it comes back.", tags: ['duel'] },
  { text: "animal farm: everyone makes an animal noise and drinks.", tags: ['social'] },
  { text: "{player}, play rock paper scissors against {left}. loser drinks.", tags: ['duel'] },
  { text: "seeing double: everyone drinks double for one round.", tags: ['social'] },
  { text: "seven: {player}, count up from 1. say 'drink' on multiples of 7 or numbers with a 7 to reverse. first to mess up drinks.", tags: ['physical'] },
  { text: "round robin: {player}, take a sip of every player's drink.", tags: ['physical'] },
  { text: "pass the glass: everyone passes their drink to the left. drink your new glass.", tags: ['social'] },
  { text: "even age: if your age is an even number, drink.", tags: ['callout'] },
  { text: "waterfall lite: {player} take a big drink.", tags: ['physical'] },
  { text: "hands up: everyone puts hands in the air. last one drinks.", tags: ['social', 'callout'] },
  { text: "{player}, drink for every letter in your name.", tags: ['physical'] },
  { text: "the finger: everyone points at someone. most points drinks.", tags: ['social'] },
  { text: "{player}, tilt your head all the way back and drink.", tags: ['physical'] },
  { text: "coin flip: {player}, call heads or tails and flip. correct = everyone else drinks, wrong = you drink.", tags: ['social'] },
  { text: "the floor is lava: anyone who touches the floor for one round drinks.", tags: ['physical'] },
  { text: "double down: the last person who drank must drink again.", tags: ['physical'] },
  { text: "movie genres: {player}, name genres clockwise. first to repeat or fail drinks.", tags: ['social', 'memory'] },
  { text: "triple threat: {player}, pick three players to drink.", tags: ['physical'] },
  { text: "capital cities: {player}, name capitals clockwise. first to repeat or fail drinks.", tags: ['social', 'memory'] },
  { text: "gift giver: {right} must find something and bring it to {player} as a gift.", tags: ['duel'] },
  { text: "elder statesman: the oldest player drinks.", tags: ['callout'] },
  { text: "look left: {left} drinks.", tags: ['duel'] },
  { text: "right hand man: {player}, high five {right}. both drink.", tags: ['duel'] },
  { text: "quick reflexes: everyone stand up. last one standing drinks.", tags: ['social', 'physical'] },
  { text: "passport check: {player}, drink for every country you've visited.", tags: ['physical'] },
  { text: "gender majority: if there are more females, females drink. if more males, males drink.", tags: ['physical'] },
  { text: "social: everyone drinks!", tags: ['social'] },
  { text: "dynamic duo: {player}, if your best friend is playing, you both drink.", tags: ['physical'] },
  { text: "blind taste test: {player}, guess a secret drink from {left}. wrong = you drink, right = they drink.", tags: ['duel'] },
  { text: "boulder: {player} drinks 1x, {left} drinks 2x, next drinks 3x, etc., until it returns.", tags: ['duel'] },
  { text: "cheers: everyone raise their drinks and say cheers.", tags: ['social'] },
  { text: "asian countries: {player}, name countries in asia. first to repeat or fail drinks.", tags: ['memory'] },
  { text: "glasses: everyone wearing glasses drinks.", tags: ['social', 'callout'] },
  { text: "buddy: {player}, pick a player to drink with you.", tags: ['physical'] },
  { text: "spin the bottle: {player}, spin a bottle. whoever it lands on drinks.", tags: ['physical'] },

  { text: "{player}, you must shake hands with every player.", tags: ['callout'] },
  { text: "raise your drinks! the last person to do it drinks.", tags: ['social'] },
  { text: "favourite colour: everyone say their favourite colour. if anyone picks the same one, they drink.", tags: ['social'] },
  { text: "compliments: {player}, start going around clockwise giving each other compliments.", tags: ['spicy', 'social'] },
  { text: "one leg: everyone stand on one leg. the first one to fall drinks.", tags: ['social', 'physical'] },
  { text: "touch the floor: everyone touch the floor. the last person to do it drinks.", tags: ['social', 'physical'] },
  { text: "gestures: {player}, make a gesture. {left} repeats it and adds one. keep going until someone forgets. loser drinks.", tags: ['duel', 'memory'] },
  { text: "beatles songs: {player}, start naming beatles songs. first to repeat or fail drinks.", tags: ['memory'] },
  { text: "dog breeds: {player}, start naming dog breeds. first to repeat or fail drinks.", tags: ['memory'] },
  { text: "eye contact roulette: everyone look at the ground. on the count of three, look up at another player's eyes. any players making eye contact must drink.", tags: ['spicy', 'social'] },
  { text: "most likely: {player}, state a 'who is most likely to...' situation. on the count of three, everyone points. that player drinks.", tags: ['social'] },
  { text: "best dressed: {player}, choose which player is best dressed; they must drink.", tags: ['callout'] },
  { text: "{player}, do 10 push ups or take a drink.", tags: ['physical'] },
  { text: "shoulder tap: {player}, turn away. {random} taps your shoulder. if you guess correctly, everyone else drinks. if wrong, you drink.", tags: ['social'] },
  { text: "{player}, pick three adjectives to describe {left} and then both drink.", tags: ['duel'] },
  { text: "going to the bar: memory game. {player}, name a drink. each person adds to the list. first to forget or repeat drinks.", tags: ['memory'] },
  { text: "fists of five: everyone show a number from 1 to 5 on their hand. any players with the same number must drink.", tags: ['social'] },
  { text: "natural disasters: {player}, name natural disasters clockwise. first to repeat or fail drinks.", tags: ['social', 'memory'] },
  { text: "rule maker: {player}, create a rule that players must follow or drink (e.g., 'no one say the word what').", tags: ['physical'] },
  { text: "phone ban: for one round, if anyone checks their phone, they must drink.", tags: ['physical'] },
  { text: "{player}, exactly what it says—take two drinks.", tags: ['physical'] },
  { text: "drink twins: all players with the same drink as {player} must drink.", tags: ['social'] },
  { text: "{player}, arm wrestle {right}. the loser must down their drink.", tags: ['duel'] },
  { text: "old friends: {player}, the player you have known the longest must drink.", tags: ['physical'] },
  { text: "thumb war: {player}, have a thumb war with {random}. the loser must finish their drink.", tags: ['duel'] },

  { text: "red or blue: everyone picks a side. the minority group drinks.", tags: ['social'] },
  { text: "{player}, stand on one leg and take a drink.", tags: ['physical'] },

  { text: "Left Hand Only. If the group catches you using your right hand, you drink. If you use it and get away with it, call them out—everyone else drinks. Lasts until a new curse overwrites it.", tags: ['persistent', 'physical'] },
  { text: "No Swearing. If the group catches you swearing, you drink. If you swear and get away with it, call them out—everyone else drinks. Lasts until a new curse overwrites it.", tags: ['persistent', 'callout'] },
  { text: "Little Green Man. You must remove an imaginary green man from your cup before sipping, and put him back after. Catch {player} forgetting = they drink. {player} gets away with it = group drinks. Lasts until a new curse overwrites it.", tags: ['persistent', 'memory'] },
  { text: "Eye Contact. {player} is now Medusa. Anyone who makes eye contact with {player} drinks. But if {player} makes eye contact and someone calls them out first, {player} drinks. Lasts until a new curse overwrites it.", tags: ['persistent', 'spicy'] },

  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },

];

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
  return Object.values(all).filter(c => c && c.text && c.text.trim().length > 0);
}

// ══════════════════════════════════════════════
// GAME STATE
// ══════════════════════════════════════════════

let activePlayers = [];
let currentPlayerIndex = 0;
let isSpinning = false;
let deck = [];
let activeCurse = null;

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
const cardBuilderClear = document.getElementById('card-builder-clear');
const cardBuilderClose = document.getElementById('card-builder-close');

let activeBuilderPlayerId = null; // which player's card is being edited
let builderActiveTags = [];       // currently selected tags in the builder

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
      const img = document.createElement('img');
      img.src = p.emoji;
      img.draggable = false;
      frame.appendChild(img);
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
}

function openCardBuilder(player) {
  activeBuilderPlayerId = player.id;

  // Set player identity in builder header
  builderAvatar.innerHTML = '';
  if (player.emoji.endsWith('.png') || player.emoji.endsWith('.gif')) {
    const img = document.createElement('img');
    img.src = player.emoji;
    builderAvatar.appendChild(img);
  } else {
    builderAvatar.textContent = player.emoji;
  }
  builderPlayerName.textContent = player.name;

  // Load existing card data (if any)
  const existing = getCustomCards()[player.id];
  cardEditable.textContent = existing ? existing.text : '';
  builderActiveTags = existing ? [...existing.tags.filter(t => t !== 'custom')] : [];

  // Render tags
  renderBuilderTags();

  // Show overlay
  cardBuilderOverlay.classList.add('is-visible');

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

function renderBuilderTags() {
  builderTagRow.innerHTML = '';
  ALL_TAGS.forEach(tag => {
    const pill = document.createElement('button');
    pill.className = `card-tag-pill${builderActiveTags.includes(tag.key) ? ' is-active' : ''}`;
    pill.textContent = `${tag.icon} ${tag.label}`;
    pill.addEventListener('click', () => {
      if (builderActiveTags.includes(tag.key)) {
        builderActiveTags = builderActiveTags.filter(t => t !== tag.key);
        pill.classList.remove('is-active');
      } else {
        builderActiveTags.push(tag.key);
        pill.classList.add('is-active');
      }
      if (navigator.vibrate) navigator.vibrate(20);
    });
    builderTagRow.appendChild(pill);
  });
}

function closeCardBuilder() {
  cardBuilderOverlay.classList.remove('is-visible');
  activeBuilderPlayerId = null;
  // Blur to dismiss keyboard on mobile
  cardEditable.blur();
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
    }
  });
}

function insertTokenAtCursor(token, chipEl) {
  // Visual feedback on chip
  chipEl.classList.add('inserting');
  setTimeout(() => chipEl.classList.remove('inserting'), 300);

  cardEditable.focus();
  insertToken(token);
  if (navigator.vibrate) navigator.vibrate(30);
}

function insertToken(token) {
  const sel = window.getSelection();
  if (!sel || !sel.rangeCount) {
    // If no selection, just append
    cardEditable.textContent += token;
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
  const textNode = document.createTextNode(token);
  range.insertNode(textNode);

  // Move cursor after the inserted token
  range.setStartAfter(textNode);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
}

// Card Builder event listeners
cardBuilderSave.addEventListener('click', () => {
  if (!activeBuilderPlayerId) return;

  const rawText = cardEditable.textContent.trim();
  if (!rawText) {
    // Nothing written — just close
    closeCardBuilder();
    return;
  }

  const tags = ['custom', ...builderActiveTags];
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

cardBuilderClear.addEventListener('click', () => {
  cardEditable.textContent = '';
  builderActiveTags = [];
  renderBuilderTags();
  if (activeBuilderPlayerId) {
    clearCustomCard(activeBuilderPlayerId);
    renderCrewManifest();
  }
  if (navigator.vibrate) navigator.vibrate(20);
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

  coin.addEventListener('click', handleSpin);
  mutinyContinueBtn.addEventListener('click', handleContinue);

  backBtn.addEventListener('click', () => exitOverlay.classList.add('is-visible'));
  exitStayBtn.addEventListener('click', () => exitOverlay.classList.remove('is-visible'));
  exitQuitBtn.addEventListener('click', () => window.location.href = 'index.html');

  filterBtn.addEventListener('click', openFilterDrawer);
  filterCloseBtn.addEventListener('click', closeFilterDrawer);
  filterOverlay.addEventListener('click', closeFilterDrawer);
  renderFilterDrawer();

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

  // Standard cards filtered by tag preferences
  const standardCards = mutinyCards.filter(card => {
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

  if (p.emoji.endsWith('.png') || p.emoji.endsWith('.gif')) {
    turnEmoji.innerHTML = `<img src="${p.emoji}" class="avatar-image" draggable="false">`;
  } else {
    turnEmoji.textContent = p.emoji;
  }

  turnName.textContent = `Capt. ${p.name}'s turn`;
}

function getReplacedPrompt(rawString) {
  const cIndex = currentPlayerIndex;
  const pCount = activePlayers.length;

  const pPlayer = activePlayers[cIndex].name;
  const pLeft = activePlayers[(cIndex - 1 + pCount) % pCount].name;
  const pRight = activePlayers[(cIndex + 1) % pCount].name;

  let randIdx = Math.floor(Math.random() * pCount);
  while (randIdx === cIndex && pCount > 1) {
    randIdx = Math.floor(Math.random() * pCount);
  }
  const pRandom = activePlayers[randIdx].name;

  const acrossIdx = (cIndex + Math.floor(pCount / 2)) % pCount;
  const pAcross = activePlayers[acrossIdx].name;

  return rawString
    .replace(/{player}/g, pPlayer)
    .replace(/{left}/g, pLeft)
    .replace(/{right}/g, pRight)
    .replace(/{random}/g, pRandom)
    .replace(/{across}/g, pAcross);
}

function handleSpin() {
  if (isSpinning) return;
  isSpinning = true;

  coin.classList.remove('spin-fast');
  void coin.offsetWidth;
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

    if (deck.length === 0) fillDeck();
    const cardObj = deck.pop();
    const rawStr = cardObj.text;

    const finalPromt = getReplacedPrompt(rawStr);

    let title = "THE CAPTAIN'S ORDER";
    const lower = finalPromt.toLowerCase();
    if (lower.includes('everyone') || lower.includes('minority')) {
      title = "GROUP ORDER";
    } else if (lower.includes('round') || lower.includes('until') || lower.includes('curse')) {
      title = "A FOUL CURSE";
    }

    const p = activePlayers[currentPlayerIndex];
    const mutinyModalAvatar = document.getElementById('mutiny-modal-avatar');
    const mutinyModalName = document.getElementById('mutiny-modal-name');
    if (p.emoji.endsWith('.png') || p.emoji.endsWith('.gif')) {
      mutinyModalAvatar.innerHTML = `<img src="${p.emoji}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-md);" draggable="false">`;
    } else {
      mutinyModalAvatar.textContent = p.emoji;
    }
    mutinyModalName.textContent = p.name;

    mutinyTitle.textContent = title;
    mutinyText.textContent = finalPromt;
    mutinyOverlay.classList.add('is-visible');

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
    triggerFlashIfGroup(finalPromt);

    if (cardObj.tags.includes('persistent')) {
      activeCurse = finalPromt;
      curseText.textContent = finalPromt;
      curseBanner.style.display = 'block';
    }
  }, 1400);
}

function handleContinue() {
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

  currentPlayerIndex = (currentPlayerIndex + 1) % activePlayers.length;
  updateTurnUI();

  isSpinning = false;
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
// FILTER DRAWER
// ══════════════════════════════════════════════

function openFilterDrawer() {
  filterOverlay.classList.add('is-visible');
  filterDrawer.classList.add('is-open');
}

function closeFilterDrawer() {
  filterOverlay.classList.remove('is-visible');
  filterDrawer.classList.remove('is-open');
}

function renderFilterDrawer() {
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
}

// ══════════════════════════════════════════════
// BOOT
// ══════════════════════════════════════════════
init();
