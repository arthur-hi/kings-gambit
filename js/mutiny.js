const mutinyCards = [
  "{player}, do an action to {left}. they repeat it and add one. continue until someone fails. loser drinks.",
  "{player}, race {across} to finish your drink. loser takes another drink.",
  "travel: whoever has travelled to the most countries drinks.",
  "tea or coffee: everyone picks a side. the minority group drinks.",
  "{player}, tell 2 truths and 1 lie. everyone who guesses wrong drinks.",
  "{player}, touch your toes without bending your legs or drink.",
  "beards: all bearded players drink.",
  "longest hair: the player with the longest hair drinks.",
  "currencies: {player}, start naming currencies. first to repeat or fail drinks.",
  "left hand only: {player}, use only your left hand for one round.",
  "{player}, give any player a hug.",
  "statue: {player}, stay completely still for one round.",
  "european countries: {player}, start naming countries in europe. first to repeat or fail drinks.",
  "sample: everyone offers {player} their drink. you pick one and take a sip.",
  "{player}, take a selfie with {right}. both drink.",
  "biggest hands: the person with the biggest hands drinks.",
  "banned word: {player}, pick a word that is banned for two rounds. anyone who says it drinks.",
  "no english: {player}, don't speak english for one round.",
  "{player}, kiss {random} on the forehead.",
  "pizza or burgers: everyone picks a side. the minority group drinks.",
  "trivia: {player}, ask {right} a question. correct = you drink, wrong = they drink.",
  "{player}, try to walk in a straight line or drink.",
  "{player}, flex and take a drink.",
  "just drink: {player}, exactly what it says. drink.",
  "left choice: {player}, do whatever {left} wants or drink.",
  "card of death: {player}, down your drink and take a shot.",
  "nicest smell: {player}, pick the player who smells nicest; they drink.",
  "king: {player}, command everyone to do anything. if they can't, they drink.",
  "lipstick: anyone wearing lipstick drinks and kisses someone on the cheek.",
  "the invisible man: everyone ignores {player} for one round.",
  "us presidents: {player}, start naming presidents. first to repeat or fail drinks.",
  "shortest player: the shortest player sits on the floor for one round.",
  "the mixologist: {player}, take some drink from {right} and add it to yours.",
  "double trouble: {player}, you have to drink double for one round.",
  "straightest teeth: the player with the straightest teeth drinks.",
  "mexican wave: {player} drinks, then {left}, then the next, until it comes back.",
  "animal farm: everyone makes an animal noise and drinks.",
  "{player}, play rock paper scissors against {left}. loser drinks.",
  "seeing double: everyone drinks double for one round.",
  "seven: {player}, count up from 1. say 'drink' on multiples of 7 or numbers with a 7 to reverse. first to mess up drinks.",
  "round robin: {player}, take a sip of every player's drink.",
  "pass the glass: everyone passes their drink to the left. drink your new glass.",
  "even age: if your age is an even number, drink.",
  "dance off: {player}, dance until your next turn or down your drink.",
  "waterfall lite: {player}, down your entire drink.",
  "hands up: everyone puts hands in the air. last one drinks.",
  "{player}, drink for every letter in your name.",
  "the finger: everyone points at someone. most points drinks.",
  "{player}, tilt your head all the way back and drink.",
  "coin flip: {player}, call heads or tails and flip. correct = everyone else drinks, wrong = you drink.",
  "the floor is lava: anyone who touches the floor for one round drinks.",
  "double down: the last person who drank must drink again.",
  "movie genres: {player}, name genres clockwise. first to repeat or fail drinks.",
  "triple threat: {player}, pick three players to drink.",
  "capital cities: {player}, name capitals clockwise. first to repeat or fail drinks.",
  "gift giver: {right} must find something and bring it to {player} as a gift.",
  "elder statesman: the oldest player drinks.",
  "look left: {left} drinks.",
  "right hand man: {player}, high five {right}. both drink.",
  "quick reflexes: everyone stand up. last one standing drinks.",
  "passport check: {player}, drink for every country you’ve visited.",
  "gender majority: if there are more females, females drink. if more males, males drink.",
  "social: everyone drinks!",
  "dynamic duo: {player}, if your best friend is playing, you both drink.",
  "blind taste test: {player}, guess a secret drink from {left}. wrong = you drink, right = they drink.",
  "boulder: {player} drinks 1x, {left} drinks 2x, next drinks 3x, etc., until it returns.",
  "cheers: everyone raise their drinks and say cheers.",
  "asian countries: {player}, name countries in asia. first to repeat or fail drinks.",
  "glasses: everyone wearing glasses drinks.",
  "buddy: {player}, pick a player to drink with you.",
  "spin the bottle: {player}, spin a bottle. whoever it lands on drinks.",
  "{player}, the next person to make eye contact with you must drink.",
  "{player}, you must shake hands with every player.",
  "raise your drinks! the last person to do it drinks.",
  "favourite colour: everyone say their favourite colour. if anyone picks the same one, they drink.",
  "compliments: {player}, start going around clockwise giving each other compliments.",
  "one leg: everyone stand on one leg. the first one to fall drinks.",
  "touch the floor: everyone touch the floor. the last person to do it drinks.",
  "gestures: {player}, make a gesture. {left} repeats it and adds one. keep going until someone forgets. loser drinks.",
  "beatles songs: {player}, start naming beatles songs. first to repeat or fail drinks.",
  "dog breeds: {player}, start naming dog breeds. first to repeat or fail drinks.",
  "eye contact roulette: everyone look at the ground. on the count of three, look up at another player's eyes. any players making eye contact must drink.",
  "most likely: {player}, state a 'who is most likely to...' situation. on the count of three, everyone points. that player drinks.",
  "best dressed: {player}, choose which player is best dressed; they must drink.",
  "{player}, do 10 push ups or take a drink.",
  "shoulder tap: {player}, turn away. {random} taps your shoulder. if you guess correctly, everyone else drinks. if wrong, you drink.",
  "{player}, pick three adjectives to describe {left} and then both drink.",
  "going to the bar: memory game. {player}, name a drink. each person adds to the list. first to forget or repeat drinks.",
  "fists of five: everyone show a number from 1 to 5 on their hand. any players with the same number must drink.",
  "natural disasters: {player}, name natural disasters clockwise. first to repeat or fail drinks.",
  "rule maker: {player}, create a rule that players must follow or drink (e.g., 'no one say the word what').",
  "phone ban: for one round, if anyone checks their phone, they must drink.",
  "{player}, exactly what it says—take two drinks.",
  "drink twins: all players with the same drink as {player} must drink.",
  "{player}, arm wrestle {right}. the loser must down their drink.",
  "old friends: {player}, the player you have known the longest must drink.",
  "thumb war: {player}, have a thumb war with {random}. the loser must finish their drink.",
  "no swearing: {player}, you must not swear for three rounds. every time you swear, take a drink.",
  "red or blue: everyone picks a side. the minority group drinks.",
  "{player}, stand on one leg and take a drink."
];

let activePlayers = [];
let currentPlayerIndex = 0;
let isSpinning = false;
let deck = [];

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
}

function fillDeck() {
  deck = [...mutinyCards];
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
    const rawStr = deck.pop();

    // Evaluate logic
    const finalPromt = getReplacedPrompt(rawStr);

    // Determine title
    let title = "THE CAPTAIN'S ORDER";
    const lower = finalPromt.toLowerCase();
    if (lower.includes('everyone') || lower.includes('minority')) {
      title = "GROUP ORDER";
    } else if (lower.includes('round') || lower.includes('until')) {
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

    // Haptics if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    triggerFlashIfGroup(finalPromt);
  }, 800); // Wait for the 0.8s CSS animation
}

function handleContinue() {
  mutinyOverlay.classList.remove('is-visible');

  // Remove flash backgrounds
  container.classList.remove('flash-gold', 'flash-red');

  // Advance turn
  currentPlayerIndex = (currentPlayerIndex + 1) % activePlayers.length;
  updateTurnUI();

  isSpinning = false;
}

function triggerFlashIfGroup(text) {
  const lower = text.toLowerCase();
  container.classList.remove('flash-gold', 'flash-red');

  if (lower.includes('minority') || lower.includes('everyone') || lower.includes('point')) {
    container.classList.add('flash-gold');
  } else if (lower.includes('loser drinks')) {
    container.classList.add('flash-red');
  }
}

// Start
init();
