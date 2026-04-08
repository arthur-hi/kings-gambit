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
  { text: "{player}, kiss {random} on the forehead.", tags: ['spicy'] },
  { text: "pizza or burgers: everyone picks a side. the minority group drinks.", tags: ['social'] },
  { text: "trivia: {player}, ask {right} a question. correct = you drink, wrong = they drink.", tags: ['duel'] },
  { text: "{player}, try to walk in a straight line or drink.", tags: ['physical'] },
  { text: "{player}, flex and take a drink.", tags: ['physical'] },
  { text: "just drink: {player}, exactly what it says. drink.", tags: ['physical'] },
  { text: "left choice: {player}, do whatever {left} wants or drink.", tags: ['duel'] },
  { text: "card of death: {player}, down your drink and take a shot.", tags: ['physical'] },
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
  { text: "dance off: {player}, dance until your next turn or down your drink.", tags: ['physical'] },
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
  { text: "passport check: {player}, drink for every country you’ve visited.", tags: ['physical'] },
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
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },
  { text: "", tags: ['cbtm', 'social'] },

];

let activePlayers = [];
let currentPlayerIndex = 0;
let isSpinning = false;
let deck = [];
let activeCurse = null;

// DOM Elements
const container = document.getElementById('mutiny-container');
const coin = document.getElementById('mutiny-coin');
const promptDisplay = document.getElementById('mutiny-prompt');
const turnEmoji = document.getElementById('turn-emoji');
const turnName = document.getElementById('turn-name');

const mutinyOverlay = document.getElementById('mutiny-overlay');
const mutinyTitle = document.getElementById('mutiny-title');
const mutinyText = document.getElementById('mutiny-text');
const mutinyContinueBtn = document.getElementById('mutiny-continue-btn');

// Exit Modal
const backBtn = document.getElementById('back-btn');
const exitOverlay = document.getElementById('exit-overlay');
const exitStayBtn = document.getElementById('exit-stay-btn');
const exitQuitBtn = document.getElementById('exit-quit-btn');

// Curse Banner
const curseBanner = document.getElementById('curse-banner');
const curseText = document.getElementById('curse-text');

// CBTM Elements
const cbtmTimer = document.getElementById('cbtm-timer');
const cbtmStartBtn = document.getElementById('cbtm-start-btn');
const cbtmVoteActions = document.getElementById('cbtm-vote-actions');
const cbtmWinBtn = document.getElementById('cbtm-win-btn');
const cbtmLoseBtn = document.getElementById('cbtm-lose-btn');
const cbtmExplainBtn = document.getElementById('cbtm-explain-btn');
const cbtmExplanation = document.getElementById('cbtm-explanation');
const cbtmDoneBtn = document.getElementById('cbtm-done-btn');
let cbtmInterval = null;

function init() {
  activePlayers = window.Storage.getActivePlayers();
  if (activePlayers.length < 2) {
    alert("You need at least 2 players!");
    window.location.href = 'index.html';
    return;
  }

  // Create an initial shuffled deck stack so it doesn't repeat too fast
  fillDeck();

  currentPlayerIndex = 0;
  updateTurnUI();

  coin.addEventListener('click', handleSpin);
  mutinyContinueBtn.addEventListener('click', handleContinue);

  backBtn.addEventListener('click', () => exitOverlay.classList.add('is-visible'));
  exitStayBtn.addEventListener('click', () => exitOverlay.classList.remove('is-visible'));
  exitQuitBtn.addEventListener('click', () => window.location.href = 'index.html');

  const playerTag = document.querySelector('#mutiny-card .modal-player-tag');

  // CBTM: Explain toggle
  cbtmExplainBtn.addEventListener('click', () => {
    const isShown = cbtmExplanation.style.display === 'block';
    cbtmExplanation.style.display = isShown ? 'inline-block' : 'block';
    cbtmExplainBtn.textContent = isShown ? 'Explain' : 'Hide';
    // Shrink avatar when explanation is expanded
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
    if (cbtmInterval) {
      clearInterval(cbtmInterval);
      cbtmInterval = null;
    }
    cbtmTimer.style.display = 'none';
    cbtmDoneBtn.style.display = 'none';
    cbtmVoteActions.style.display = 'flex';
  });

  // CBTM: Vote resolution
  cbtmWinBtn.addEventListener('click', handleContinue);
  cbtmLoseBtn.addEventListener('click', handleContinue);
}

function fillDeck() {
  const excludedTags = [];
  if (activePlayers.length === 2) {
    excludedTags.push('social');
    excludedTags.push('spicy');
    excludedTags.push('physical');
    console.log("excluded tags: " + excludedTags)
  }

  deck = mutinyCards.filter(card => {
    return !card.tags.some(tag => excludedTags.includes(tag));
  });

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

  // Determine targets
  const pPlayer = activePlayers[cIndex].name;

  // Left is logically index-1 (who played before), Right is index+1 (who plays next)
  const pLeft = activePlayers[(cIndex - 1 + pCount) % pCount].name;
  const pRight = activePlayers[(cIndex + 1) % pCount].name;

  // Random other
  let randIdx = Math.floor(Math.random() * pCount);
  while (randIdx === cIndex && pCount > 1) {
    randIdx = Math.floor(Math.random() * pCount);
  }
  const pRandom = activePlayers[randIdx].name;

  // Across (furthest away)
  const acrossIdx = (cIndex + Math.floor(pCount / 2)) % pCount;
  const pAcross = activePlayers[acrossIdx].name;

  let outMatch = rawString
    .replace(/{player}/g, pPlayer)
    .replace(/{left}/g, pLeft)
    .replace(/{right}/g, pRight)
    .replace(/{random}/g, pRandom)
    .replace(/{across}/g, pAcross);

  return outMatch;
}

function handleSpin() {
  if (isSpinning) return;
  isSpinning = true;

  // Trigger animation
  coin.classList.remove('spin-fast');
  void coin.offsetWidth; // force reflow
  coin.classList.add('spin-fast');

  // Resolve after animation
  setTimeout(() => {
    coin.classList.remove('spin-fast');

    // Draw card
    if (deck.length === 0) fillDeck();
    const cardObj = deck.pop();
    const rawStr = cardObj.text;

    // Evaluate logic
    const finalPromt = getReplacedPrompt(rawStr);

    // Determine title
    let title = "THE CAPTAIN'S ORDER";
    const lower = finalPromt.toLowerCase();
    if (lower.includes('everyone') || lower.includes('minority')) {
      title = "GROUP ORDER";
    } else if (lower.includes('round') || lower.includes('until') || lower.includes('curse')) {
      title = "A FOUL CURSE";
    }

    // Modal Player Tag
    const p = activePlayers[currentPlayerIndex];
    const mutinyModalAvatar = document.getElementById('mutiny-modal-avatar');
    const mutinyModalName = document.getElementById('mutiny-modal-name');
    if (p.emoji.endsWith('.png') || p.emoji.endsWith('.gif')) {
      mutinyModalAvatar.innerHTML = `<img src="${p.emoji}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-md);" draggable="false">`;
    } else {
      mutinyModalAvatar.textContent = p.emoji;
    }
    mutinyModalName.textContent = p.name;

    // Render Modal
    mutinyTitle.textContent = title;
    mutinyText.textContent = finalPromt;
    mutinyOverlay.classList.add('is-visible');

    // CBTM card interception
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

    // Haptics if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    triggerFlashIfGroup(finalPromt);

    // Check for persistent curse
    if (cardObj.tags.includes('persistent')) {
      activeCurse = finalPromt;
      curseText.textContent = finalPromt;
      curseBanner.style.display = 'block';
    }
  }, 800); // Wait for the 0.8s CSS animation
}

function handleContinue() {
  mutinyOverlay.classList.remove('is-visible');

  // Remove flash backgrounds
  container.classList.remove('flash-gold', 'flash-red', 'flash-purple');

  // Reset CBTM state
  if (cbtmInterval) {
    clearInterval(cbtmInterval);
    cbtmInterval = null;
  }
  cbtmStartBtn.style.display = 'none';
  cbtmTimer.style.display = 'none';
  cbtmDoneBtn.style.display = 'none';
  cbtmVoteActions.style.display = 'none';
  cbtmExplainBtn.style.display = 'none';
  cbtmExplanation.style.display = 'none';
  mutinyText.style.display = 'block';
  mutinyContinueBtn.style.display = 'block';

  // Reset avatar shrink
  const playerTag = document.querySelector('#mutiny-card .modal-player-tag');
  if (playerTag) playerTag.classList.remove('is-shrunk');

  // Advance turn
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

// Start
init();
