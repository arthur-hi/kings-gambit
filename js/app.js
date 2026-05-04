// Avatar packs for the drawer load from packs.js
const PACKS = window.PACKS;

// DOM Elements
const rosterEl = document.getElementById('roster');
const editBtn = document.getElementById('edit-btn');
const settingsBtn = document.getElementById('settings-btn');
const gamesList = document.querySelectorAll('.game-card');

// Settings (save logic stays here; read helpers are now shared via window.UI)
//const SETTINGS_KEY = 'kings-gambit-settings';
function getSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch(e) { return {}; }
}
function saveSettings(obj) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...getSettings(), ...obj }));
}
// Delegate to shared version in storage.js / window.UI
function getAvatarMode() {
  return window.UI ? window.UI.getAvatarMode() : (getSettings().avatarMode || 'animated');
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

const FRAME_CATEGORIES = [
  {
    id: 'mutiny',
    label: '☠️ Mutiny',
    path: 'frames/mutiny',
    frames: [
      'bones', 'gold-coins-and-dark-marks', 'sea-waves', 'skeletons-and-bones',
      'skulls', 'smoking-pipes', 'steering-wheel', 'tentacles', 'under-the-sea'
    ]
  },
  {
    id: 'grand-prix',
    label: '🏎️ Grand Prix',
    path: 'frames/grand-prix',
    frames: ['rain-of-gold', 'rich-as-dog']
  },
  {
    id: 'ring-of-fire',
    label: '🔥 Ring of Fire',
    path: 'frames/ring-of-fire',
    frames: ['gambling', 'good-fortune']
  },
  {
    id: 'handshake',
    label: '🤝 The Handshake',
    path: 'frames/handshake',
    frames: ['award-winner', 'im-nuts', 'soy-maw']
  }
];
// Flat list used by mutiny.js case-opening (mutiny frames only)
const FRAMES = FRAME_CATEGORIES[0].frames;
let selectedFrame = null;

const BACKGROUND_CATEGORIES = [
  {
    id: 'mutiny',
    label: '☠️ Mutiny',
    path: 'backgrounds/mutiny',
    backgrounds: [
      'crania', 'hiding-pirates', 'pirate-crossing', 'secret-treasures',
      'smoking-killed', 'smoking-kills', 'treasure-island', 'walking-pirates'
    ]
  },
  {
    id: 'grand-prix',
    label: '🏎️ Grand Prix',
    path: 'backgrounds/grand-prix',
    backgrounds: ['credits', 'the-car', 'twin-turbo-95', 'vrummmm']
  },
  {
    id: 'ring-of-fire',
    label: '🔥 Ring of Fire',
    path: 'backgrounds/ring-of-fire',
    backgrounds: ['consumerism', 'stock-graph']
  },
  {
    id: 'handshake',
    label: '🤝 The Handshake',
    path: 'backgrounds/handshake',
    backgrounds: ['cockroach-party', 'the-great-unknown']
  }
];
// Flat mutiny-only list (unlockable via treasure event)
const BACKGROUNDS = BACKGROUND_CATEGORIES[0].backgrounds;
let selectedBackground = null;

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

// --- Avatar Mode Rendering (delegates to shared window.UI helpers) ---
function renderAvatarImg(src, forceAnimate = false) {
  return window.UI ? window.UI.renderAvatarImg(src, forceAnimate)
    : `<img src="${src}" class="avatar-image" draggable="false">`;
}

function snapshotStaticCanvases() {
  if (window.UI && window.UI.snapshotStaticCanvases) window.UI.snapshotStaticCanvases();
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
  //initEmojiGrid();
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
  } else if (window.UI && window.UI.startAnimatedCanvases) {
    window.UI.startAnimatedCanvases();
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

  const packEmojis = PACKS[currentPack];
  const initialEmojis = packEmojis.slice(0, 12);
  const remainingEmojis = packEmojis.slice(12);

  const renderEmojiBtn = (emoji) => {
    // Skip avatars already chosen by other players
    if (takenEmojis.includes(emoji)) return null;

    const btn = document.createElement('button');
    btn.className = `emoji-btn ${emoji === selectedEmoji ? 'is-selected' : ''}`;

    if (emoji.endsWith('.png') || emoji.endsWith('.gif')) {
      btn.innerHTML = renderAvatarImg(emoji, true);
    } else {
      btn.textContent = emoji;
    }

    btn.addEventListener('click', () => {
      playerNameInput.blur();
      selectedEmoji = emoji;
      document.querySelectorAll('#emoji-grid .emoji-btn').forEach(b => b.classList.remove('is-selected'));
      btn.classList.add('is-selected');
    });
    return btn;
  };

  initialEmojis.forEach(emoji => {
    const btn = renderEmojiBtn(emoji);
    if (btn) emojiGrid.appendChild(btn);
  });

  if (remainingEmojis.length > 0) {
    const appendRemaining = () => {
      remainingEmojis.forEach(emoji => {
        const btn = renderEmojiBtn(emoji);
        if (btn) emojiGrid.appendChild(btn);
      });
      if (window.UI && window.UI.startAnimatedCanvases) {
        window.UI.startAnimatedCanvases();
      }
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(appendRemaining);
    } else {
      setTimeout(appendRemaining, 100);
    }
  } else {
    if (window.UI && window.UI.startAnimatedCanvases) {
      window.UI.startAnimatedCanvases();
    }
  }
}

function initFrameGrid() {
  const frameGrid = document.getElementById('frame-grid');
  if (!frameGrid) return;
  frameGrid.innerHTML = '';
  
  const players = window.Storage.getPlayers();
  let playerUnlockedFrames = [];
  if (editingPlayerId) {
    const p = players.find(p => p.id === editingPlayerId);
    if (p && p.unlocked_frames) playerUnlockedFrames = p.unlocked_frames;
  }

  const itemsToRender = [];
  FRAME_CATEGORIES.forEach(category => {
    itemsToRender.push({ type: 'header', label: category.label });
    category.frames.forEach(frame => {
      itemsToRender.push({ type: 'frame', category, frame });
    });
  });

  const renderItem = (item) => {
    if (item.type === 'header') {
      const header = document.createElement('p');
      header.style.cssText = [
        'font-size: 0.7rem',
        'font-weight: 800',
        'letter-spacing: 1.5px',
        'text-transform: uppercase',
        'color: var(--color-text-muted)',
        'margin: 12px 0 6px',
        'width: 100%',
        'grid-column: 1 / -1',
      ].join(';');
      header.textContent = item.label;
      return header;
    } else {
      const { category, frame } = item;
      const isMutinyFrame = category.id === 'mutiny';
      const isUnlocked = isMutinyFrame && playerUnlockedFrames.includes(frame);

      const btn = document.createElement('button');
      btn.className = `emoji-btn ${frame === selectedFrame ? 'is-selected' : ''}`;
      btn.style.position = 'relative';

      if (!isUnlocked) {
        btn.style.opacity = '0.5';
      }

      btn.innerHTML = `<img src="${category.path}/${frame}.png" style="width: 100%; height: 100%; object-fit: cover;" draggable="false">`
        + (isUnlocked ? '' : `<span style="position:absolute;bottom:2px;right:3px;font-size:0.65rem;line-height:1;">🔒</span>`);

      btn.addEventListener('click', () => {
        playerNameInput.blur();
        if (!isUnlocked) {
          if (window.UI && window.UI.showToast) {
            const msg = isMutinyFrame
              ? "You need to unlock this frame in-game first!"
              : `${category.label.split(' ').slice(1).join(' ')} frames aren't unlockable yet — coming soon!`;
            window.UI.showToast(msg);
          }
          return;
        }
        if (selectedFrame === frame) {
          selectedFrame = null;
          btn.classList.remove('is-selected');
        } else {
          selectedFrame = frame;
          frameGrid.querySelectorAll('.emoji-btn').forEach(b => b.classList.remove('is-selected'));
          btn.classList.add('is-selected');
        }
      });
      return btn;
    }
  };

  const initialItems = itemsToRender.slice(0, 12);
  const remainingItems = itemsToRender.slice(12);

  initialItems.forEach(item => frameGrid.appendChild(renderItem(item)));

  if (remainingItems.length > 0) {
    const appendRemaining = () => {
      remainingItems.forEach(item => frameGrid.appendChild(renderItem(item)));
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(appendRemaining);
    } else {
      setTimeout(appendRemaining, 100);
    }
  }
}

function initBackgroundGrid() {
  const bgGrid = document.getElementById('background-grid');
  if (!bgGrid) return;
  bgGrid.innerHTML = '';

  const players = window.Storage.getPlayers();
  let playerUnlockedBgs = [];
  if (editingPlayerId) {
    const p = players.find(p => p.id === editingPlayerId);
    if (p && p.unlocked_backgrounds) playerUnlockedBgs = p.unlocked_backgrounds;
  }

  const itemsToRender = [];
  BACKGROUND_CATEGORIES.forEach(category => {
    itemsToRender.push({ type: 'header', label: category.label });
    category.backgrounds.forEach(bg => {
      itemsToRender.push({ type: 'background', category, bg });
    });
  });

  const renderItem = (item) => {
    if (item.type === 'header') {
      const header = document.createElement('p');
      header.style.cssText = [
        'font-size: 0.7rem',
        'font-weight: 800',
        'letter-spacing: 1.5px',
        'text-transform: uppercase',
        'color: var(--color-text-muted)',
        'margin: 12px 0 6px',
        'width: 100%',
        'grid-column: 1 / -1',
      ].join(';');
      header.textContent = item.label;
      return header;
    } else {
      const { category, bg } = item;
      const isMutinyBg = category.id === 'mutiny';
      const isUnlocked = isMutinyBg && playerUnlockedBgs.includes(bg);

      const btn = document.createElement('button');
      btn.className = `emoji-btn ${bg === selectedBackground ? 'is-selected' : ''}`;
      btn.style.cssText = 'position:relative; overflow:hidden; padding:0;';

      if (!isUnlocked) {
        btn.style.opacity = '0.5';
      }

      // Media preview container
      const mediaContainer = document.createElement('div');
      mediaContainer.style.cssText = 'width:100%;height:100%;position:absolute;inset:0;pointer-events:none;';
      
      const renderMedia = (isSelected) => {
        if (isSelected) {
          mediaContainer.innerHTML = `<video preload="none" muted loop playsinline src="${category.path}/${bg}.webm" style="width:100%;height:100%;object-fit:cover;display:block;"></video>`;
          const vid = mediaContainer.querySelector('video');
          vid.play().catch(() => {});
        } else {
          mediaContainer.innerHTML = `<img src="${category.path}/${bg}.jpg" style="width:100%;height:100%;object-fit:cover;display:block;">`;
        }
      };
      
      renderMedia(bg === selectedBackground);
      btn.appendChild(mediaContainer);

      if (!isUnlocked) {
        const lock = document.createElement('span');
        lock.style.cssText = 'position:absolute;bottom:2px;right:3px;font-size:0.65rem;line-height:1;';
        lock.textContent = '🔒';
        btn.appendChild(lock);
      }

      btn.addEventListener('click', () => {
        playerNameInput.blur();
        if (!isUnlocked) {
          if (window.UI && window.UI.showToast) {
            const msg = isMutinyBg
              ? "You need to unlock this background in-game first!"
              : `${category.label.split(' ').slice(1).join(' ')} backgrounds aren't unlockable yet — coming soon!`;
            window.UI.showToast(msg);
          }
          return;
        }
        
        if (selectedBackground === bg) {
          selectedBackground = null;
          btn.classList.remove('is-selected');
          renderMedia(false); // Demote to image
        } else {
          selectedBackground = bg;
          
          // Deselect others visually
          bgGrid.querySelectorAll('.emoji-btn').forEach(b => {
             b.classList.remove('is-selected');
          });
          btn.classList.add('is-selected');
          
          // Demote all other bg items to image, promote this to video via event
          document.dispatchEvent(new CustomEvent('backgroundSelected', { detail: bg }));
        }
      });
      
      document.addEventListener('backgroundSelected', (e) => {
        renderMedia(bg === e.detail);
      });

      return btn;
    }
  };

  const initialItems = itemsToRender.slice(0, 12);
  const remainingItems = itemsToRender.slice(12);

  initialItems.forEach(item => bgGrid.appendChild(renderItem(item)));

  if (remainingItems.length > 0) {
    const appendRemaining = () => {
      remainingItems.forEach(item => bgGrid.appendChild(renderItem(item)));
    };
    if ('requestIdleCallback' in window) {
      requestIdleCallback(appendRemaining);
    } else {
      setTimeout(appendRemaining, 100);
    }
  }
}

function openDrawer() {
  if (isEditMode) toggleEditMode();

  editingPlayerId = null;
  drawerTitle.textContent = 'New Player';
  savePlayerBtn.textContent = 'Add Player';
  playerNameInput.value = '';
  currentPack = 'animated';
  selectedEmoji = PACKS[currentPack][0];
  selectedFrame = null;
  selectedBackground = null;
  initEmojiGrid();
  initFrameGrid();
  initBackgroundGrid();
  
  document.getElementById('avatar-section').style.display = 'block';
  document.getElementById('frame-section').style.display = 'none';
  document.getElementById('background-section').style.display = 'none';
  document.getElementById('toggle-avatar-btn').classList.remove('secondary');
  document.getElementById('toggle-frame-btn').classList.add('secondary');
  document.getElementById('toggle-background-btn').classList.add('secondary');

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
  selectedFrame = player.active_frame || null;
  selectedBackground = player.active_background || null;
  initEmojiGrid();
  initFrameGrid();
  initBackgroundGrid();
  
  document.getElementById('avatar-section').style.display = 'block';
  document.getElementById('frame-section').style.display = 'none';
  document.getElementById('background-section').style.display = 'none';
  document.getElementById('toggle-avatar-btn').classList.remove('secondary');
  document.getElementById('toggle-frame-btn').classList.add('secondary');
  document.getElementById('toggle-background-btn').classList.add('secondary');

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
  
  if (window.UI && window.UI.stopAnimatedCanvases) {
    window.UI.stopAnimatedCanvases();
  }
}

function handleSavePlayer() {
  const name = playerNameInput.value.trim();
  if (!name) return; // Ignore if empty

  if (editingPlayerId) {
    window.Storage.updatePlayer(editingPlayerId, name, selectedEmoji, undefined, selectedFrame, selectedBackground);
  } else {
    const newId = window.Storage.addPlayer(name, selectedEmoji);
    if (selectedFrame || selectedBackground) {
      window.Storage.updatePlayer(newId, name, selectedEmoji, undefined, selectedFrame, selectedBackground);
    }
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
  
  const toggleAvatarBtn = document.getElementById('toggle-avatar-btn');
  const toggleFrameBtn = document.getElementById('toggle-frame-btn');
  const avatarSection = document.getElementById('avatar-section');
  const frameSection = document.getElementById('frame-section');
  
  if (toggleAvatarBtn && toggleFrameBtn) {
    const bgBtn = document.getElementById('toggle-background-btn');
    const bgSection = document.getElementById('background-section');

    const showAvatar = () => {
      avatarSection.style.display = 'block';
      frameSection.style.display = 'none';
      if (bgSection) bgSection.style.display = 'none';
      toggleAvatarBtn.classList.remove('secondary');
      toggleFrameBtn.classList.add('secondary');
      if (bgBtn) bgBtn.classList.add('secondary');
    };
    const showFrame = () => {
      avatarSection.style.display = 'none';
      frameSection.style.display = 'block';
      if (bgSection) bgSection.style.display = 'none';
      toggleAvatarBtn.classList.add('secondary');
      toggleFrameBtn.classList.remove('secondary');
      if (bgBtn) bgBtn.classList.add('secondary');
    };
    const showBg = () => {
      avatarSection.style.display = 'none';
      frameSection.style.display = 'none';
      if (bgSection) bgSection.style.display = 'block';
      toggleAvatarBtn.classList.add('secondary');
      toggleFrameBtn.classList.add('secondary');
      if (bgBtn) bgBtn.classList.remove('secondary');
    };

    toggleAvatarBtn.addEventListener('click', showAvatar);
    toggleFrameBtn.addEventListener('click', showFrame);
    if (bgBtn) bgBtn.addEventListener('click', showBg);
  }

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