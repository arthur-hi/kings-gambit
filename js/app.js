// Avatar packs for the drawer load from packs.js
const PACKS = window.PACKS;

// DOM Elements
const rosterEl = document.getElementById('roster');
const editBtn = document.getElementById('edit-btn');
const settingsBtn = document.getElementById('settings-btn');
const gamesList = document.querySelectorAll('.game-card');

// Settings
const SETTINGS_KEY = 'kings-gambit-settings';
function getSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch(e) { return {}; }
}
function saveSettings(obj) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...getSettings(), ...obj }));
}
function getAvatarMode() {
  return getSettings().avatarMode || 'animated';
}
function applyAvatarMode() {
  document.body.dataset.avatarMode = getAvatarMode();
}

// Drawer DOM Elements
const drawerOverlay = document.getElementById('drawer-overlay');
const addPlayerDrawer = document.getElementById('add-player-drawer');
const drawerCloseBtn = document.getElementById('drawer-close');
const drawerTitle = document.getElementById('drawer-title');
const playerNameInput = document.getElementById('player-name');
const packTabs = document.getElementById('pack-tabs');
const emojiGrid = document.getElementById('emoji-grid');
const savePlayerBtn = document.getElementById('save-player-btn');

// State
let isEditMode = false;
let editingPlayerId = null;
let currentPack = 'animated';
let selectedEmoji = PACKS.animated[0];

// --- Drag state ---
let draggedElement = null;
let dragStartX = 0;
let dragStartY = 0;
let isDragging = false;
let currentDragTarget = null;
let currentDraggedId = null;
let draggedNodeClone = null;

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

// --- Settings Modal UI ---
function renderSettingsModal() {
  const container = document.getElementById('settings-content');
  if (!container) return;
  const current = getAvatarMode();
  const modes = [
    { id: 'animated',  label: '🎞️ Animated',      desc: 'Avatars loop continuously' },
    { id: 'once',      label: '▶️ Animate Once',   desc: 'Plays from start, no loop' },
    { id: 'static',    label: '🖼️ Static',          desc: 'Shows first frame, no animation' },
  ];
  container.innerHTML = modes.map(m => `
    <button class="settings-option${current === m.id ? ' is-selected' : ''}" data-mode="${m.id}">
      <span class="settings-option-label">${m.label}</span>
      <span class="settings-option-desc">${m.desc}</span>
    </button>
  `).join('');
  container.querySelectorAll('.settings-option').forEach(btn => {
    btn.addEventListener('click', () => {
      saveSettings({ avatarMode: btn.dataset.mode });
      applyAvatarMode();
      renderSettingsModal();
      renderRoster(); // refresh avatars with new mode
    });
  });
}

window.addEventListener('DOMContentLoaded', () => {
  applyAvatarMode();
  init();
});

// --- Avatar Mode Rendering ---
function renderAvatarImg(src) {
  const mode = getAvatarMode();
  if (mode === 'static' && src.endsWith('.gif')) {
    return `<canvas class="avatar-image avatar-static-canvas" data-gif-src="${src}" width="80" height="80"></canvas>`;
  }
  if (mode === 'once' && src.endsWith('.gif')) {
    // Append timestamp to force the GIF to restart from frame 1 each render
    const freshSrc = `${src}?t=${Date.now()}`;
    return `<img src="${freshSrc}" class="avatar-image" draggable="false" style="pointer-events:none;">`;
  }
  return `<img src="${src}" class="avatar-image" draggable="false">`;
}

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

// Global Drag Listeners
document.addEventListener('mousemove', handleGlobalMove, {
  passive: false
});
document.addEventListener('mouseup', handleGlobalUp);
document.addEventListener('touchmove', handleGlobalMove, {
  passive: false
});
document.addEventListener('touchend', handleGlobalUp);

// --- Initialization ---
function init() {
  renderRoster();
  initEmojiGrid();
  setupEventListeners();
  updateGamesLockState();

  // PWA Prompt Logic
  const declinedInstall = localStorage.getItem('kings-gambit-declined-install');
  if (!declinedInstall) {
    const activeData = window.Storage.getActivePlayers();
    if (activeData.length >= 2) {
      setTimeout(() => {
        const installDrawer = document.getElementById('install-drawer');
        drawerOverlay.classList.add('is-visible');
        installDrawer.classList.add('is-open');
      }, 500);
    }
  }
}

// --- Roster Logic ---
function renderRoster() {
  const zeroStateWelcome = document.getElementById('zero-state-welcome');
  const players = window.Storage.getPlayers();

  if (players.length === 0) {
    zeroStateWelcome.style.display = 'block';
    rosterEl.style.display = 'none';
  } else {
    zeroStateWelcome.style.display = 'none';
    rosterEl.style.display = 'grid'; // restoring the grid class implicitly by just showing it

    if (players.length === 1) {
      // Force user to add at least two players
      setTimeout(openDrawer, 10);
    }
  }

  // Clear generic contents
  rosterEl.innerHTML = '';

  // Create player elements
  players.forEach(player => {
    const wrapper = document.createElement('div');
    wrapper.className = `avatar-wrapper ${player.isActive ? 'is-active' : ''}`;

    // Dataset for clicks
    wrapper.dataset.id = player.id;

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    if (player.emoji.endsWith('.png') || player.emoji.endsWith('.gif')) {
      avatar.innerHTML = renderAvatarImg(player.emoji);
    } else {
      avatar.textContent = player.emoji;
    }

    // Delete button
    const deleteBtn = document.createElement('span');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = '✕';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!isEditMode) return;
      
      const removeOverlay = document.getElementById('remove-overlay');
      const removeText = document.getElementById('remove-player-name-text');
      const confirmBtn = document.getElementById('remove-confirm-btn');
      const cancelBtn = document.getElementById('remove-cancel-btn');
      
      if (removeOverlay) {
        removeText.textContent = `Are you sure you want to remove ${player.name}?`;
        removeOverlay.classList.add('is-visible');
        
        confirmBtn.onclick = () => {
          window.Storage.deletePlayer(player.id);
          if (navigator.vibrate) navigator.vibrate(50);
          renderRoster();
          updateGamesLockState();
          removeOverlay.classList.remove('is-visible');
        };
        
        cancelBtn.onclick = () => {
          removeOverlay.classList.remove('is-visible');
        };
      } else {
        window.Storage.deletePlayer(player.id);
        if (navigator.vibrate) navigator.vibrate(50);
        renderRoster();
        updateGamesLockState();
      }
    });
    wrapper.appendChild(deleteBtn);

    const name = document.createElement('div');
    name.className = 'avatar-name';
    name.textContent = player.name;

    wrapper.appendChild(avatar);
    wrapper.appendChild(name);

    bindDragEvents(wrapper, player.id);

    rosterEl.appendChild(wrapper);
  });

  // Create Add Button at the end
  const addBtnWrapper = document.createElement('div');
  addBtnWrapper.className = 'avatar-wrapper is-add-btn';

  const addAvatar = document.createElement('button');
  addAvatar.className = 'avatar avatar-add';
  addAvatar.textContent = '+';

  const addName = document.createElement('div');
  addName.className = 'avatar-name';
  addName.textContent = 'Add';

  addBtnWrapper.appendChild(addAvatar);
  addBtnWrapper.appendChild(addName);

  addBtnWrapper.addEventListener('click', openDrawer);

  rosterEl.appendChild(addBtnWrapper);

  // Apply edit mode styling if active
  if (isEditMode) {
    rosterEl.classList.add('edit-mode');
  } else {
    rosterEl.classList.remove('edit-mode');
  }

  const dragHint = document.getElementById('drag-hint');
  if (players.length > 0) {
    dragHint.style.display = 'block';
    if (isEditMode) {
      dragHint.innerHTML = "tap avatar to edit and tap the red X thing to remove.";
    } else {
      dragHint.innerHTML = "drag to match your table seating,<br>tap to toggle who's playing.";
    }
  } else {
    dragHint.style.display = 'none';
  }
  
  // Snapshot first frame for static mode
  if (getAvatarMode() === 'static') {
    requestAnimationFrame(snapshotStaticCanvases);
  }
}

let isProcessingClick = false;

function handlePlayerClick(id) {
  if (isProcessingClick) return;
  isProcessingClick = true;

  if (isEditMode) {
    openEditDrawer(id);
  } else {
    window.Storage.togglePlayerActive(id);
    renderRoster();
    updateGamesLockState();
  }

  // Prevent multiple taps within 300ms
  setTimeout(() => {
    isProcessingClick = false;
  }, 300);
}

function toggleEditMode() {
  isEditMode = !isEditMode;
  editBtn.textContent = isEditMode ? 'Done' : 'Edit';
  if (isEditMode) {
    editBtn.style.color = 'var(--color-primary)';
  } else {
    editBtn.style.color = 'var(--color-text-muted)';
  }
  renderRoster();
}

// --- Drag & Drop Mechanics ---
function handleGlobalMove(e) {
  if (isEditMode || !draggedElement) return;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  const deltaX = Math.abs(clientX - dragStartX);
  const deltaY = Math.abs(clientY - dragStartY);

  if (!isDragging && Math.max(deltaX, deltaY) > 10) {
    isDragging = true;
    draggedElement.classList.add('dragging');

    // Ghost DOM element
    draggedNodeClone = draggedElement.cloneNode(true);
    draggedNodeClone.classList.remove('dragging');
    draggedNodeClone.classList.add('drag-ghost');
    document.body.appendChild(draggedNodeClone);
  }

  if (isDragging) {
    if (e.cancelable) e.preventDefault();

    if (draggedNodeClone) {
      draggedNodeClone.style.left = clientX + 'px';
      draggedNodeClone.style.top = clientY + 'px';
    }

    const elementUnder = document.elementFromPoint(clientX, clientY);

    if (currentDragTarget && currentDragTarget !== elementUnder) {
      currentDragTarget.classList.remove('drag-over');
    }

    if (elementUnder) {
      const targetWrapper = elementUnder.closest('.avatar-wrapper');

      if (targetWrapper && targetWrapper !== draggedElement && !targetWrapper.classList.contains('is-add-btn')) {
        currentDragTarget = targetWrapper;
        currentDragTarget.classList.add('drag-over');
      } else {
        currentDragTarget = null;
      }
    } else {
      currentDragTarget = null;
    }
  }
}

function handleGlobalUp(e) {
  if (draggedElement) {
    if (!isDragging && !isEditMode) {
      handlePlayerClick(currentDraggedId);
    } else if (isDragging) {
      draggedElement.classList.remove('dragging');
      if (draggedNodeClone) {
        draggedNodeClone.remove();
        draggedNodeClone = null;
      }

      if (currentDragTarget) {
        currentDragTarget.classList.remove('drag-over');

        const siblings = Array.from(rosterEl.querySelectorAll('.avatar-wrapper:not(.is-add-btn)'));
        const draggedIndex = siblings.indexOf(draggedElement);
        const targetIndex = siblings.indexOf(currentDragTarget);

        if (draggedIndex > -1 && targetIndex > -1) {
          if (draggedIndex < targetIndex) {
            currentDragTarget.after(draggedElement);
          } else {
            currentDragTarget.before(draggedElement);
          }
          saveDomOrderToStorage();
        }
      }
    }

    draggedElement = null;
    isDragging = false;
    currentDragTarget = null;
    currentDraggedId = null;
  }
}

function saveDomOrderToStorage() {
  const currentPlayers = window.Storage.getPlayers();
  const orderedNodes = Array.from(rosterEl.querySelectorAll('.avatar-wrapper:not(.is-add-btn)'));

  const updatedArray = orderedNodes.map(node => {
    const id = node.dataset.id;
    return currentPlayers.find(p => p.id === id);
  }).filter(Boolean);

  if (updatedArray.length === currentPlayers.length) {
    window.Storage.savePlayers(updatedArray);
  }
}

function bindDragEvents(el, id) {
  // Map regular clicks exclusively for Edit Mode
  el.addEventListener('click', () => {
    if (isEditMode) {
      handlePlayerClick(id);
    }
  });

  function handleDown(e) {
    if (isEditMode) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    dragStartX = clientX;
    dragStartY = clientY;
    draggedElement = el;
    currentDraggedId = id;
    isDragging = false;
  }

  el.addEventListener('mousedown', handleDown);
  el.addEventListener('touchstart', handleDown, {
    passive: true
  });
}

// --- Drawer Logic ---
function initEmojiGrid() {
  packTabs.innerHTML = '';
  Object.keys(PACKS).forEach(packName => {
    const btn = document.createElement('button');
    btn.className = `pack-pill ${packName === currentPack ? 'active' : ''}`;
    btn.textContent = packName.replace('_',
    ' ');
    btn.addEventListener('click', () => {
      currentPack = packName;
      initEmojiGrid();
    });
    packTabs.appendChild(btn);
  });

  emojiGrid.innerHTML = '';

  // Get emojis already taken by other players
  const players = window.Storage.getPlayers();
  const takenEmojis = players
    .filter(p => p.id !== editingPlayerId) // Allow the player being edited to keep their own
    .map(p => p.emoji);

  PACKS[currentPack].forEach(emoji => {
    // Skip avatars already chosen by other players
    if (takenEmojis.includes(emoji)) return;

    const btn = document.createElement('button');
    btn.className = `emoji-btn ${emoji === selectedEmoji ? 'is-selected' : ''}`;

    if (emoji.endsWith('.png') || emoji.endsWith('.gif')) {
      btn.innerHTML = `<img src="${emoji}" class="avatar-image" draggable="false">`;
    } else {
      btn.textContent = emoji;
    }

    btn.addEventListener('click', () => {
      playerNameInput.blur();
      selectedEmoji = emoji;
      document.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
    });
    emojiGrid.appendChild(btn);
  });
}

function openDrawer() {
  if (isEditMode) toggleEditMode();

  editingPlayerId = null;
  drawerTitle.textContent = 'New Player';
  savePlayerBtn.textContent = 'Add Player';
  playerNameInput.value = '';
  currentPack = 'animated';
  selectedEmoji = PACKS[currentPack][0];
  initEmojiGrid();

  drawerOverlay.classList.add('is-visible');
  addPlayerDrawer.classList.add('is-open');

  setTimeout(() => {
    playerNameInput.focus();
  }, 300);
}

function openEditDrawer(id) {
  const players = window.Storage.getPlayers();
  const player = players.find(p => p.id === id);
  if (!player) return;

  editingPlayerId = id;
  drawerTitle.textContent = 'Edit Player';
  savePlayerBtn.textContent = 'Save Changes';
  playerNameInput.value = player.name;

  // Find which pack this emoji belongs to and select it
  let foundPack = 'animated';
  for (const [packName, packEmojis] of Object.entries(PACKS)) {
    if (packEmojis.includes(player.emoji)) {
      foundPack = packName;
      break;
    }
  }
  currentPack = foundPack;
  selectedEmoji = player.emoji;
  initEmojiGrid();

  drawerOverlay.classList.add('is-visible');
  addPlayerDrawer.classList.add('is-open');

  setTimeout(() => {
    playerNameInput.focus();
  }, 300);
}

function closeDrawer() {
  drawerOverlay.classList.remove('is-visible');
  addPlayerDrawer.classList.remove('is-open');
  playerNameInput.blur(); // dismiss keyboard
  editingPlayerId = null;
}

function handleSavePlayer() {
  const name = playerNameInput.value.trim();
  if (!name) return; // Ignore if empty

  if (editingPlayerId) {
    window.Storage.updatePlayer(editingPlayerId, name, selectedEmoji);
  } else {
    window.Storage.addPlayer(name, selectedEmoji);
  }

  closeDrawer();
  renderRoster();
  updateGamesLockState();
}

// --- Games Lock Logic ---
function updateGamesLockState() {
  const activeCount = window.Storage.getActivePlayers().length;

  gamesList.forEach(card => {
    let shouldLock = activeCount < 2;
    if (card.id === 'game-grand-prix' && activeCount < 4) {
      shouldLock = true;
    }

    if (shouldLock) {
      card.classList.add('is-locked');
    } else {
      card.classList.remove('is-locked');
    }
  });
}

// --- Event Listeners Setup ---
function setupEventListeners() {
  editBtn.addEventListener('click', toggleEditMode);
  drawerCloseBtn.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);
  savePlayerBtn.addEventListener('click', handleSavePlayer);

  // Settings modal
  const settingsOverlay = document.getElementById('settings-overlay');
  const settingsCloseBtn = document.getElementById('settings-close-btn');
  const clearGPBtn = document.getElementById('clear-gp-btn');
  if (settingsBtn && settingsOverlay) {
    settingsBtn.addEventListener('click', () => {
      renderSettingsModal();
      settingsOverlay.classList.add('is-visible');
    });
    settingsCloseBtn.addEventListener('click', () => {
      settingsOverlay.classList.remove('is-visible');
    });
  }
  if (clearGPBtn) {
    clearGPBtn.addEventListener('click', () => {
      window.Storage.clearGPStats();
      window.UI.showToast('Grand Prix history cleared! 🏁');
    });
  }

  // Enter key on input should save
  playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSavePlayer();
  });

  // PWA Buttons
  const installBtn = document.getElementById('install-btn');
  const installNotNowBtn = document.getElementById('install-not-now-btn');
  const installDrawer = document.getElementById('install-drawer');

  if (installBtn && installNotNowBtn) {
    installBtn.addEventListener('click', async () => {
      console.log('installBtn clicked');
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const {
          outcome
        } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          deferredPrompt = null;
        }
      }
      installDrawer.classList.remove('is-open');
      drawerOverlay.classList.remove('is-visible');
    });

    installNotNowBtn.addEventListener('click', () => {
      console.log('installNotNowBtn clicked');
      localStorage.setItem('kings-gambit-declined-install',
    'true');
      installDrawer.classList.remove('is-open');
      drawerOverlay.classList.remove('is-visible');
    });
  }
}

// Run init
init();