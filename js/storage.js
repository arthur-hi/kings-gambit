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
    isActive: true
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

function updatePlayer(id, name, emoji) {
  const players = getPlayers();
  const index = players.findIndex(p => p.id === id);
  if (index !== -1) {
    players[index].name = name;
    players[index].emoji = emoji;
    savePlayers(players);
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
  getActivePlayers,
  getGPStats,
  recordGPMatch,
  clearGPStats
};

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

window.UI = { showToast };

