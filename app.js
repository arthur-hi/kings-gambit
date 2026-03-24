const DEFAULT_GAME_DATA = {

  setups: [
    { id: 'S_001', text: 'Look directly at {target} and', required_tags: ['needs-target'] },
    { id: 'S_002', text: 'You and {target} must', required_tags: ['needs-target'] },
    { id: 'S_003', text: 'Since you\'ve been quiet,', required_tags: ['solo'] },
    { id: 'S_004', text: 'Point at {target} and', required_tags: ['needs-target'] },
    { id: 'S_005', text: 'Raise a glass to the person most likely to catch a stray right now ({target}), and', required_tags: ['needs-target'] },
    { id: 'S_006', text: 'For the next two rounds, you and {target} must', required_tags: ['needs-target'] },
    { id: 'S_007', text: 'Identify the person who needs a \'good recovery\' the most ({target}) and', required_tags: ['needs-target'] },
    { id: 'S_008', text: 'Without standing up from the garden bench,', required_tags: ['solo'] },
    { id: 'S_009', text: 'Before the next person heads out for a smoke,', required_tags: ['solo'] },
    { id: 'S_010', text: 'If you are single, look at {target} and', required_tags: ['needs-target', 'single'] },
    { id: 'S_011', text: 'While maintaining unblinking eye contact with {target},', required_tags: ['needs-target'] },
    { id: 'S_012', text: 'If you\'ve ever been sick at the girls\' house, stand up and', required_tags: ['solo'] },
    { id: 'S_013', text: 'Lock eyes with the person you\'d least like to be stuck in a house with ({target}), and', required_tags: ['needs-target'] },
    { id: 'S_014', text: 'If you\'re currently the most sober person on this bench,', required_tags: ['solo'] },
    { id: 'S_015', text: 'Turn to {target}, take a deep breath, and', required_tags: ['needs-target'] },
    { id: 'S_016', text: 'Everyone who isn\'t currently wearing a coat must watch as you and {target}', required_tags: ['needs-target'] },
    { id: 'S_017', text: 'If the hard liquor has already come out, grab {target} and', required_tags: ['needs-target'] },
    { id: 'S_018', text: 'Stand on your chair, point at {target}, and loudly', required_tags: ['needs-target'] },
    { id: 'S_019', text: 'To prove you are happily single, grab {target} and', required_tags: ['needs-target', 'single'] },
    { id: 'S_020', text: 'After your next sip of beer, you must', required_tags: ['solo'] },
    { id: 'S_021', text: 'Assuming {target} is the \'Captain\' for this turn, you must', required_tags: ['needs-target'] },
    { id: 'S_022', text: 'If you\'re in the garden, find a way to', required_tags: ['solo'] },
    { id: 'S_023', text: 'Lean into {target}\'s ear and', required_tags: ['needs-target'] },
    { id: 'S_024', text: 'Hand your drink to the most \'active\' person tonight ({target}), and', required_tags: ['needs-target'] }
  ],

  "actions": [
    {
      "id": "A_001",
      "text": "deliver a brutally honest but funny stray about their worst drinking habit.",
      "tags": ["needs-target", "chill", "stray"],
      "type": "challenge",
      "gambit": { "text": "Let {target} pour you a mystery shot from the table. Down it without complaining.", "reward_type": "solo", "power_up": "Shield" }
    },
    {
      "id": "A_002",
      "text": "swap drinks and finish whatever is left in the glasses.",
      "tags": ["needs-target", "active", "messy"],
      "type": "rule",
      "gambit": { "text": "Do it without using your hands, maintaining eye contact.", "reward_type": "mutual", "power_up": "Pass" }
    },
    {
      "id": "A_003",
      "text": "say something genuinely nice for once.",
      "tags": ["needs-target", "chill"],
      "type": "challenge",
      "gambit": null
    },
    {
      "id": "A_004",
      "text": "explain the exact moment you realized {target} was a total 'good recovery' liability.",
      "tags": ["needs-target", "chill", "stray"],
      "type": "challenge",
      "gambit": { "text": "Let {target} scroll through your 'Hidden' photo album for 10 seconds.", "reward_type": "solo", "power_up": "Burden" }
    },
    {
      "id": "A_005",
      "text": "down your current drink right now.",
      "tags": ["solo", "messy"],
      "type": "rule",
      "gambit": { "text": "Let the group mix a 'chaser' of any three fridge liquids for you to finish immediately after.", "reward_type": "solo", "power_up": "Re-roll" }
    },
    {
      "id": "A_006",
      "text": "give {target} your best 'pick-up line' you’ve actually used in Brighton.",
      "tags": ["needs-target", "chill", "spicy", "single"],
      "type": "challenge",
      "gambit": { "text": "Let {target} reply to your last Tinder/Hinge match with whatever they want.", "reward_type": "solo", "power_up": "Pass" }
    },
    {
      "id": "A_007",
      "text": "act like a commentator for the next two turns, narrating everything {target} does.",
      "tags": ["needs-target", "active"],
      "type": "challenge",
      "gambit": { "text": "You must also loudly applaud and cheer every single time {target} takes a sip of their drink.", "reward_type": "solo", "power_up": "Shield" }
    },
    {
      "id": "A_008",
      "text": "point at the person in the group you think would survive the longest on a deserted island.",
      "tags": ["solo", "chill", "stray"],
      "type": "rule",
      "gambit": { "text": "You must also explain why the person to your left would be the first to die.", "reward_type": "solo", "power_up": "Burden" }
    },
    {
      "id": "A_009",
      "text": "swap one item of clothing with {target} for the rest of the session.",
      "tags": ["needs-target", "active"],
      "type": "rule",
      "gambit": { "text": "Swap drinks too and finish them before the next round.", "reward_type": "mutual", "power_up": "Pass" }
    },
    {
      "id": "A_010",
      "text": "reveal your most embarrassing 'drunk purchase'.",
      "tags": ["solo", "chill"],
      "type": "challenge",
      "gambit": { "text": "Show the group your bank statement/app from the last time you were at the girls' house.", "reward_type": "solo", "power_up": "Shield" }
    },
    {
      "id": "A_011",
      "text": "call out {target} for a 'bad take' they've had recently.",
      "tags": ["needs-target", "chill", "stray"],
      "type": "challenge",
      "gambit": { "text": "Allow {target} exactly one brutal counter-roast without you being allowed to reply.", "reward_type": "solo", "power_up": "Re-roll" }
    },
    {
      "id": "A_012",
      "text": "take a 'recovery' shot of a spirit of your choice.",
      "tags": ["solo", "messy"],
      "type": "rule",
      "gambit": { "text": "Take the shot without making any facial expression, flinching, or making a sound.", "reward_type": "solo", "power_up": "Burden" }
    },
    {
      "id": "A_013",
      "text": "sit on the floor for the next three turns.",
      "tags": ["solo", "active"],
      "type": "rule",
      "gambit": { "text": "{target} also sits on the floor. You both earn a Power-Up.", "reward_type": "mutual", "power_up": "Shield" }
    },
    {
      "id": "A_014",
      "text": "rank the singles in the room from 'Most likely to get married' to 'Most likely to die alone'.",
      "tags": ["solo", "chill", "stray", "single"],
      "type": "challenge",
      "gambit": { "text": "The singles get to choose one person for you to take a shot with.", "reward_type": "solo", "power_up": "Re-roll" }
    },
    {
      "id": "A_015",
      "text": "make everyone who has ever been sick at the girls' house take a drink.",
      "tags": ["solo", "messy", "stray"],
      "type": "rule",
      "gambit": { "text": "The person who was sick most recently takes a shot of straight spirit.", "reward_type": "solo", "power_up": "Pass" }
    },
    {
      "id": "A_016",
      "text": "tell {target} what you actually thought of them when you first met.",
      "tags": ["needs-target", "chill", "stray"],
      "type": "challenge",
      "gambit": { "text": "If it's mean, you take a drink. If it's nice, {target} takes a drink.", "reward_type": "solo", "power_up": "Shield" }
    },
    {
      "id": "A_017",
      "text": "text your most recent 'ex' something confusing (Group decides the text).",
      "tags": ["solo", "chill", "spicy", "single"],
      "type": "challenge",
      "gambit": { "text": "Wait for a reply. If they reply within 5 minutes, everyone else drinks.", "reward_type": "solo", "power_up": "Pass" }
    },
    {
      "id": "A_018",
      "text": "go outside and shout 'I love Brighton!' at the top of your lungs.",
      "tags": ["solo", "active"],
      "type": "challenge",
      "gambit": { "text": "Do it while carrying {target} on your back.", "reward_type": "mutual", "power_up": "Burden" }
    },
    {
      "id": "A_019",
      "text": "give a 1-minute 'TED Talk' on why your house is better than the others.",
      "tags": ["solo", "chill"],
      "type": "challenge",
      "gambit": { "text": "Do it while the other houses aggressively heckle you.", "reward_type": "solo", "power_up": "Re-roll" }
    },
    {
      "id": "A_020",
      "text": "try to guess {target}'s current phone passcode.",
      "tags": ["needs-target", "chill"],
      "type": "challenge",
      "gambit": { "text": "If you get it right, you get to send one tweet/post from their account.", "reward_type": "solo", "power_up": "Pass" }
    }
  ]

};

let currentHeatScore = 0;

function updateHeatScore(actionType) {
  switch (actionType) {
    case "done":
    case "nailed_it":
      currentHeatScore += 2;
      break;
    case "gambit":
      currentHeatScore += 5;
      break;
    case "dodged":
      currentHeatScore -= 1;
      break;
    case "failed":
      currentHeatScore -= 3;
      break;
  }
  if (currentHeatScore < 0) currentHeatScore = 0;
  if (currentHeatScore > 100) currentHeatScore = 100;
}

function initDataStore() {
  const existingData = localStorage.getItem('kings_gambit_data');
  if (!existingData) {
    localStorage.setItem('kings_gambit_data', JSON.stringify(DEFAULT_GAME_DATA));
  }
}

function loadRoster() {
  const rosterStr = localStorage.getItem('kings_gambit_roster');
  if (rosterStr) {
    try {
      return JSON.parse(rosterStr) || [];
    } catch (e) {
      console.error("Error parsing kings_gambit_roster", e);
      return [];
    }
  }
  return [];
}

function savePlayerToRoster(playerObj) {
  const roster = loadRoster();
  const existingIndex = roster.findIndex(p => p.name === playerObj.name);
  if (existingIndex >= 0) {
    roster[existingIndex] = playerObj;
  } else {
    roster.push(playerObj);
  }
  localStorage.setItem('kings_gambit_roster', JSON.stringify(roster));
}

function loadSession() {
  const sessionStr = localStorage.getItem('kings_gambit_current_session');
  if (sessionStr) {
    try {
      return JSON.parse(sessionStr);
    } catch (e) {
      console.error("Error parsing kings_gambit_current_session", e);
      return null;
    }
  }
  return null;
}

function saveSession(sessionObj) {
  if (sessionObj === null || sessionObj === undefined) {
    localStorage.removeItem('kings_gambit_current_session');
  } else {
    localStorage.setItem('kings_gambit_current_session', JSON.stringify(sessionObj));
  }
}

function getRandomItem(array) {
  if (!array || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomTarget(currentPlayerName, activePlayerNames) {
  const otherPlayers = activePlayerNames.filter(name => name !== currentPlayerName);
  if (otherPlayers.length === 0) return "Someone";
  return getRandomItem(otherPlayers);
}

function generateCard(playerName, activePlayerNames) {
  logVerbose(`Generating card for: ${playerName}`);
  const roster = loadRoster();
  const currentPlayer = roster.find(p => p.name === playerName);
  if (!currentPlayer) return null;

  const dataStr = localStorage.getItem('kings_gambit_data');
  if (!dataStr) return null;
  const gameData = JSON.parse(dataStr);

  const validCombinations = [];

  for (const setup of gameData.setups) {
    for (const action of gameData.actions) {
      if (!setup.required_tags || !action.tags) continue;

      const hasRequiredTags = setup.required_tags.every(tag => action.tags.includes(tag));
      if (!hasRequiredTags) continue;

      const hasBoundaryTag = action.tags.some(tag => currentPlayer.boundaries && currentPlayer.boundaries.includes(tag));
      if (hasBoundaryTag) continue;

      const combinedId = `${setup.id}+${action.id}`;
      const isInHistory = currentPlayer.history && currentPlayer.history.includes(combinedId);
      if (isInHistory) continue;

      validCombinations.push({ setup, action });
    }
  }

  logVerbose(`Found ${validCombinations.length} valid combinations for ${playerName}`);

  if (validCombinations.length === 0) {
    if (currentPlayer.history && currentPlayer.history.length > 0) {
      currentPlayer.history = [];
      savePlayerToRoster(currentPlayer);
      return generateCard(playerName, activePlayerNames);
    }
    return {
      setupText: "Well this is awkward...",
      actionText: "Your boundaries are so strict there are no cards left for you. Drink!",
      type: "rule",
      gambit: null,
      cardId: "fallback",
      target: null
    };
  }

  const selectedPair = getRandomItem(validCombinations);
  const setup = selectedPair.setup;
  const action = selectedPair.action;
  const cardId = `${setup.id}+${action.id}`;

  const combinedTags = [...new Set([...(setup.required_tags || []), ...(action.tags || [])])];
  const needsTarget = combinedTags.includes("needs-target");

  let setupText = setup.text;
  let actionText = action.text;
  let gambitObj = action.gambit ? JSON.parse(JSON.stringify(action.gambit)) : null;

  let selectedTarget = null;
  if (needsTarget) {
    selectedTarget = getRandomTarget(playerName, activePlayerNames);
    logVerbose(`Target selected: ${selectedTarget}`);
    const regex = /\{target\}/g;
    setupText = setupText.replace(regex, selectedTarget);
    actionText = actionText.replace(regex, selectedTarget);
    if (gambitObj && gambitObj.text) {
      gambitObj.text = gambitObj.text.replace(regex, selectedTarget);
    }
  }

  return {
    setupText,
    actionText,
    type: action.type,
    gambit: gambitObj,
    cardId,
    target: selectedTarget
  };
}

// ====================
// Phase 3: UI Logic
// ====================

const screenRoster = document.getElementById('screen-roster');
const screenPassAround = document.getElementById('screen-pass-around');
const screenGame = document.getElementById('screen-game');
const screenPause = document.getElementById('screen-pause');
const modalEmoji = document.getElementById('modal-emoji');
const modalNewPlayers = document.getElementById('modal-new-players');
const modalTreasury = document.getElementById('modal-treasury');
const modalTargetSelector = document.getElementById('modal-target-selector');
const modalShield = document.getElementById('modal-shield');
const btnYesNew = document.getElementById('btn-yes-new');
const btnNoNew = document.getElementById('btn-no-new');

const modalSettings = document.getElementById('modal-settings');
const btnSettings = document.getElementById('btn-settings');
const btnEndGame = document.getElementById('btn-end-game');
const btnRefreshPool = document.getElementById('btn-refresh-pool');
const cbVerboseLogs = document.getElementById('cb-verbose-logs');
const btnCloseSettings = document.getElementById('btn-close-settings');

const modalAlert = document.getElementById('modal-alert');
const modalAlertText = document.getElementById('modal-alert-text');
const btnAlertOk = document.getElementById('btn-alert-ok');

const hudName = document.getElementById('hud-name');
const hudTreasury = document.getElementById('hud-treasury');
const treasuryBadge = document.getElementById('treasury-badge');
const hudPause = document.getElementById('hud-pause');
const cardSetup = document.getElementById('card-setup');
const cardAction = document.getElementById('card-action');
const cardGambit = document.getElementById('card-gambit');
const gambitText = document.getElementById('gambit-text');
const gambitRewardText = document.getElementById('gambit-reward-text');
const actionZone = document.getElementById('action-zone');

const btnDidGambit = document.getElementById('btn-did-gambit');
const splitButtons = document.getElementById('split-buttons');
const btnNailedIt = document.getElementById('btn-nailed-it');
const btnFailed = document.getElementById('btn-failed');
const btnDoneRule = document.getElementById('btn-done-rule');

const pauseRosterList = document.getElementById('pause-roster-list');
const btnResumeGame = document.getElementById('btn-resume-game');

let currentCard = null;
const rosterGrid = document.getElementById('roster-grid');
const btnContinueRoster = document.getElementById('btn-continue-roster');
const btnDonePassing = document.getElementById('btn-done-passing');
const btnAvatar = document.getElementById('btn-avatar');
const inputName = document.getElementById('input-name');
const cbSingle = document.getElementById('cb-single');
const cbMessy = document.getElementById('cb-messy');
const cbActive = document.getElementById('cb-active');
const cbSpicy = document.getElementById('cb-spicy');
const btnImIn = document.getElementById('btn-im-in');
const emojiGrid = document.getElementById('emoji-grid');

let activePlayers = []; // Lineup for this session
const FUN_EMOJIS = ["🦊", "🐯", "🐸", "🦄", "🐷", "🐶", "🐵", "🦉", "🦇", "🐙", "🦖", "🦈", "🐊", "🐍", "🐎", "🐄", "🐖", "🐆", "🦓", "🦍"];

function logVerbose(...args) {
  if (localStorage.getItem('kings_gambit_verbose') === 'true') {
    console.log("[VERBOSE]", ...args);
  }
}

function showScreen(screenEl) {
  screenRoster.classList.add('hidden');
  screenPassAround.classList.add('hidden');
  if (screenGame) screenGame.classList.add('hidden');
  if (screenPause) screenPause.classList.add('hidden');
  screenEl.classList.remove('hidden');
}

function showAlert(message) {
  modalAlertText.innerText = message;
  modalAlert.classList.remove('hidden');
}

btnAlertOk.addEventListener('click', () => {
  modalAlert.classList.add('hidden');
});

function renderRosterScreen() {
  cbVerboseLogs.checked = (localStorage.getItem('kings_gambit_verbose') === 'true');
  const roster = loadRoster();
  if (!roster || roster.length === 0) {
    showScreen(screenPassAround);
    return;
  }

  showScreen(screenRoster);
  rosterGrid.innerHTML = '';

  roster.forEach(player => {
    const btn = document.createElement('button');
    btn.className = 'btn-roster-player';
    const av = player.avatar || "👤";
    btn.innerHTML = `${av} ${player.name}`;

    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
    });

    btn.dataset.name = player.name;
    rosterGrid.appendChild(btn);
  });
}

// --- Settings & End Game ---
btnSettings.addEventListener('click', () => {
  modalSettings.classList.remove('hidden');
});
btnCloseSettings.addEventListener('click', () => {
  modalSettings.classList.add('hidden');
});
cbVerboseLogs.addEventListener('change', (e) => {
  localStorage.setItem('kings_gambit_verbose', e.target.checked ? 'true' : 'false');
  logVerbose("Verbose logging enabled.");
});
btnRefreshPool.addEventListener('click', () => {
  localStorage.removeItem('kings_gambit_data');
  initDataStore();
  showAlert("Card pool successfully refreshed from DEFAULT_GAME_DATA!");
  logVerbose("Card pool refreshed from hardcoded defaults.");
});
btnEndGame.addEventListener('click', () => {
  if (confirm("Are you sure you want to end the current game session? Power-ups and histories will be safely saved for next time!")) {
    localStorage.removeItem('kings_gambit_current_session');
    activePlayers = [];
    currentCard = null;
    showAlert("Session Ended! Returning to the main screen.");
    renderRosterScreen();
    logVerbose("Session ended. Roster data preserved.");
  }
});

btnContinueRoster.addEventListener('click', () => {
  activePlayers = [];
  const selectedBtns = rosterGrid.querySelectorAll('.btn-roster-player.selected');
  selectedBtns.forEach(btn => {
    activePlayers.push(btn.dataset.name);
  });

  if (activePlayers.length === 0) {
    showAlert("You didn't select any returning players! Sending you to setup to add someone new.");
    showScreen(screenPassAround);
    return;
  }

  modalNewPlayers.classList.remove('hidden');
});

btnYesNew.addEventListener('click', () => {
  modalNewPlayers.classList.add('hidden');
  showScreen(screenPassAround);
});

btnNoNew.addEventListener('click', () => {
  modalNewPlayers.classList.add('hidden');
  startGameLoop();
});

btnAvatar.addEventListener('click', () => {
  modalEmoji.classList.remove('hidden');
  emojiGrid.innerHTML = '';

  FUN_EMOJIS.forEach(emoji => {
    const btn = document.createElement('button');
    btn.className = 'btn-emoji';
    btn.innerText = emoji;
    btn.addEventListener('click', () => {
      btnAvatar.innerText = emoji;
      modalEmoji.classList.add('hidden');
    });
    emojiGrid.appendChild(btn);
  });
});

btnImIn.addEventListener('click', () => {
  const nameVal = inputName.value.trim();
  if (!nameVal) {
    showAlert("Please enter a name!");
    return;
  }

  const boundaries = [];
  if (cbMessy.checked) boundaries.push("messy");
  if (cbActive.checked) boundaries.push("active");
  if (cbSpicy.checked) boundaries.push("spicy");

  const newPlayer = {
    name: nameVal,
    avatar: btnAvatar.innerText,
    boundaries: boundaries,
    is_single: cbSingle.checked,
    power_ups: {},
    history: [],
    tag_stats: {}
  };

  savePlayerToRoster(newPlayer);
  activePlayers.push(nameVal);

  inputName.value = '';
  btnAvatar.innerText = '👤';
  cbMessy.checked = false;
  cbActive.checked = false;
  cbSpicy.checked = false;
  cbSingle.checked = true;
});

btnDonePassing.addEventListener('click', () => {
  if (activePlayers.length === 0) {
    showAlert("Someone needs to join before starting!");
    return;
  }
  screenPassAround.classList.add('hidden');
  logVerbose("Start Game Loop with players:", activePlayers);
  startGameLoop();
});

// ====================
// Phase 4: Game Loop Logic
// ====================

function startGameLoop() {
  const session = { activePlayers: activePlayers, turnIndex: 0 };
  saveSession(session);
  showScreen(screenGame);
  playNextTurn();
}

function playNextTurn() {
  const session = loadSession();
  if (!session || !session.activePlayers || session.activePlayers.length === 0) return;

  const currentPlayerName = session.activePlayers[session.turnIndex % session.activePlayers.length];
  hudName.innerText = `${currentPlayerName}'S TURN`;

  currentCard = generateCard(currentPlayerName, session.activePlayers);
  if (!currentCard) {
    logVerbose(`Out of cards for ${currentPlayerName}`);
    session.turnIndex++;
    saveSession(session);
    setTimeout(playNextTurn, 100);
    return;
  }

  cardSetup.innerText = currentCard.setupText;
  cardAction.innerText = currentCard.actionText;

  if (currentCard.type === 'rule') {
    btnDoneRule.classList.remove('hidden');
    splitButtons.classList.add('hidden');
  } else {
    splitButtons.classList.remove('hidden');
    btnDoneRule.classList.add('hidden');
  }

  if (currentCard.gambit) {
    cardGambit.classList.remove('hidden');
    btnDidGambit.classList.remove('hidden');
    gambitText.innerText = currentCard.gambit.text;
    gambitRewardText.innerText = currentCard.gambit.power_up
      ? `Power Up: ${currentCard.gambit.power_up}`
      : `${currentCard.gambit.reward_type}`;
  } else {
    cardGambit.classList.add('hidden');
    btnDidGambit.classList.add('hidden');
  }

  updateTreasuryUI(currentPlayerName);
}

function updateTreasuryUI(playerName) {
  const roster = loadRoster();
  const player = roster.find(p => p.name === playerName);
  if (!player) return;

  let total = 0;
  if (player.power_ups) {
    for (const count of Object.values(player.power_ups)) total += count;
  }

  if (total > 0) {
    treasuryBadge.innerText = total;
    treasuryBadge.classList.remove('hidden');
  } else {
    treasuryBadge.classList.add('hidden');
  }
}

function deductPowerUp(type, playerName) {
  const roster = loadRoster();
  const playerIndex = roster.findIndex(p => p.name === playerName);
  if (playerIndex >= 0) {
    roster[playerIndex].power_ups[type] -= 1;
    savePlayerToRoster(roster[playerIndex]);
  }
  updateTreasuryUI(playerName);
}

let pendingPowerUp = null;
let originalPasserName = null;

if (hudTreasury) {
  hudTreasury.addEventListener('click', () => {
    if (!currentCard) return;
    const session = loadSession();
    const currentPlayerName = currentCard.performingPlayer || session.activePlayers[session.turnIndex % session.activePlayers.length];
    const roster = loadRoster();
    const player = roster.find(p => p.name === currentPlayerName);

    const treasuryList = document.getElementById('treasury-list');
    treasuryList.innerHTML = '';

    let hasItems = false;
    if (player && player.power_ups) {
      for (const [pType, count] of Object.entries(player.power_ups)) {
        if (count > 0) {
          hasItems = true;
          const btn = document.createElement('button');
          if (pType === 'Shield') {
            btn.className = 'btn-secondary';
            btn.innerText = `${pType} (${count}) - Auto Triggers`;
            btn.disabled = true;
            btn.style.opacity = '0.6';
          } else {
            btn.className = 'btn-primary';
            btn.innerText = `Use ${pType} (${count})`;
            btn.addEventListener('click', () => usePowerUp(pType, player.name));
          }
          treasuryList.appendChild(btn);
        }
      }
    }

    if (!hasItems) {
      const emptyMsg = document.createElement('p');
      emptyMsg.style.color = '#fff';
      emptyMsg.innerText = 'Treasury Empty...';
      treasuryList.appendChild(emptyMsg);
    }

    modalTreasury.classList.remove('hidden');
  });
}

function usePowerUp(type, playerName) {
  modalTreasury.classList.add('hidden');

  if (type === 'Re-roll') {
    deductPowerUp(type, playerName);
    playNextTurn();
    return;
  }

  if (type === 'Pass' || type === 'Burden') {
    pendingPowerUp = type;
    originalPasserName = playerName;

    // Start target selection WITHOUT deducting yet
    const targetList = document.getElementById('target-list');
    targetList.innerHTML = '';

    const session = loadSession();
    const others = session.activePlayers.filter(p => p !== playerName);
    others.forEach(otherName => {
      const btn = document.createElement('button');
      btn.className = 'btn-primary';
      btn.innerText = otherName;
      btn.addEventListener('click', () => handleTargetSelected(otherName));
      targetList.appendChild(btn);
    });

    document.getElementById('target-selector-title').innerText = `Select Target for ${type}`;
    modalTargetSelector.classList.remove('hidden');
  }
}

function handleTargetSelected(targetName) {
  modalTargetSelector.classList.add('hidden');

  // They successfully picked a target! Deduct the passer's item now.
  deductPowerUp(pendingPowerUp, originalPasserName);

  const roster = loadRoster();
  const targetPlayer = roster.find(p => p.name === targetName);
  const hasShield = targetPlayer && targetPlayer.power_ups && targetPlayer.power_ups['Shield'] > 0;

  if (hasShield && pendingPowerUp === 'Pass') {
    document.getElementById('shield-message').innerText = `${targetName}, ${originalPasserName} is trying to Pass to you!`;
    modalShield.classList.remove('hidden');

    const btnUse = document.getElementById('btn-use-shield');
    const btnAccept = document.getElementById('btn-accept-fate');

    const newUse = btnUse.cloneNode(true);
    const newAccept = btnAccept.cloneNode(true);
    btnUse.parentNode.replaceChild(newUse, btnUse);
    btnAccept.parentNode.replaceChild(newAccept, btnAccept);

    newUse.addEventListener('click', () => {
      modalShield.classList.add('hidden');
      deductPowerUp('Shield', targetName);
      showAlert(`${targetName} used a Shield! The card bounced back to ${originalPasserName}!`);

      applyPowerUpEffect(pendingPowerUp, originalPasserName, originalPasserName);
    });

    newAccept.addEventListener('click', () => {
      modalShield.classList.add('hidden');
      applyPowerUpEffect(pendingPowerUp, targetName, originalPasserName);
    });
  } else {
    applyPowerUpEffect(pendingPowerUp, targetName, originalPasserName);
  }
}

function applyPowerUpEffect(type, victimName, attackerName) {
  if (type === 'Pass') {
    // If the attacker is passing the card specifically TO the current target, swap roles!
    if (currentCard.target && currentCard.target === victimName) {
      const regex = new RegExp(currentCard.target, 'g');
      currentCard.setupText = currentCard.setupText.replace(regex, attackerName);
      currentCard.actionText = currentCard.actionText.replace(regex, attackerName);
      if (currentCard.gambit) currentCard.gambit.text = currentCard.gambit.text.replace(regex, attackerName);
      currentCard.target = attackerName;
    }

    currentCard.performingPlayer = victimName;
    hudName.innerText = `${victimName}'S TURN`;
    cardSetup.innerText = currentCard.setupText;
    cardAction.innerText = currentCard.actionText;
    if (currentCard.gambit) document.getElementById('gambit-text').innerText = currentCard.gambit.text;
    updateTreasuryUI(victimName);
  }
  else if (type === 'Burden') {
    currentCard.actionText = `${attackerName} and ${victimName} must ` + currentCard.actionText.charAt(0).toLowerCase() + currentCard.actionText.slice(1);
    if (currentCard.gambit) {
      currentCard.gambit.reward_type = 'mutual';
      currentCard.target = victimName;
    }
    cardAction.innerText = currentCard.actionText;
  }
}

if (document.getElementById('btn-close-treasury')) document.getElementById('btn-close-treasury').addEventListener('click', () => modalTreasury.classList.add('hidden'));
if (document.getElementById('btn-close-targets')) document.getElementById('btn-close-targets').addEventListener('click', () => modalTargetSelector.classList.add('hidden'));

function handleTurnResult(resultType) {
  if (!currentCard) return;

  logVerbose(`Turn resolved with result: ${resultType}`);
  updateHeatScore(resultType);

  const roster = loadRoster();
  const session = loadSession();
  const currentPlayerName = currentCard.performingPlayer || session.activePlayers[session.turnIndex % session.activePlayers.length];

  const playerIndex = roster.findIndex(p => p.name === currentPlayerName);
  if (playerIndex >= 0) {
    if (resultType === 'gambit' && currentCard.gambit) {
      const powerUp = currentCard.gambit.power_up;
      if (powerUp) {
        if (!roster[playerIndex].power_ups) roster[playerIndex].power_ups = {};
        roster[playerIndex].power_ups[powerUp] = (roster[playerIndex].power_ups[powerUp] || 0) + 1;

        if (currentCard.gambit.reward_type === 'mutual' && currentCard.target) {
          const targetIndex = roster.findIndex(p => p.name === currentCard.target);
          if (targetIndex >= 0) {
            if (!roster[targetIndex].power_ups) roster[targetIndex].power_ups = {};
            roster[targetIndex].power_ups[powerUp] = (roster[targetIndex].power_ups[powerUp] || 0) + 1;
          }
        }
      }
    }

    if (!roster[playerIndex].history) roster[playerIndex].history = [];
    roster[playerIndex].history.push(currentCard.cardId);
    savePlayerToRoster(roster[playerIndex]);
  }

  session.turnIndex++;
  saveSession(session);

  playNextTurn();
}

btnNailedIt.addEventListener('click', () => handleTurnResult("nailed_it"));
btnFailed.addEventListener('click', () => handleTurnResult("failed"));
btnDoneRule.addEventListener('click', () => handleTurnResult("done"));
btnDidGambit.addEventListener('click', () => handleTurnResult("gambit"));

function renderPauseScreen() {
  showScreen(screenPause);
  pauseRosterList.innerHTML = '';

  activePlayers.forEach(playerName => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.justifyContent = 'space-between';
    row.style.alignItems = 'center';
    row.style.marginBottom = '15px';
    row.style.background = '#2a2a2a';
    row.style.padding = '15px';
    row.style.borderRadius = '12px';

    const nameEl = document.createElement('span');
    nameEl.style.fontSize = '1.2rem';
    nameEl.innerText = playerName;

    const btnBed = document.createElement('button');
    btnBed.className = 'btn-danger';
    btnBed.innerText = 'Send to Bed';
    btnBed.style.minHeight = '40px';
    btnBed.style.padding = '0 15px';
    btnBed.style.width = 'auto'; // override massive width

    btnBed.addEventListener('click', () => {
      activePlayers = activePlayers.filter(n => n !== playerName);
      row.remove();

      const session = loadSession();
      if (session) {
        session.activePlayers = activePlayers;
        saveSession(session);
      }
    });

    row.appendChild(nameEl);
    row.appendChild(btnBed);
    pauseRosterList.appendChild(row);
  });
}

if (hudPause) {
  hudPause.addEventListener('click', renderPauseScreen);
}
if (btnResumeGame) {
  btnResumeGame.addEventListener('click', () => {
    showScreen(screenGame);
    if (!currentCard) {
      playNextTurn();
    }
  });
}

function initGame() {
  initDataStore();
  const existingSession = loadSession();
  if (existingSession && existingSession.activePlayers && existingSession.activePlayers.length > 0) {
    activePlayers = existingSession.activePlayers;
    renderPauseScreen();
  } else {
    renderRosterScreen();
  }
}

initGame();
