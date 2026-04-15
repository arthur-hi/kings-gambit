// ══════════════════════════════════════════════
// THE HANDSHAKE — Game Logic
// ══════════════════════════════════════════════
// Rules:
//  - Each spin lands on a player at random.
//  - Hit once → drink 1 sip, marked "on notice" (orange glow).
//  - Hit again on the VERY NEXT spin (back-to-back) → eliminated, drink 2.
//  - If anyone else is hit in between, the previous player's notice is cleared.
//  - Last player standing wins.

// ── State ──────────────────────────────────────
let activePlayers  = [];
let alivePlayers   = [];   // still in the game
let drinkTally     = {};   // playerId → total drinks assigned
let lastHitId      = null; // who was hit on the last spin (for back-to-back detection)
let round          = 1;
let spinCount      = 0;    // total spins in the session
let spinning       = false;
let selectedPlayer = null;

// Wheel
let wheelAngle = 0;
let wheelColors = [
  '#facc15', '#f59e0b', '#fbbf24',
  '#ef4444', '#dc2626', '#b91c1c',
  '#a855f7', '#9333ea', '#7c3aed',
  '#3b82f6', '#2563eb', '#1d4ed8',
  '#22c55e', '#16a34a', '#15803d',
  '#f97316', '#ea580c', '#c2410c'
];

// ── DOM ─────────────────────────────────────────
const introScreen   = document.getElementById('hs-intro');
const gameScreen    = document.getElementById('hs-game');
const winnerScreen  = document.getElementById('hs-winner');
const exitOverlay   = document.getElementById('hs-exit-overlay');

const introPlayersEl = document.getElementById('hs-intro-players');
const startBtn       = document.getElementById('hs-start-btn');
const roundLabel     = document.getElementById('hs-round-label');
const survivorBar    = document.getElementById('hs-survivor-bar');
const wheelCanvas    = document.getElementById('hs-wheel-canvas');
const wheelCenter    = document.getElementById('hs-wheel-center');
const wheelInstruct  = document.getElementById('hs-wheel-instruction');
const spinBtn        = document.getElementById('hs-spin-btn');
const resultPanel    = document.getElementById('hs-result-panel');
const nextBtn        = document.getElementById('hs-next-btn');
const drinkBarEl     = document.getElementById('hs-drink-bar');

const winnerAvatarEl = document.getElementById('hs-winner-avatar');
const winnerNameEl   = document.getElementById('hs-winner-name');
const loserListEl    = document.getElementById('hs-loser-list');
const playAgainBtn   = document.getElementById('hs-play-again');
const toLobbyBtn     = document.getElementById('hs-to-lobby');

const ctx = wheelCanvas.getContext('2d');
const W = 240, H = 240, CX = W/2, CY = H/2;

// ── Init ────────────────────────────────────────
function init() {
  activePlayers = window.Storage.getActivePlayers();

  if (activePlayers.length < 2) {
    alert('You need at least 2 players!');
    window.location.href = 'index.html';
    return;
  }

  renderIntro();
  setupListeners();
}

function setupListeners() {
  // Intro
  startBtn.addEventListener('click', startGame);
  document.getElementById('hs-intro-back').addEventListener('click', () => window.location.href = 'index.html');

  // Game
  document.getElementById('hs-game-back').addEventListener('click', () => exitOverlay.classList.add('is-visible'));
  spinBtn.addEventListener('click', doSpin);
  nextBtn.addEventListener('click', nextTurn);

  // Winner
  document.getElementById('hs-winner-back').addEventListener('click', () => window.location.href = 'index.html');
  playAgainBtn.addEventListener('click', restartGame);
  toLobbyBtn.addEventListener('click', () => window.location.href = 'index.html');

  // Exit overlay
  document.getElementById('hs-exit-stay').addEventListener('click', () => exitOverlay.classList.remove('is-visible'));
  document.getElementById('hs-exit-quit').addEventListener('click', () => window.location.href = 'index.html');
}

// ── Intro ────────────────────────────────────────
function renderIntro() {
  introPlayersEl.innerHTML = '';
  activePlayers.forEach(p => {
    const chip = document.createElement('div');
    chip.className = 'hs-player-chip';

    const av = document.createElement('div');
    av.className = 'hs-chip-avatar';
    if (p.emoji.endsWith('.png') || p.emoji.endsWith('.gif')) {
      av.innerHTML = `<img src="${p.emoji}" draggable="false">`;
    } else {
      av.textContent = p.emoji;
    }

    const name = document.createElement('span');
    name.textContent = p.name;

    chip.appendChild(av);
    chip.appendChild(name);
    introPlayersEl.appendChild(chip);
  });
}

// ── Game Start ───────────────────────────────────
function startGame() {
  alivePlayers   = [...activePlayers];
  drinkTally     = {};
  lastHitId      = null;
  round          = 1;
  spinCount      = 0;
  spinning       = false;
  selectedPlayer = null;

  activePlayers.forEach(p => { drinkTally[p.id] = 0; });

  introScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');

  updateRoundLabel();
  renderSurvivorBar();
  drawWheel();
  renderDrinkBar();
  resetResultPanel();
  nextBtn.classList.add('hidden');
  spinBtn.disabled = false;
}

function restartGame() {
  winnerScreen.classList.add('hidden');
  startGame();
}

// ── Wheel Drawing ────────────────────────────────
function drawWheel(rotation = 0) {
  ctx.clearRect(0, 0, W, H);

  if (alivePlayers.length === 0) return;

  const sliceAngle = (2 * Math.PI) / alivePlayers.length;

  alivePlayers.forEach((p, i) => {
    const startA = rotation + i * sliceAngle;
    const endA   = startA + sliceAngle;
    const mid    = startA + sliceAngle / 2;

    const color  = wheelColors[i % wheelColors.length];

    // Segment fill
    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.arc(CX, CY, CX - 2, startA, endA);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#0d0d0d';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Name label
    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(mid);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#000';
    ctx.font = `bold ${Math.min(13, Math.max(9, 120 / alivePlayers.length))}px Nunito, sans-serif`;
    const labelR = CX - 18;
    ctx.fillText(p.name.substring(0, 8), labelR, 4);
    ctx.restore();
  });
}

// ── Spin ─────────────────────────────────────────
function doSpin() {
  if (spinning) return;
  spinning = true;
  spinBtn.disabled = true;
  nextBtn.classList.add('hidden');
  wheelInstruct.textContent = 'Spinning...';

  // Wiggle haptic
  if (navigator.vibrate) navigator.vibrate([30, 20, 30]);

  // Pick winner by random before animation
  const targetIdx = Math.floor(Math.random() * alivePlayers.length);
  selectedPlayer  = alivePlayers[targetIdx];

  const sliceAngle  = (2 * Math.PI) / alivePlayers.length;
  // We need the wheel to stop so targetIdx slice is at the top (needle = -π/2)
  // The needle points at angle -π/2 from canvas top
  // Segment i occupies [i*slice, (i+1)*slice]
  // We want: wheelAngle + i*slice + slice/2 ≡ -π/2 (mod 2π)
  // => wheelAngle = -π/2 - (i*slice + slice/2) + n*2π

  const targetCenter  = -(targetIdx * sliceAngle + sliceAngle / 2);
  const extraSpins    = (5 + Math.floor(Math.random() * 5)) * 2 * Math.PI;
  const startAngle    = wheelAngle;

  // Compute the final angle: align target center under needle (top = -π/2)
  let finalAngle = (-Math.PI / 2) + targetCenter;
  // Normalise so finalAngle is ahead of startAngle
  while (finalAngle <= startAngle) finalAngle += 2 * Math.PI;
  finalAngle += extraSpins;

  const duration  = 3000 + Math.random() * 1000; // 3-4s
  const startTime = performance.now();

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animate(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease     = easeOut(progress);

    wheelAngle = startAngle + (finalAngle - startAngle) * ease;
    drawWheel(wheelAngle);

    // Needle click sound substitute via haptic
    const prevTick = Math.floor((startAngle + (finalAngle - startAngle) * easeOut(Math.max(0, progress - 0.01))) / sliceAngle);
    const curTick  = Math.floor(wheelAngle / sliceAngle);
    if (curTick !== prevTick && progress < 0.85) {
      if (navigator.vibrate) navigator.vibrate(5);
    }

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      wheelAngle = finalAngle % (2 * Math.PI);
      drawWheel(wheelAngle);
      resolveResult();
    }
  }

  requestAnimationFrame(animate);
}

// ── Result Resolution ─────────────────────────────
function resolveResult() {
  spinning  = false;
  spinCount++;

  const p              = selectedPlayer;
  const isBackToBack   = lastHitId === p.id; // same player as last spin?

  // Update center of wheel with player avatar
  setWheelCenter(p);

  if (isBackToBack) {
    // ── ELIMINATED ── back-to-back hit
    const drinksNow = 2;
    drinkTally[p.id] = (drinkTally[p.id] || 0) + drinksNow;
    alivePlayers = alivePlayers.filter(pl => pl.id !== p.id);
    lastHitId    = null; // reset — no one is currently "on notice"

    if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 200]);

    showResultEliminated(p, drinksNow);
    renderSurvivorBar();
    renderDrinkBar();

    // Advance round counter on every elimination
    round++;
    updateRoundLabel();

    // Check win condition
    if (alivePlayers.length === 1) {
      setTimeout(() => showWinner(), 1800);
      return;
    }

    drawWheel(wheelAngle);
    wheelInstruct.textContent = `${p.name} is out! ☠️`;
  } else {
    // ── ON NOTICE ── first hit (or previous warning transferred to new player)
    drinkTally[p.id] = (drinkTally[p.id] || 0) + 1;
    lastHitId        = p.id; // mark them as "on notice"

    if (navigator.vibrate) navigator.vibrate(60);

    showResultDrink(p, 1);
    renderSurvivorBar(); // re-render to update warning glow
    renderDrinkBar();
    wheelInstruct.textContent = `${p.name} is on notice! ⚠️`;
  }

  //nextBtn.classList.remove('hidden');
  spinBtn.disabled = false;
}

// ── After result, prepare for next spin ──────────
function nextTurn() {
  nextBtn.classList.add('hidden');
  resetResultPanel();
  resetWheelCenter();
  wheelInstruct.textContent = lastHitId
    ? `⚠️ ${alivePlayers.find(p => p.id === lastHitId)?.name ?? ''} is on notice — spin again!`
    : "Who's next?";
  spinBtn.disabled = false;
}

// ── UI Helpers ───────────────────────────────────

function updateRoundLabel() {
  roundLabel.textContent = `Round ${round}`;
}

function setWheelCenter(player) {
  wheelCenter.innerHTML = '';
  wheelCenter.style.borderColor = '#facc15';
  wheelCenter.style.boxShadow   = '0 0 20px rgba(250,204,21,0.5)';

  if (player.emoji.endsWith('.png') || player.emoji.endsWith('.gif')) {
    const img = document.createElement('img');
    img.src = player.emoji;
    img.draggable = false;
    wheelCenter.appendChild(img);
  } else {
    wheelCenter.textContent = player.emoji;
  }
}

function resetWheelCenter() {
  wheelCenter.innerHTML = '🤝';
  wheelCenter.style.borderColor = '';
  wheelCenter.style.boxShadow   = '';
}

function renderSurvivorBar() {
  survivorBar.innerHTML = '';
  activePlayers.forEach(p => {
    const isAlive   = alivePlayers.some(a => a.id === p.id);
    const isWarned  = isAlive && p.id === lastHitId;

    const chip = document.createElement('div');
    chip.className = [
      'hs-survivor-chip',
      !isAlive  ? 'eliminated' : '',
      isWarned  ? 'warned'     : ''
    ].filter(Boolean).join(' ');

    const av = document.createElement('div');
    av.className = 'hs-survivor-avatar';
    if (p.emoji.endsWith('.png') || p.emoji.endsWith('.gif')) {
      av.innerHTML = `<img src="${p.emoji}" draggable="false">`;
    } else {
      av.textContent = p.emoji;
    }

    const nameNode = document.createTextNode(isWarned ? `${p.name} ⚠️` : p.name);

    chip.appendChild(av);
    chip.appendChild(nameNode);
    survivorBar.appendChild(chip);
  });
}

function renderDrinkBar() {
  drinkBarEl.innerHTML = '';
  activePlayers.filter(p => (drinkTally[p.id] || 0) > 0).forEach(p => {
    const chip = document.createElement('div');
    chip.className = 'hs-drink-chip';

    const pip = document.createElement('div');
    pip.className = 'hs-drink-pip';

    chip.appendChild(pip);
    chip.appendChild(document.createTextNode(`${p.name}: ${drinkTally[p.id]} 🍺`));
    drinkBarEl.appendChild(chip);
  });
}

function resetResultPanel() {
  resultPanel.className = 'hs-result-panel';
  resultPanel.innerHTML = '<p class="hs-result-idle-text">Spin the wheel to find the next victim...</p>';
}

function showResultDrink(player, count) {
  resultPanel.className = 'hs-result-panel is-drink';

  const avEl = avatarElement(player, 'drink');
  const nameEl = el('p', 'hs-result-name drink', player.name);
  const verdictEl = el('p', 'hs-result-verdict', `Takes ${count} sip${count > 1 ? 's' : ''} — first warning`);
  const badge = el('span', 'hs-result-drinks-badge', `DRINK ${count}x 🍺`);

  resultPanel.innerHTML = '';
  resultPanel.append(avEl, nameEl, verdictEl, badge);
}

function showResultEliminated(player, count) {
  resultPanel.className = 'hs-result-panel is-drink';
  resultPanel.style.borderColor = '#991b1b';
  resultPanel.style.boxShadow   = '0 0 40px rgba(153,27,27,0.4)';

  const avEl = avatarElement(player, 'drink');
  const nameEl = el('p', 'hs-result-name drink', player.name);
  const verdictEl = el('p', 'hs-result-verdict', '💀 ELIMINATED — hit twice!');
  const badge = el('span', 'hs-result-drinks-badge', `DRINK ${count}x 🍺`);

  resultPanel.innerHTML = '';
  resultPanel.append(avEl, nameEl, verdictEl, badge);
}

function showWinner() {
  gameScreen.classList.add('hidden');
  winnerScreen.classList.remove('hidden');

  const winner = alivePlayers[0];

  // Winner avatar
  winnerAvatarEl.innerHTML = '';
  if (winner.emoji.endsWith('.png') || winner.emoji.endsWith('.gif')) {
    const img = document.createElement('img');
    img.src = winner.emoji;
    winnerAvatarEl.appendChild(img);
  } else {
    winnerAvatarEl.textContent = winner.emoji;
  }
  winnerNameEl.textContent = winner.name;

  // Losers sorted by drinks desc
  const losers = activePlayers
    .filter(p => p.id !== winner.id)
    .sort((a, b) => (drinkTally[b.id] || 0) - (drinkTally[a.id] || 0));

  loserListEl.innerHTML = '';
  losers.forEach(p => {
    const row = document.createElement('div');
    row.className = 'hs-loser-row';

    const left = document.createElement('div');
    left.className = 'hs-loser-left';

    const av = document.createElement('div');
    av.className = 'hs-loser-avatar';
    if (p.emoji.endsWith('.png') || p.emoji.endsWith('.gif')) {
      av.innerHTML = `<img src="${p.emoji}" draggable="false">`;
    } else {
      av.textContent = p.emoji;
    }

    const name = el('span', 'hs-loser-name', p.name);
    left.append(av, name);

    const drinks = el('span', 'hs-loser-drinks', `${drinkTally[p.id] || 0} drink${(drinkTally[p.id] || 0) !== 1 ? 's' : ''}`);
    row.append(left, drinks);
    loserListEl.appendChild(row);
  });

  launchConfetti();
  if (navigator.vibrate) navigator.vibrate([100, 50, 100, 50, 300]);
}

// ── Confetti ──────────────────────────────────────
function launchConfetti() {
  const colors = ['#facc15','#ef4444','#22c55e','#a855f7','#3b82f6','#f97316','#ffffff'];
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const piece = document.createElement('div');
      piece.className = 'hs-confetti';
      piece.style.left    = Math.random() * 100 + 'vw';
      piece.style.width   = (6 + Math.random() * 8) + 'px';
      piece.style.height  = (6 + Math.random() * 8) + 'px';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.animationDuration = (2 + Math.random() * 3) + 's';
      piece.style.animationDelay = '0s';
      document.body.appendChild(piece);
      piece.addEventListener('animationend', () => piece.remove());
    }, i * 30);
  }
}

// ── Utility ───────────────────────────────────────
function el(tag, cls, text) {
  const e = document.createElement(tag);
  e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function avatarElement(player, cls) {
  const av = document.createElement('div');
  av.className = `hs-result-avatar-large ${cls}`;
  if (player.emoji.endsWith('.png') || player.emoji.endsWith('.gif')) {
    const img = document.createElement('img');
    img.src = player.emoji;
    av.appendChild(img);
  } else {
    av.textContent = player.emoji;
  }
  return av;
}

// ── Boot ──────────────────────────────────────────
init();
