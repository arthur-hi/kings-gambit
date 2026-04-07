const STORAGE_KEY = 'kings-gambit-players';

const defaultPlayers = [
  { id: '1', name: 'Alex', emoji: '🍺', isActive: true },
  { id: '2', name: 'Sam', emoji: '🍷', isActive: true }
];

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

function getActivePlayers() {
  return getPlayers().filter(p => p.isActive);
}

// Make globally available for inline scripts
window.Storage = {
  getPlayers,
  savePlayers,
  addPlayer,
  togglePlayerActive,
  deletePlayer,
  getActivePlayers
};
