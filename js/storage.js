const STORAGE_KEY = 'kings-gambit-players';
const STORAGE_GP_KEY = 'kings-gambit-gp-stats';

const defaultPlayers = [];

function getPlayers() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : defaultPlayers;
  } catch (e) {
    console.error('Failed to read from localStorage', e);
    return defaultPlayers;
  }
}

function savePlayers(players) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
  } catch (e) {
    console.error('Failed to write to localStorage', e);
  }
}

function addPlayer(name, emoji) {
  const players = getPlayers();
  const id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
  players.push({
    id,
    name,
    emoji,
    isActive: true,
    is_planked: false,
    unlocked_frames: [],
    active_frame: null
  });
  savePlayers(players);
  return id;
}

function togglePlayerActive(id) {
  const players = getPlayers();
  const index = players.findIndex(p => p.id === id);
  if (index !== -1) {
    players[index].isActive = !players[index].isActive;
    savePlayers(players);
  }
}

function deletePlayer(id) {
  const players = getPlayers().filter(p => p.id !== id);
  savePlayers(players);
}

function updatePlayer(id, name, emoji, is_planked = undefined, active_frame = undefined) {
  const players = getPlayers();
  const index = players.findIndex(p => p.id === id);
  if (index !== -1) {
    players[index].name = name;
    players[index].emoji = emoji;
    if (is_planked !== undefined) players[index].is_planked = is_planked;
    if (active_frame !== undefined) players[index].active_frame = active_frame;
    savePlayers(players);
  }
}

function unlockFrame(id, frameId) {
  const players = getPlayers();
  const index = players.findIndex(p => p.id === id);
  if (index !== -1) {
    if (!players[index].unlocked_frames) players[index].unlocked_frames = [];
    if (!players[index].unlocked_frames.includes(frameId)) {
      players[index].unlocked_frames.push(frameId);
      savePlayers(players);
    }
  }
}

function getActivePlayers() {
  return getPlayers().filter(p => p.isActive);
}

// --- GP Stats ---
function getGPStats() {
  try {
    const data = localStorage.getItem(STORAGE_GP_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

function saveGPStats(stats) {
  try {
    localStorage.setItem(STORAGE_GP_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to write GP stats', e);
  }
}

function recordGPMatch(sortedPlayers, finalScores, finalDrinks) {
  const stats = getGPStats();
  
  sortedPlayers.forEach((p, index) => {
    if (!stats[p.id]) {
      stats[p.id] = { wins: 0, podiums: 0, points: 0, drinks: 0, races: 0 };
    }
    stats[p.id].races += 1;
    stats[p.id].points += (finalScores[p.id] || 0);
    stats[p.id].drinks += (finalDrinks[p.id] || 0);
    
    if (index === 0) stats[p.id].wins += 1;
    if (index < 3) stats[p.id].podiums += 1;
  });
  
  saveGPStats(stats);
}

function clearGPStats() {
  try {
    localStorage.removeItem(STORAGE_GP_KEY);
  } catch (e) {
    console.error('Failed to clear GP stats', e);
  }
}

// Make globally available for inline scripts
window.Storage = {
  getPlayers,
  savePlayers,
  addPlayer,
  togglePlayerActive,
  deletePlayer,
  updatePlayer,
  unlockFrame,
  getActivePlayers,
  getGPStats,
  recordGPMatch,
  clearGPStats
};

// ─────────────────────────────────────────────
// SETTINGS — Avatar Mode
// ─────────────────────────────────────────────
const SETTINGS_KEY = 'kings-gambit-settings';

function _getSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch(e) { return {}; }
}

function getAvatarMode() {
  return _getSettings().avatarMode || 'animated';
}

/**
 * Returns an HTML string (<img> or <canvas>) for a player avatar,
 * respecting the current avatar display mode.
 * @param {string} src  Path to the avatar image.
 * @returns {string} HTML string.
 */
function renderAvatarImg(playerOrSrc, forceAnimate = false) {
  let src, activeFrame;
  if (typeof playerOrSrc === 'string') {
    src = playerOrSrc;
    const p = getPlayers().find(p => p.emoji === src);
    activeFrame = p ? p.active_frame : null;
  } else {
    src = playerOrSrc.emoji;
    activeFrame = playerOrSrc.active_frame;
  }

  const mode = forceAnimate ? 'animated' : getAvatarMode();
  let innerHtml = '';
  
  if (mode === 'static' && src.endsWith('.gif')) {
    innerHtml = `<canvas class="avatar-image avatar-static-canvas" data-gif-src="${src}" width="80" height="80"></canvas>`;
  } else if (mode === 'once' && src.endsWith('.gif')) {
    innerHtml = `<canvas class="avatar-image avatar-animated-canvas" data-gif-src="${src}" data-gif-mode="once" width="80" height="80"></canvas>`;
  } else if (mode === 'animated' && src.endsWith('.gif')) {
    innerHtml = `<canvas class="avatar-image avatar-animated-canvas" data-gif-src="${src}" data-gif-mode="loop" width="80" height="80"></canvas>`;
  } else {
    innerHtml = `<img src="${src}" class="avatar-image" draggable="false">`;
  }

  if (activeFrame) {
    return `<div style="position: relative; width: 100%; height: 100%; overflow: visible;">
      <div id="mutiny-card-avatar" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border-radius: inherit;">${innerHtml}</div>
      <img src="frames/mutiny/${activeFrame}.png" style="position: absolute; top: -12.5%; left: -12.5%; width: 125%; height: 125%; z-index: 10; object-fit: cover; pointer-events: none; image-rendering: pixelated;" draggable="false">
    </div>`;
  }
  return innerHtml;
}

function startAnimatedCanvases() {
  if (window.GifEngine) {
    document.querySelectorAll('.avatar-animated-canvas').forEach(canvas => {
      if (canvas.dataset.animating) return;
      const src = canvas.dataset.gifSrc;
      const mode = canvas.dataset.gifMode || 'loop';
      window.GifEngine.render(canvas, src, mode);
      canvas.dataset.animating = '1';
    });
  }
}

/**
 * Snapshots the first frame of any .avatar-static-canvas elements into
 * their canvas, for users using "Static" avatar mode.
 */
function snapshotStaticCanvases() {
  document.querySelectorAll('.avatar-static-canvas').forEach(canvas => {
    if (canvas.dataset.snapped) return;
    const src = canvas.dataset.gifSrc;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      canvas.width = img.naturalWidth || 80;
      canvas.height = img.naturalHeight || 80;
      ctx.drawImage(img, 0, 0);
      canvas.dataset.snapped = '1';
    };
    img.src = src;
  });
}

// --- Toast UI ---
function showToast(message, duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  container.appendChild(toast);

  // Trigger animation next frame
  requestAnimationFrame(() => {
    toast.classList.add('toast-show');
  });

  setTimeout(() => {
    toast.classList.remove('toast-show');
    toast.addEventListener('transitionend', () => toast.remove());
  }, duration);
}

window.UI = { showToast, getAvatarMode, renderAvatarImg, snapshotStaticCanvases, startAnimatedCanvases };

window.frame = {
  unlock: (frameId) => {
    const players = window.Storage.getPlayers();
    let updated = false;
    
    players.forEach(p => {
      if (!p.unlocked_frames) p.unlocked_frames = ['default'];
      if (!p.unlocked_frames.includes(frameId)) {
        p.unlocked_frames.push(frameId);
        updated = true;
      }
    });

    if (updated) {
      window.Storage.savePlayers(players);
      console.log(`unlocked '${frameId}' for all players. reopen the drawer to see it.`);
    } else {
      console.log(`everyone already has '${frameId}'.`);
    }
  }
};