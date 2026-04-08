// Avatar packs for the drawer
const PACKS = {
  animated: [
    'packs/animated/aintnowway.gif', 'packs/animated/aSpookyDance.gif', 'packs/animated/aurafarmer.gif', 'packs/animated/basedsigma.gif', 'packs/animated/catdance.gif', 'packs/animated/catshake.gif', 'packs/animated/chipichapa.gif', 'packs/animated/come-here-monkey.gif', 'packs/animated/cry.gif', 'packs/animated/crying-laughing.gif', 'packs/animated/dafoe.gif', 'packs/animated/dance.gif', 'packs/animated/dancee.gif', 'packs/animated/disapproval.gif', 'packs/animated/drimk.gif', 'packs/animated/freaky.gif', 'packs/animated/galaxybrainmeme.gif', 'packs/animated/kekmeme.gif', 'packs/animated/kiss-you.gif', 'packs/animated/lil_swag.gif', 'packs/animated/noooo.gif', 'packs/animated/nowaying.gif', 'packs/animated/num-num.gif', 'packs/animated/ohhhh.gif', 'packs/animated/plink.gif', 'packs/animated/polish_cow.gif', 'packs/animated/puts.gif', 'packs/animated/rickroll.gif', 'packs/animated/sasuke-stare.gif', 'packs/animated/shelby.gif', 'packs/animated/shhhhhh.gif', 'packs/animated/sideeye.gif', 'packs/animated/sip.gif', 'packs/animated/skull.gif', 'packs/animated/smirkhenry.gif', 'packs/animated/sr-doou.gif', 'packs/animated/sure.gif', 'packs/animated/sus.gif', 'packs/animated/the-rock.gif', 'packs/animated/thevoices.gif', 'packs/animated/troll-dance.gif', 'packs/animated/tweak.gif', 'packs/animated/vape.gif', 'packs/animated/vibecat.gif', 'packs/animated/wait-wait-wait.gif', 'packs/animated/walter.gif'
  ],
  clash_royale: [
    'packs/clash-royale/Emote_HogRider_Think.png', 'packs/clash-royale/Emote_king_hide.png', 'packs/clash-royale/Emote_Princess_YoChill.png', 'packs/clash-royale/emotes_goblin_pocketwatch_dl.png', 'packs/clash-royale/emotes_goblinhero_trollface_dl.png', 'packs/clash-royale/emotes_goldenknight_mewing_dl.png', 'packs/clash-royale/emotes_golem_sneaky_dl.png', 'packs/clash-royale/emotes_golem_susrock_dl.png', 'packs/clash-royale/emotes_royalhogsevo_phone_dl.png', 'packs/clash-royale/emotes_skeleton_shieldbang_dl.png'
  ],
  meme: [
    'packs/meme/absolutecinema.png', 'packs/meme/ahhhhh.png', 'packs/meme/babythink.png', 'packs/meme/cat.png', 'packs/meme/cathink.png', 'packs/meme/confused-mrbean.png', 'packs/meme/cooked-soldier.png', 'packs/meme/cooked.png', 'packs/meme/do-not-get-diddled.png', 'packs/meme/giga-chad.png', 'packs/meme/hamstermeme.png', 'packs/meme/happywisetree.png', 'packs/meme/harold.png', 'packs/meme/holyskull.png', 'packs/meme/lets-go.png', 'packs/meme/minion.png', 'packs/meme/monkeythink.png', 'packs/meme/perrito.png', 'packs/meme/thousandyardstare.png', 'packs/meme/widespeedlaugh.png', 'packs/meme/win.png'
  ],
  tiktok: [
    'packs/tiktok/angel.png', 'packs/tiktok/angry.png', 'packs/tiktok/complacent.png', 'packs/tiktok/cute-tiktok.png', 'packs/tiktok/cute.png', 'packs/tiktok/disdain.png', 'packs/tiktok/emoji.png', 'packs/tiktok/flushed.png', 'packs/tiktok/funnyface.png', 'packs/tiktok/hehe.png', 'packs/tiktok/loveface.png', 'packs/tiktok/nap.png', 'packs/tiktok/pride.png', 'packs/tiktok/proud.png', 'packs/tiktok/rage.png', 'packs/tiktok/shock.png', 'packs/tiktok/shout.png', 'packs/tiktok/slap.png'
  ],
  top_gear: [
    'packs/top-gear/clarkson-l.png', 'packs/top-gear/clarkson-oh-no.png', 'packs/top-gear/clarkson-oops.png', 'packs/top-gear/clarkson-smug.png', 'packs/top-gear/clarkson-snooze.png', 'packs/top-gear/clarkson-thumps-up.png', 'packs/top-gear/clarkson-yay.png', 'packs/top-gear/hammond-aa55hol.png', 'packs/top-gear/hammond-may-cheers.png', 'packs/top-gear/hammond-may-expectation.png', 'packs/top-gear/hammond-may-oh-lord.png', 'packs/top-gear/hammond-oh-no.png', 'packs/top-gear/hammond-uhh.png', 'packs/top-gear/hammond-wtf.png', 'packs/top-gear/hammond-yass.png', 'packs/top-gear/may-bedtime.png', 'packs/top-gear/may-cat.png', 'packs/top-gear/may-drinks.png', 'packs/top-gear/may-great-news.png', 'packs/top-gear/may-happy.png', 'packs/top-gear/may-hearteyes.png', 'packs/top-gear/may-l.png', 'packs/top-gear/may-photobomb.png', 'packs/top-gear/may-snooze.png', 'packs/top-gear/may-v.png', 'packs/top-gear/may-yay.png', 'packs/top-gear/stig-gorgeous.png', 'packs/top-gear/stig-turned.png'
  ],
  jujutsu_kaisen: [
    'packs/jujutsu-kaisen/10021-choso-facepalm.png', 'packs/jujutsu-kaisen/13252-vaimorrer.png', 'packs/jujutsu-kaisen/53542-yuji-dead.png', 'packs/jujutsu-kaisen/84962-hollow-purple.gif', 'packs/jujutsu-kaisen/86168-gojo-crazy.gif', 'packs/jujutsu-kaisen/95523-sukuna-clap.gif'
  ]
};

// DOM Elements
const rosterEl = document.getElementById('roster');
const editBtn = document.getElementById('edit-btn');
const gamesList = document.querySelectorAll('.game-card');

// Drawer DOM Elements
const drawerOverlay = document.getElementById('drawer-overlay');
const addPlayerDrawer = document.getElementById('add-player-drawer');
const drawerCloseBtn = document.getElementById('drawer-close');
const playerNameInput = document.getElementById('player-name');
const packTabs = document.getElementById('pack-tabs');
const emojiGrid = document.getElementById('emoji-grid');
const savePlayerBtn = document.getElementById('save-player-btn');

// State
let isEditMode = false;
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

// Global Drag Listeners
document.addEventListener('mousemove', handleGlobalMove, { passive: false });
document.addEventListener('mouseup', handleGlobalUp);
document.addEventListener('touchmove', handleGlobalMove, { passive: false });
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
      avatar.innerHTML = `<img src="${player.emoji}" class="avatar-image" draggable="false">`;
    } else {
      avatar.textContent = player.emoji;
    }

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
  if (players.filter(p => p.isActive).length >= 2 && !isEditMode) {
    dragHint.style.display = 'block';
  } else {
    dragHint.style.display = 'none';
  }
}

let isProcessingClick = false;

function handlePlayerClick(id) {
  if (isProcessingClick) return;
  isProcessingClick = true;

  if (isEditMode) {
    window.Storage.deletePlayer(id);
    renderRoster();
    updateGamesLockState();
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
  el.addEventListener('touchstart', handleDown, { passive: true });
}

// --- Drawer Logic ---
function initEmojiGrid() {
  packTabs.innerHTML = '';
  Object.keys(PACKS).forEach(packName => {
    const btn = document.createElement('button');
    btn.className = `pack-pill ${packName === currentPack ? 'active' : ''}`;
    btn.textContent = packName.replace('_', ' ');
    btn.addEventListener('click', () => {
      currentPack = packName;
      initEmojiGrid();
    });
    packTabs.appendChild(btn);
  });

  emojiGrid.innerHTML = '';
  PACKS[currentPack].forEach(emoji => {
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

function closeDrawer() {
  drawerOverlay.classList.remove('is-visible');
  addPlayerDrawer.classList.remove('is-open');
  playerNameInput.blur(); // dismiss keyboard
}

function handleAddPlayer() {
  const name = playerNameInput.value.trim();
  if (!name) return; // Ignore if empty

  window.Storage.addPlayer(name, selectedEmoji);
  closeDrawer();
  renderRoster();
  updateGamesLockState();
}

// --- Games Lock Logic ---
function updateGamesLockState() {
  const activeCount = window.Storage.getActivePlayers().length;
  const shouldLock = activeCount < 2;

  gamesList.forEach(card => {
    // Only lock implemented games or explicitly lock dummies
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
  savePlayerBtn.addEventListener('click', handleAddPlayer);

  // Enter key on input should save
  playerNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddPlayer();
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
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          deferredPrompt = null;
        }
      }
      installDrawer.classList.remove('is-open');
      drawerOverlay.classList.remove('is-visible');
    });

    installNotNowBtn.addEventListener('click', () => {
      console.log('installNotNowBtn clicked');
      localStorage.setItem('kings-gambit-declined-install', 'true');
      installDrawer.classList.remove('is-open');
      drawerOverlay.classList.remove('is-visible');
    });
  }
}

// Run init
init();
