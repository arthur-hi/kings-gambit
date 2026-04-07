// --- State ---
let deck = [];
let activePlayers = [];
let currentPlayerIndex = 0;
let kingsDrawn = 0;
let currentCardEl = null;

const SUITS = ['♠', '♥', '♣', '♦'];
const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

// DOM Elements
const deckArea = document.getElementById('deck-area');
const turnEmoji = document.getElementById('turn-emoji');
const turnName = document.getElementById('turn-name');
const glassIcons = document.querySelectorAll('.glass-icon');

// Modals
const ruleOverlay = document.getElementById('rule-overlay');
const ruleTitle = document.getElementById('rule-title');
const ruleText = document.getElementById('rule-text');
const ruleSubtext = document.getElementById('rule-subtext');
const ruleContinueBtn = document.getElementById('rule-continue-btn');

const gameOverOverlay = document.getElementById('game-over-overlay');
const gameOverText = document.getElementById('game-over-text');

// Blindfold
const blindfoldScreen = document.getElementById('blindfold-screen');
const blindfoldName = document.getElementById('blindfold-name');
const blindfoldTimer = document.getElementById('blindfold-timer');
const blindfoldDesc = document.getElementById('blindfold-desc');
const readyBtn = document.getElementById('ready-btn');
const pressProgress = document.getElementById('press-progress');

// Timers
let countdownInterval = null;
let holdTimeout = null;
let holdProgressInterval = null;

// --- Initialize ---
function init() {
  activePlayers = window.Storage.getActivePlayers();
  if (activePlayers.length < 2) {
    alert("You need at least 2 players!");
    window.location.href = 'index.html';
    return;
  }

  currentPlayerIndex = 0;
  kingsDrawn = 0;
  generateDeck();
  shuffleDeck();
  renderDeck();
  updateTurnUI();
  setupEventListeners();
}

function generateDeck() {
  deck = [];
  for (let s of SUITS) {
    for (let v of VALUES) {
      deck.push({ suit: s, value: v, isRed: s === '♥' || s === '♦' });
    }
  }
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// --- Render ---
function renderDeck() {
  deckArea.innerHTML = '';
  // Render every card into the DOM once
  deck.forEach((cardData, idx) => {
    const cardEl = createCardElement(cardData);
    // Assign a base random rotation for variety in the stack
    const randomRot = (Math.random() + 0.5) * 8; // between -4 and +4
    cardEl.dataset.rot = randomRot;
    deckArea.appendChild(cardEl);
  });

  updateDeckPositions();
}

function updateDeckPositions() {
  const cards = Array.from(deckArea.querySelectorAll('.card:not(.is-discarded)'));
  cards.forEach((card, domIndex) => {
    const stackOffset = cards.length - 1 - domIndex; // 0 is top
    const visibleOffset = Math.min(stackOffset, 3);

    card.style.top = `${-visibleOffset * (Math.random() * 5 + 15)}px`;
    card.style.left = `${-visibleOffset * (Math.random() * 5 + 15)}px`;
    card.style.zIndex = domIndex;

    if (stackOffset === 0) {
      // Top card is straight and clickable
      card.style.setProperty('--rot', `0deg`);
      card.addEventListener('click', handleCardClick);
    } else {
      // Cards further back get their random rotation + an extra fanout
      const baseRot = parseFloat(card.dataset.rot);
      const stackRot = baseRot + (visibleOffset * -2);
      card.style.setProperty('--rot', `${stackRot}deg`);
      card.removeEventListener('click', handleCardClick);
    }
  });
}

function createCardElement(cardData) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.value = cardData.value;
  card.dataset.suit = cardData.suit;

  const back = document.createElement('div');
  back.className = 'card-face card-back';

  const front = document.createElement('div');
  front.className = `card-face card-front ${!cardData.isRed ? 'black-suit' : ''}`;
  front.innerHTML = `${cardData.value}<br><span style="font-size: 0.5em">${cardData.suit}</span>`;

  card.appendChild(back);
  card.appendChild(front);

  return card;
}

function updateTurnUI() {
  const p = activePlayers[currentPlayerIndex];

  if (p.emoji.endsWith('.png') || p.emoji.endsWith('.gif')) {
    turnEmoji.innerHTML = `<img src="${p.emoji}" class="avatar-image" draggable="false">`;
  } else {
    turnEmoji.textContent = p.emoji;
  }

  turnName.textContent = `${p.name}'s turn`;
}

function advanceTurn() {
  currentPlayerIndex = (currentPlayerIndex + 1) % activePlayers.length;
  updateTurnUI();
}

function updateKingTracker() {
  for (let i = 0; i < 4; i++) {
    if (i < kingsDrawn) {
      glassIcons[i].classList.add('filled');
    }
  }
}

// --- Interaction ---
function handleCardClick(e) {
  if (deck.length === 0) return;
  const cardEl = e.currentTarget;
  currentCardEl = cardEl;

  // Animate Flip
  cardEl.classList.add('is-flipped');

  setTimeout(() => {
    processCardResolution();
  }, 600); // Wait for flip animation
}

function processCardResolution() {
  const cardData = deck.pop(); // Remove target

  if (cardData.value === 'K') {
    kingsDrawn++;
    updateKingTracker();
    if (kingsDrawn === 4) {
      handleFinalKing();
    } else {
      triggerBlindfold();
    }
  } else {
    showRuleModal(cardData.value);
  }
}

function discardCurrentCard() {
  if (currentCardEl) {
    currentCardEl.classList.add('is-discarded');
    setTimeout(() => {
      if (kingsDrawn < 4) {
        advanceTurn();
        updateDeckPositions(); // Slides the cards immediately into place
      }
    }, 200);
  }
}

// --- Rules Dictionary ---
function getRuleText(value, playerName) {
  switch (value) {
    case 'A': return { main: "Waterfall! Everyone drinks!" };
    case '2': return { main: `${playerName}, pick someone to drink.` };
    case '3': return { main: `${playerName}, take a drink.` };
    case '4': return { main: "Last one to touch the floor drinks!" };
    case '5': return { main: "All the guys drink." };
    case '6': return { main: "All the girls drink." };
    case '7': return { main: "Point to the sky! Last one drinks." };
    case '8': return {
      main: `${playerName}, pick a drinking buddy.`,
      sub: "You are now tethered. Whenever you drink for the rest of the game, they drink too."
    };
    case '9': return {
      main: `${playerName}, pick a word to rhyme.`,
      sub: "Pick a word like 'cat'. Go around the circle rhyming. If you fail, you drink."
    };
    case '10': return {
      main: `${playerName}, pick a category.`,
      sub: "e.g., 'car brands' or 'dog breeds'. First to pause, stutter, or repeat drinks."
    };
    case 'J': return {
      main: "Never have I ever! Everyone 3 fingers.",
      sub: "Everyone starts with 3 fingers. Say something you've never done; if others have, they drop a finger."
    };
    case 'Q': return {
      main: `Question Master! ${playerName} is now the master.`,
      sub: "If anyone answers a question you ask, they drink. Lasts until the next Queen is drawn."
    };
    default: return { main: "Draw again!" };
  }
}

function showRuleModal(value) {
  const p = activePlayers[currentPlayerIndex];
  const rule = getRuleText(value, p.name);

  const ruleModalAvatar = document.getElementById('rof-modal-avatar');
  const ruleModalName = document.getElementById('rof-modal-name');

  if (p.emoji.endsWith('.png') || p.emoji.endsWith('.gif')) {
    ruleModalAvatar.innerHTML = `<img src="${p.emoji}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-md);" draggable="false">`;
  } else {
    ruleModalAvatar.textContent = p.emoji;
  }
  ruleModalName.textContent = p.name;

  ruleTitle.textContent = value === 'A' ? 'ACE' : value === 'J' ? 'JACK' : value === 'Q' ? 'QUEEN' : value;
  ruleText.textContent = rule.main;

  if (rule.sub) {
    ruleSubtext.style.display = 'block';
    ruleSubtext.textContent = rule.sub;
  } else {
    ruleSubtext.style.display = 'none';
    ruleSubtext.textContent = '';
  }

  ruleOverlay.classList.add('is-visible');
}

ruleContinueBtn.addEventListener('click', () => {
  ruleOverlay.classList.remove('is-visible');
  discardCurrentCard();

  if (deck.length === 0) {
    gameOverText.textContent = "The deck is empty! Everyone finish your drinks.";
    gameOverOverlay.classList.add('is-visible');
  }
});

// --- The Blind Gambit ---
function triggerBlindfold() {
  const p = activePlayers[currentPlayerIndex];
  blindfoldName.textContent = p.name;
  blindfoldTimer.textContent = '30';
  blindfoldDesc.textContent = `Everyone else: quickly mix a mystery drink for ${p.name}!`;
  blindfoldScreen.classList.add('is-visible');

  let time = 30;
  countdownInterval = setInterval(() => {
    time--;
    blindfoldTimer.textContent = time;
    if (time <= 0) {
      clearInterval(countdownInterval);
    }
  }, 1000);
}

function handleFinalKing() {
  triggerBlindfold();
  // Override slightly for final king
  setTimeout(() => {
    blindfoldName.textContent += " (FINAL KING)";
    blindfoldDesc.textContent = `The final King has fallen! Mix the last mystery drink for ${p.name}!`;
  }, 100);
}

// Long-press mechanic
function startPress(e) {
  e.preventDefault(); // Prevent text selection/defaults
  readyBtn.textContent = 'HOLDING...';
  let progress = 0;

  holdProgressInterval = setInterval(() => {
    progress += 5; // 5% per 100ms = 2000ms total
    pressProgress.style.width = `${progress}%`;
  }, 100);

  holdTimeout = setTimeout(() => {
    // Success
    clearPress();
    readyBtn.textContent = 'OPEN EM!';
    pressProgress.style.width = '100%';
    pressProgress.style.backgroundColor = 'var(--color-primary)';

    setTimeout(() => {
      dismissBlindfold();
    }, 500);

  }, 2000);
}

function clearPress(e) {
  if (e) { }
  clearTimeout(holdTimeout);
  clearInterval(holdProgressInterval);
  holdTimeout = null;

  if (blindfoldScreen.classList.contains('is-visible') && readyBtn.textContent !== 'OPEN EM!') {
    readyBtn.textContent = 'HOLD TO REVEAL';
    pressProgress.style.width = '0%';
  }
}

function dismissBlindfold() {
  clearInterval(countdownInterval);
  blindfoldScreen.classList.remove('is-visible');

  // Reset UI elements for next king
  setTimeout(() => {
    readyBtn.textContent = 'HOLD TO REVEAL';
    pressProgress.style.width = '0%';
    pressProgress.style.backgroundColor = 'var(--color-secondary)';

    discardCurrentCard();

    if (kingsDrawn === 4) {
      setTimeout(() => {
        gameOverText.textContent = "The 4th King has been drawn! The cursed goblet awaits.";
        gameOverOverlay.classList.add('is-visible');
      }, 500); // Wait for the discard animation before slamming the game over
    }
  }, 500);
}

function setupEventListeners() {
  readyBtn.addEventListener('mousedown', startPress);
  readyBtn.addEventListener('touchstart', startPress, { passive: false });

  window.addEventListener('mouseup', clearPress);
  window.addEventListener('touchend', clearPress);
}

// Start
init();
