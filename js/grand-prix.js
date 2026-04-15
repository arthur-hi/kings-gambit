// ====== PHASE 1 & 2: STATE ENGINE ====== //
const activePlayers = window.Storage ? window.Storage.getActivePlayers() : [];
let currentRound = 1;
let scores = {}; // playerId -> points
let lastScores = {};
let fastestLapId = null;
let totalDrinks = {};
let drinksThisLap = {};
let minigameQueue = []; // Array of string names

function addDrinks(playerId, count = 1) {
  if (activePlayers.find(p => p.id === playerId)) {
    totalDrinks[playerId] = (totalDrinks[playerId] || 0) + count;
    drinksThisLap[playerId] = (drinksThisLap[playerId] || 0) + count;
  }
}
function addDrinksByName(playerName, count = 1) {
  let p = activePlayers.find(p => p.name === playerName);
  if (p) addDrinks(p.id, count);
}

// Elements
const backBtn = document.getElementById('back-btn');
const introSequence = document.getElementById('intro-sequence');
const ladderStandings = document.getElementById('ladder-standings');
const minigameArena = document.getElementById('minigame-arena');
const podiumReveal = document.getElementById('podium-reveal');
const startGPBtn = document.getElementById('start-gp-btn');
const ladderNextBtn = document.getElementById('ladder-next-btn');

const turnPassScreen = document.getElementById('turn-pass-screen');
const passPlayerName = document.getElementById('pass-player-name');
const passActionText = document.getElementById('pass-action-text');
const passReadyBtn = document.getElementById('pass-ready-btn');

function init() {
  if (activePlayers.length < 4) {
    window.location.href = 'index.html';
    return;
  }
  
  window.gpRecorded = false;
  
  // Render History
  renderGPHistory();
  
  // Initialize scores
  activePlayers.forEach(p => {
    scores[p.id] = 0;
    lastScores[p.id] = 0;
    totalDrinks[p.id] = 0;
  });

  generateQueue();
  setupEventListeners();
}

function setupEventListeners() {
  const exitOverlay = document.getElementById('exit-overlay');
  if (backBtn && exitOverlay) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      exitOverlay.classList.add('is-visible');
    });
    
    document.getElementById('exit-stay-btn').addEventListener('click', () => {
      exitOverlay.classList.remove('is-visible');
    });
    
    document.getElementById('exit-quit-btn').addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  } else {
    backBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }

  startGPBtn.addEventListener('click', () => {
    introSequence.style.display = 'none';
    showStartingGrid();
  });

  ladderNextBtn.addEventListener('click', () => {
    ladderStandings.style.display = 'none';
    startNextMinigame();
  });
}

function generateQueue() {
  const individuals = ['blind-bid', 'phantom-count', 'red-wire', 'poison-chalice', 'the-start-lights', 'memory-flash', 'high-low-gamble', 'bubble-pop', 'the-pour', 'pointing-game'];
  const teams = ['ticking-bomb', 'sync-mash', 'shared-pulse'];
  
  // Shuffle arrays
  individuals.sort(() => Math.random() - 0.5);
  teams.sort(() => Math.random() - 0.5);
  
  // Minigame circuit: 3 individual, 2 team, randomized order
  minigameQueue = [...individuals, ...teams].sort(() => Math.random() - 0.5);
}

function generateBalancedTeams() {
  // Sort players by score ascending (lowest score first)
  const sortedPlayers = [...activePlayers].sort((a, b) => scores[a.id] - scores[b.id]);
  
  const teamA = [];
  const teamB = [];
  
  // Pair highest with lowest
  while (sortedPlayers.length > 0) {
    let p1 = sortedPlayers.pop(); // Highest remaining
    let p2 = sortedPlayers.shift(); // Lowest remaining
    
    // Assign to teams trying to balance sizes as much as possible
    if (teamA.length <= teamB.length) {
      if (p1) teamA.push(p1);
      if (p2) teamB.push(p2);
    } else {
      if (p1) teamB.push(p1);
      if (p2) teamA.push(p2);
    }
  }
  
  return { teamA, teamB };
}

function showStartingGrid() {
  const gridPanel = document.getElementById('starting-grid');
  gridPanel.style.display = 'flex';
  
  // Randomize player order for starting grid
  let gridOrder = [...activePlayers].sort(() => Math.random() - 0.5);
  
  let html = `
    <h2 class="gp-heading">STARTING GRID</h2>
    <div style="display:flex; justify-content:center; gap:16px; margin: 24px 0;">
      <div id="light-1" class="f1-light"></div>
      <div id="light-2" class="f1-light"></div>
      <div id="light-3" class="f1-light"></div>
      <div id="light-4" class="f1-light"></div>
      <div id="light-5" class="f1-light"></div>
    </div>
    <div id="lights-out-text" style="font-size: 1.5rem; font-weight: 900; color: #ef4444; opacity: 0; transition: opacity 0.3s; margin-bottom: 24px; text-transform: uppercase;">AWAITING SIGNAL...</div>
    
    <div style="position: relative; width: 100%; max-width: 320px; margin: 0 auto; padding-bottom: 50px; max-height: 40vh; overflow-y: auto; overflow-x: hidden; background: #262626; border-left: 4px solid white; border-right: 4px solid white; border-radius: 8px;" class="bg-checkered">
  `;
  
  gridOrder.forEach((p, i) => {
    const isLeft = i % 2 === 0;
    let emojiHtml = p.emoji.endsWith('.png') || p.emoji.endsWith('.gif') 
      ? `<img src="${p.emoji}" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;">` 
      : p.emoji;
      
    const nameHtml = `<div style="font-size: 1.1rem; font-weight: 900; color: white; margin: 0 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 90px;">${p.name}</div>`;
      
    html += `
      <div style="display: flex; justify-content: ${isLeft ? 'flex-start' : 'flex-end'}; align-items: center; padding: ${isLeft ? '20px 0 0 16px' : '0 16px 0 0'}; margin-top: ${isLeft ? '16px' : '-35px'};">
        ${!isLeft ? nameHtml : ''}
        <div class="avatar" style="width:50px; height:50px; min-width:50px; font-size:2rem; display:flex; align-items:center; justify-content:center; box-shadow: 0 4px 10px rgba(0,0,0,0.5); background: var(--color-bg-alt); position:relative; z-index:${10-i};">
          ${emojiHtml}
          <div style="position:absolute; bottom:-10px; right:-10px; background:var(--color-primary); color:#000; font-size:0.8rem; font-weight:900; width:22px; height:22px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border:2px solid #000;">${i+1}</div>
        </div>
        ${isLeft ? nameHtml : ''}
      </div>
    `;
  });
  
  html += `</div>`;
  gridPanel.innerHTML = html;
  
  let step = 1;
  const lightInterval = setInterval(() => {
    if (step <= 5) {
      document.getElementById(`light-${step}`).style.backgroundColor = '#ef4444';
      document.getElementById(`light-${step}`).style.boxShadow = '0 0 15px #ef4444';
      step++;
    } else {
      clearInterval(lightInterval);
      const delay = 500 + Math.random() * 1500;
      setTimeout(() => {
        // Lights out
        for (let i = 1; i <= 5; i++) {
          const l = document.getElementById(`light-${i}`);
          l.style.backgroundColor = '#404040';
          l.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.5)';
        }
        const textArea = document.getElementById('lights-out-text');
        textArea.textContent = 'LIGHTS OUT AND AWAY WE GO!';
        textArea.style.opacity = '1';
        textArea.style.color = 'var(--color-timing)'; 
        
        setTimeout(() => {
          gridPanel.style.display = 'none';
          startNextMinigame(); // LAP 1
        }, 2000);
        
      }, delay);
    }
  }, 1000);
}

async function showLadder() {
  ladderStandings.style.display = 'flex';
  
  const ladderList = document.getElementById('ladder-list');
  const narrator = document.getElementById('gp-narrator');
  const nextBtn = document.getElementById('ladder-next-btn');
  
  nextBtn.style.display = 'none';
  narrator.style.opacity = '1';
  narrator.textContent = 'Processing lap times...';
  
  // 1. Initial Render with LAST scores
  ladderList.innerHTML = '';
  // Sort descending by LAST scores
  let sortedP = [...activePlayers].sort((a, b) => lastScores[b.id] - lastScores[a.id]);

  const renderList = (playersList, scoreMap) => {
    ladderList.innerHTML = '';
    playersList.forEach((p, index) => {
      const item = document.createElement('div');
      item.className = 'ladder-item';
      item.dataset.id = p.id;
      item.style.position = 'relative';
      item.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.3s';
      
      let extraIcon = (p.id === fastestLapId) ? `<span style="color: var(--color-fl); margin-left: 8px;">⏱️</span>` : '';
      
      let emojiHtml = p.emoji.endsWith('.png') || p.emoji.endsWith('.gif') 
        ? `<img src="${p.emoji}" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;">` 
        : p.emoji;
        
      item.innerHTML = `
        <div class="ladder-item-left">
          <div class="ladder-rank" style="font-family:monospace;">P${index + 1}</div>
          <div class="avatar" style="width:40px; height:40px; font-size:1.5rem; display:flex; align-items:center; justify-content:center; background:var(--color-bg-alt);">
            ${emojiHtml}
          </div>
          <div style="font-size: 1.2rem; font-weight: 700;">${p.name}</div>
        </div>
        <div class="ladder-points" style="display:flex; align-items:center;">
          <span class="pts-val">${scoreMap[p.id]} pts</span>
          ${extraIcon}
        </div>
      `;
      ladderList.appendChild(item);
    });
  };
  
  renderList(sortedP, lastScores);
  
  const delay = ms => new Promise(res => setTimeout(res, ms));
  await delay(1000);
  
  // 2. Track original positions
  const startRanks = {};
  sortedP.forEach((p, i) => startRanks[p.id] = i + 1);

  // 3. Announce Points (Bottom to Top)
  const processOrder = [...sortedP].reverse();
  for (let p of processOrder) {
    const gained = scores[p.id] - lastScores[p.id];
    if (gained !== 0) {
      const row = ladderList.querySelector(`[data-id="${p.id}"]`);
      if (row) row.style.backgroundColor = 'rgba(250, 204, 21, 0.2)'; 
      
      narrator.style.opacity = '0';
      await delay(200);
      const absPts = Math.abs(gained);
      const verb = gained > 0 ? 'gains' : 'loses';
      narrator.textContent = `${p.name} ${verb} ${absPts} point${absPts > 1 ? 's' : ''}!`;
      narrator.style.opacity = '1';
      
      if (row) {
        const ptsVal = row.querySelector('.pts-val');
        ptsVal.style.color = gained > 0 ? '#22c55e' : '#ef4444';
        ptsVal.textContent = `${scores[p.id]} pts`;
      }
      lastScores[p.id] = scores[p.id];
      await delay(800);
      if (row) {
        row.style.backgroundColor = 'var(--color-bg-alt)';
        const ptsVal = row.querySelector('.pts-val');
        ptsVal.style.color = 'var(--color-primary)';
      }
    }
  }

  // 4. Final Rank Check & Narration
  const finalSortedP = [...activePlayers].sort((a, b) => scores[b.id] - scores[a.id]);
  const movedPlayers = finalSortedP.filter((p, i) => (i + 1) !== startRanks[p.id]);

  if (movedPlayers.length > 0) {
      const p1 = finalSortedP[0];
      narrator.style.opacity = '0';
      await delay(200);
      if (startRanks[p1.id] !== 1) {
          narrator.textContent = `${p1.name} takes the lead in P1!`;
      } else {
          narrator.textContent = `The standings have shifted!`;
      }
      narrator.style.opacity = '1';
      
      const firstRects = {};
      Array.from(ladderList.children).forEach(item => firstRects[item.dataset.id] = item.getBoundingClientRect());
      
      renderList(finalSortedP, scores); 
      
      Array.from(ladderList.children).forEach(item => {
        if (firstRects[item.dataset.id]) {
          const deltaY = firstRects[item.dataset.id].top - item.getBoundingClientRect().top;
          if (deltaY !== 0) {
            item.style.transform = `translateY(${deltaY}px)`;
            item.style.transition = 'none';
            requestAnimationFrame(() => {
              item.style.transform = '';
              item.style.transition = 'transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            });
          }
        }
      });
      await delay(1500);
  }
  
  // 5. Check for Pit Stops (Drink penalties for dodging drinks)
  let playersNoDrinksLastLap = activePlayers.filter(p => !drinksThisLap[p.id]);
  if (playersNoDrinksLastLap.length > 0 && currentRound <= 5) {
      let minDrinks = Math.min(...activePlayers.map(p => totalDrinks[p.id] || 0));
      let pitStopPlayers = activePlayers.filter(p => (totalDrinks[p.id] || 0) === minDrinks);
      
      if (pitStopPlayers.length > 0) {
          narrator.style.opacity = '0';
          await delay(200);
          narrator.textContent = `PIT STOP: ${pitStopPlayers.map(p=>p.name).join(' & ')} must drink!`;
          narrator.style.color = '#ef4444';
          narrator.style.opacity = '1';
          pitStopPlayers.forEach(p => addDrinks(p.id));
          await delay(2500);
          narrator.style.color = 'var(--color-timing)';
      }
  }
  
  narrator.style.opacity = '0';
  await delay(200);
  narrator.textContent = currentRound > 5 ? 'Circuit finished. Awaiting final podium...' : 'Grid set for next lap.';
  narrator.style.opacity = '1';
  
  nextBtn.textContent = currentRound > 5 ? 'SEE RESULTS' : 'NEXT LAP';
  nextBtn.style.display = 'block';
  
  // ensure completely synced
  Object.assign(lastScores, scores);
  // Optional: clear fastest lap so it doesn't linger
  // fastestLapId = null;
}

function startNextMinigame() {
  if (currentRound > 5) {
     showPodium();
     return;
  }
  
  const bootGame = () => {
    drinksThisLap = {};
    const game = minigameQueue[currentRound - 1];
    console.log('Starting:', game);
    minigameArena.style.display = 'flex';
    minigameArena.innerHTML = ''; // Clear arena
    
    if (game === 'blind-bid') playBlindBid();
    else if (game === 'phantom-count') playPhantomCount();
    else if (game === 'red-wire') playRedWire();
    else if (game === 'poison-chalice') playPoisonChalice();
    else if (game === 'the-start-lights') playTheStartLights();
    else if (game === 'memory-flash') playMemoryFlash();
    else if (game === 'high-low-gamble') playHighLowGamble();
    else if (game === 'bubble-pop') playBubblePop();
    else if (game === 'the-pour') playThePour();
    else if (game === 'pointing-game') playThePointingGame();
    else if (game === 'ticking-bomb') playTickingBomb();
    else if (game === 'sync-mash') playSyncMash();
    else if (game === 'shared-pulse') playSharedPulse();
    else {
      // Fallback if game not implemented yet
      minigameArena.innerHTML = `<h2>${game}</h2><button id="skip-btn" class="btn-3d">Skip</button>`;
      document.getElementById('skip-btn').onclick = processRoundEnd;
    }
  };
  
  if (currentRound === 5) {
     minigameArena.style.display = 'flex';
     minigameArena.innerHTML = `
        <div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; flex-direction:column; background-color: var(--color-bg); z-index:50;">
           <div style="font-size: 5rem; animation: wiggle 0.5s infinite;">🏳️</div>
           <h2 style="font-size: 3rem; font-weight: 900; color: white; margin-top: 16px;">FINAL LAP</h2>
        </div>
     `;
     setTimeout(() => {
        bootGame();
     }, 2000);
  } else {
     bootGame();
  }
}

function processRoundEnd() {
  currentRound++;
  minigameArena.style.display = 'none';
  showLadder();
}

// --- MINIGAME LOGIC: INDIVIDUAL --- //

function playBlindBid() {
  let currentPlayerIndex = 0;
  const bids = {};
  
  const turnLoop = () => {
    if (currentPlayerIndex >= activePlayers.length) {
      revealBlindBids(bids);
      return;
    }
    
    const player = activePlayers[currentPlayerIndex];
    showPassScreen(player.name, 'Submit your secret bid', () => {
      minigameArena.innerHTML = `
        <h2 class="gp-heading">BLIND BID</h2>
        <p class="gp-subtitle">Bid 1-10 sips. Highest <b>unique</b> bidder wins a point. Everyone drinks what they bid.</p>
        <div style="margin: 32px 0;">
          <input type="number" id="bid-input" class="input-text" style="width: 150px; font-size: 2rem; text-align: center;" min="1" max="10" value="1">
        </div>
        <button id="bid-submit" class="btn-3d btn-primary">LOCK BID</button>
      `;
      
      document.getElementById('bid-submit').onclick = () => {
        const val = parseInt(document.getElementById('bid-input').value) || 1;
        bids[player.id] = Math.max(1, Math.min(10, val));
        currentPlayerIndex++;
        turnLoop();
      };
    });
  };
  turnLoop();
}

function revealBlindBids(bids) {
  const freq = {};
  for (let pid in bids) {
    let b = bids[pid];
    freq[b] = (freq[b] || 0) + 1;
  }
  
  let highestUnique = -1;
  for (let bStr in freq) {
    let b = parseInt(bStr);
    if (freq[b] === 1 && b > highestUnique) highestUnique = b;
  }
  
  let winnerNames = [];
  for (let pid in bids) {
    if (bids[pid] === highestUnique) {
      scores[pid] += 1;
      const p = activePlayers.find(pl => pl.id === pid);
      if (p) winnerNames.push(p.name);
    }
  }
  
  let html = `<h2 class="gp-heading">RESULTS</h2>`;
  if (winnerNames.length > 0) {
    html += `<p style="font-size: 1.5rem; color: var(--color-primary); margin-bottom: 24px;">${winnerNames.join(', ')} won with a unique bid of ${highestUnique}!</p>`;
  } else {
    html += `<p style="font-size: 1.5rem; color: var(--color-text-muted); margin-bottom: 24px;">No unique bids! No one scores.</p>`;
  }
  
  html += `<div style="text-align: left; max-width: 300px; margin: 0 auto 24px; width: 100%;" class="ladder-list">`;
  activePlayers.forEach(p => {
    addDrinks(p.id, bids[p.id]);
    html += `<div class="ladder-item" style="padding: 12px 16px; width: 100%; justify-content: space-between;"><span style="font-weight:700;">${p.name} bid ${bids[p.id]}</span> <span style="color:var(--color-secondary); font-weight:900;">DRINKS ${bids[p.id]}</span></div>`;
  });
  html += `</div><button id="end-minigame-btn" class="btn-3d btn-primary">CONTINUE</button>`;
  
  minigameArena.innerHTML = html;
  document.getElementById('end-minigame-btn').onclick = processRoundEnd;
}

function playPhantomCount() {
  let currentPlayerIndex = 0;
  const variances = {};
  
  const turnLoop = () => {
    if (currentPlayerIndex >= activePlayers.length) {
      revealPhantomCount(variances);
      return;
    }
    
    const player = activePlayers[currentPlayerIndex];
    showPassScreen(player.name, 'Stop the timer exactly at 7.00s', () => {
      minigameArena.innerHTML = `
        <h2 class="gp-heading">PHANTOM COUNT</h2>
        <div id="phantom-timer" style="font-size: 4rem; font-weight: 900; margin: 32px 0;">0.00s</div>
        <button id="phantom-action" class="btn-3d btn-primary" style="background-color: #22c55e;">START</button>
      `;
      
      const timerDisplay = document.getElementById('phantom-timer');
      const actionBtn = document.getElementById('phantom-action');
      let startTime = 0;
      let interval = null;
      
      actionBtn.onclick = () => {
        if (!startTime) {
          startTime = performance.now();
          actionBtn.textContent = 'STOP';
          actionBtn.style.backgroundColor = '#ef4444';
          interval = requestAnimationFrame(function update() {
            const elapsed = (performance.now() - startTime) / 1000;
            if (elapsed < 2.0) {
              timerDisplay.textContent = elapsed.toFixed(2) + 's';
            } else {
              timerDisplay.textContent = '?.??s';
              timerDisplay.style.color = 'var(--color-text-muted)';
            }
            interval = requestAnimationFrame(update);
          });
        } else {
          cancelAnimationFrame(interval);
          const stopTime = performance.now();
          const elapsed = (stopTime - startTime) / 1000;
          timerDisplay.textContent = elapsed.toFixed(2) + 's';
          timerDisplay.style.color = 'var(--color-primary)';
          actionBtn.style.display = 'none';
          
          variances[player.id] = Math.abs(elapsed - 7.0);
          
          setTimeout(() => {
            currentPlayerIndex++;
            turnLoop();
          }, 2500);
        }
      };
    });
  };
  turnLoop();
}

function revealPhantomCount(variances) {
  let winners = [];
  let losers = [];
  let minVar = Infinity;
  let maxVar = -1;
  activePlayers.forEach(p => {
    if (variances[p.id] < minVar) minVar = variances[p.id];
    if (variances[p.id] > maxVar) maxVar = variances[p.id];
  });
  
  activePlayers.forEach(p => {
    if (variances[p.id] === minVar) {
      scores[p.id] += 1;
      winners.push(p.name);
    }
    if (variances[p.id] === maxVar) {
      losers.push(p.name);
      addDrinks(p.id, 3);
    }
  });
  
  let html = `<h2 class="gp-heading">RESULTS</h2>`;
  html += `<p style="font-size: 1.5rem; color: var(--color-primary); margin-bottom: 8px;">${winners.join(', ')} won!</p>`;
  html += `<p style="font-size: 1.2rem; color: var(--color-secondary); margin-bottom: 24px;">${losers.join(', ')} drinks.</p>`;
  
  html += `<div style="text-align: left; max-width: 300px; width: 100%; margin: 0 auto 24px;" class="ladder-list">`;
  const sortedP = [...activePlayers].sort((a, b) => variances[a.id] - variances[b.id]);
  sortedP.forEach(p => {
    html += `<div class="ladder-item" style="padding: 8px 16px;"><span>${p.name}</span> <span style="font-family:monospace; color:var(--color-text-muted);">off by ${variances[p.id].toFixed(2)}s</span></div>`;
  });
  html += `</div><button id="end-minigame-btn" class="btn-3d btn-primary">CONTINUE</button>`;
  
  minigameArena.innerHTML = html;
  document.getElementById('end-minigame-btn').onclick = processRoundEnd;
}

function playRedWire() {
  let currentPlayerIndex = 0;
  const picks = {};
  const wires = [
    {id: 'red', color: '#ef4444'},
    {id: 'blue', color: '#3b82f6'},
    {id: 'green', color: '#22c55e'},
    {id: 'yellow', color: '#eab308'},
    {id: 'purple', color: '#a855f7'}
  ];
  
  const turnLoop = () => {
    if (currentPlayerIndex >= activePlayers.length) {
      revealRedWire(picks, wires);
      return;
    }
    const player = activePlayers[currentPlayerIndex];
    showPassScreen(player.name, 'Pick a wire to cut', () => {
      let html = `<h2 class="gp-heading">THE RED WIRE</h2><p class="gp-subtitle">Secretly pick a wire. One will explode.</p><div style="display:flex; flex-direction:column; gap:12px; margin: 32px 0;">`;
      wires.forEach(w => {
         html += `<button class="btn-3d wire-btn" data-id="${w.id}" style="background-color: ${w.color}; width: 200px; height: 50px; font-size: 1.2rem; margin: 0 auto;">${w.id.toUpperCase()}</button>`;
      });
      html += `</div>`;
      minigameArena.innerHTML = html;
      
      document.querySelectorAll('.wire-btn').forEach(btn => {
        btn.onclick = (e) => {
          picks[player.id] = e.target.getAttribute('data-id');
          currentPlayerIndex++;
          turnLoop();
        };
      });
    });
  };
  turnLoop();
}

function revealRedWire(picks, wires) {
  minigameArena.innerHTML = `
    <h2 class="gp-heading">ALL WIRES CUT</h2>
    <p class="gp-subtitle">Place the phone in the middle.</p>
    <div id="wires-display" style="display:flex; gap:16px; margin: 32px 0; justify-content: center; align-items: flex-end; height: 200px;">
      ${wires.map(w => `<div id="wire-${w.id}" style="width: 20px; height: 150px; background-color: ${w.color}; border-radius: 10px; transition: all 0.5s;"></div>`).join('')}
    </div>
    <button id="reveal-wire-btn" class="btn-3d btn-primary">REVEAL EXPLOSION</button>
  `;
  
  document.getElementById('reveal-wire-btn').onclick = () => {
    const explodingWire = wires[Math.floor(Math.random() * wires.length)].id;
    
    const extWire = document.getElementById(`wire-${explodingWire}`);
    extWire.style.transform = 'scale(1.5)';
    extWire.style.boxShadow = '0 0 40px #ef4444';
    extWire.style.backgroundColor = '#ef4444';
    
    setTimeout(() => {
      let survivors = [];
      let losers = [];
      activePlayers.forEach(p => {
        if (picks[p.id] === explodingWire) {
          losers.push(p.name);
          addDrinks(p.id);
        } else {
          survivors.push(p.name);
          scores[p.id] += 1;
        }
      });
      
      let html = `<h2 class="gp-heading" style="color: #ef4444;">${explodingWire.toUpperCase()} EXPLODED</h2>`;
      if (losers.length > 0) {
        html += `<p style="font-size: 1.5rem; color: #ef4444; margin-bottom: 12px; font-weight:900;">${losers.join(', ')} blown up! Drink!</p>`;
      } else {
        html += `<p style="font-size: 1.5rem; color: var(--color-primary); margin-bottom: 12px;">No one picked ${explodingWire}! Safe!</p>`;
      }
      if (survivors.length > 0) {
        html += `<p style="color: var(--color-text-muted); margin-bottom: 24px;">Survivors (+1 pt): ${survivors.join(', ')}</p>`;
      }
      html += `<button id="end-minigame-btn" class="btn-3d btn-primary">CONTINUE</button>`;
      
      minigameArena.innerHTML = html;
      document.getElementById('end-minigame-btn').onclick = processRoundEnd;
    }, 1500);
  };
}

function playPoisonChalice() {
  let poisoner = activePlayers[0];
  let poisonCup = null;
  let picks = {};

  const showPoisonerTurn = () => {
    showPassScreen(poisoner.name, 'You are the Poisoner', () => {
      minigameArena.innerHTML = `
        <h2 class="gp-heading">POISON CHALICE</h2>
        <p class="gp-subtitle">Pick a cup to hide the poison (☠️)</p>
        <div style="display:flex; justify-content:center; gap:16px; margin: 32px 0;">
          ${[0,1,2,3].map(i => `<button class="btn-3d cup-btn" data-id="${i}" style="font-size:3rem; padding:16px;">🥤</button>`).join('')}
        </div>
      `;
      document.querySelectorAll('.cup-btn').forEach(btn => {
        btn.onclick = (e) => {
          poisonCup = parseInt(e.target.getAttribute('data-id'));
          currentPlayerIndex = 1;
          turnLoop();
        };
      });
    });
  };

  let currentPlayerIndex = 1;
  const turnLoop = () => {
    if (currentPlayerIndex >= activePlayers.length) {
      revealPoisonChalice(poisoner, poisonCup, picks);
      return;
    }
    const player = activePlayers[currentPlayerIndex];
    showPassScreen(player.name, 'Pick a cup to drink from', () => {
      minigameArena.innerHTML = `
        <h2 class="gp-heading">POISON CHALICE</h2>
        <p class="gp-subtitle">One of these is poisoned. Pick wisely.</p>
        <div style="display:flex; justify-content:center; gap:16px; margin: 32px 0;">
          ${[0,1,2,3].map(i => `<button class="btn-3d cup-btn" data-id="${i}" style="font-size:3rem; padding:16px;">🥤</button>`).join('')}
        </div>
      `;
      document.querySelectorAll('.cup-btn').forEach(btn => {
        btn.onclick = (e) => {
          picks[player.id] = parseInt(e.target.getAttribute('data-id'));
          currentPlayerIndex++;
          turnLoop();
        };
      });
    });
  };

  showPoisonerTurn();
}

function revealPoisonChalice(poisoner, poisonCup, picks) {
  minigameArena.innerHTML = `
    <h2 class="gp-heading">THE REVEAL</h2>
    <div id="cups-display" style="display:flex; justify-content:center; gap:16px; margin: 32px 0;">
      ${[0,1,2,3].map(i => `<div class="cup-reveal-card" id="cup-${i}" style="font-size:4rem; transition: transform 0.5s;">🥤</div>`).join('')}
    </div>
    <button id="reveal-chalice-btn" class="btn-3d btn-primary">LIFT CUPS</button>
  `;

  document.getElementById('reveal-chalice-btn').onclick = () => {
    [0,1,2,3].forEach(i => {
      const el = document.getElementById(`cup-${i}`);
      el.style.transform = 'translateY(-30px) scale(1.1)';
      setTimeout(() => {
        el.textContent = i === poisonCup ? '☠️' : '💧';
        el.style.transform = 'translateY(0) scale(1)';
      }, 500);
    });

    setTimeout(() => {
      let poisonedNames = [];
      let kills = 0;
      activePlayers.forEach(p => {
        if (p.id !== poisoner.id) {
          if (picks[p.id] === poisonCup) {
            poisonedNames.push(p.name);
            addDrinks(p.id);
            kills++;
          }
        }
      });
      
      scores[poisoner.id] += kills;
      
      let html = `<h2 class="gp-heading">RESULTS</h2>`;
      if (kills > 0) {
        html += `<p style="font-size: 1.5rem; color: #ef4444; margin-bottom: 8px;">${poisonedNames.join(', ')} drank poison!</p>`;
        html += `<p style="font-size: 1.2rem; color: var(--color-primary); margin-bottom: 24px;">${poisoner.name} gets +${kills} pts.</p>`;
      } else {
        html += `<p style="font-size: 1.5rem; color: var(--color-primary); margin-bottom: 24px;">Nobody was poisoned!</p>`;
      }
      html += `<button id="end-minigame-btn" class="btn-3d btn-primary">CONTINUE</button>`;
      
      minigameArena.innerHTML = html;
      document.getElementById('end-minigame-btn').onclick = processRoundEnd;
    }, 1500);
  };
}

function playTheStartLights() {
  let currentPlayerIndex = 0;
  let reactionTimes = {};

  const turnLoop = () => {
    if (currentPlayerIndex >= activePlayers.length) {
      revealTheStartLights(reactionTimes);
      return;
    }

    const player = activePlayers[currentPlayerIndex];
    showPassScreen(player.name, 'Get ready to test your reaction time', () => {
      minigameArena.innerHTML = `
        <div id="reaction-area" style="position:fixed; top:0; left:0; width:100vw; height:100vh; display:flex; align-items:center; justify-content:center; flex-direction:column; background-color: var(--color-bg); z-index:auto; cursor: pointer; user-select: none; touch-action: none;">
          <h2 class="gp-heading" style="margin-bottom: 48px; position:relative; z-index:10000;">THE START LIGHTS</h2>
          <div style="display:flex; justify-content:center; gap:16px; margin: 24px 0; background: #262626; padding: 24px; border-radius: 16px; box-shadow: inset 0 4px 10px rgba(0,0,0,0.5);">
            <div id="rl-1" class="f1-light"></div>
            <div id="rl-2" class="f1-light"></div>
            <div id="rl-3" class="f1-light"></div>
            <div id="rl-4" class="f1-light"></div>
            <div id="rl-5" class="f1-light"></div>
          </div>
          <p id="reaction-text" style="font-size: 1.5rem; font-weight: 900; color: #ef4444; opacity: 1; margin-top: 24px;">WAIT FOR LIGHTS OUT...</p>
        </div>
      `;

      const area = document.getElementById('reaction-area');
      const text = document.getElementById('reaction-text');
      
      let state = 'building';
      let greenTime = 0;
      let timeoutId = null;
      
      let step = 1;
      let intervalId = setInterval(() => {
        if (state !== 'building') {
           clearInterval(intervalId);
           return;
        }
        if (step <= 5) {
          const l = document.getElementById(`rl-${step}`);
          if (l) {
             l.style.backgroundColor = '#ef4444';
             l.style.boxShadow = '0 0 15px #ef4444';
             area.style.backgroundColor = `rgba(239, 68, 68, ${0.1 * step})`;
          }
          step++;
        } else {
          clearInterval(intervalId);
          state = 'waiting';
          const delay = 500 + Math.random() * 2000;
          timeoutId = setTimeout(() => {
            if (state !== 'waiting') return;
            state = 'ready';
            for (let i = 1; i <= 5; i++) {
              const l = document.getElementById(`rl-${i}`);
              if(l) { l.style.backgroundColor = '#404040'; l.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.5)'; }
            }
            area.style.backgroundColor = 'rgba(34, 197, 94, 0.5)'; // TINT GREEN
            text.textContent = 'GO!';
            text.style.color = 'var(--color-timing)';
            greenTime = performance.now();
          }, delay);
        }
      }, 1000);
      
      const handleTap = (e) => {
        if (e) e.preventDefault();
        if (state === 'done') return;
        
        if (state === 'building' || state === 'waiting') {
          clearInterval(intervalId);
          clearTimeout(timeoutId);
          state = 'done';
          
          for (let i = 1; i <= 5; i++) {
            const l = document.getElementById(`rl-${i}`);
            if(l) { l.style.backgroundColor = '#ef4444'; l.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.5)'; }
          }
          text.style.color = '#ef4444';
          text.textContent = 'FALSE START!';
          reactionTimes[player.id] = 9999;
          
          setTimeout(() => {
            currentPlayerIndex++;
            turnLoop();
          }, 2000);
          
        } else if (state === 'ready') {
          state = 'done';
          const reactTime = performance.now() - greenTime;
          reactionTimes[player.id] = reactTime;
          area.style.backgroundColor = 'rgba(0, 242, 255, 0.1)';
          text.style.color = 'var(--color-timing)';
          text.textContent = `${reactTime.toFixed(0)} ms`;
          
          setTimeout(() => {
            currentPlayerIndex++;
            turnLoop();
          }, 2000);
        }
      };

      area.addEventListener('mousedown', handleTap);
      area.addEventListener('touchstart', handleTap, {passive:false});
    });
  };
  turnLoop();
}

function revealTheStartLights(times) {
  let minTime = Infinity;
  let maxTime = -1;
  let fastPlayer = null;
  activePlayers.forEach(p => {
    if (times[p.id] < minTime) {
      minTime = times[p.id];
      fastPlayer = p;
    }
    if (times[p.id] > maxTime) maxTime = times[p.id];
  });
  
  if (fastPlayer && minTime !== 9999) {
    fastestLapId = fastPlayer.id; // Award Fastest Lap
  } else {
    fastestLapId = null;
  }
  
  let winners = [];
  let losers = [];
  activePlayers.forEach(p => {
    if (times[p.id] === minTime && minTime !== 9999) { winners.push(p.name); scores[p.id] += 1; }
    if (times[p.id] === maxTime) { 
        losers.push(p.name); 
        addDrinks(p.id);
    }
  });
  
  let html = `<h2 class="gp-heading">RESULTS</h2>`;
  if (winners.length > 0) {
    html += `<p style="font-size: 1.5rem; color: var(--color-primary); margin-bottom: 8px;">${winners.join(', ')} won!</p>`;
  } else {
    html += `<p style="font-size: 1.5rem; color: #ef4444; margin-bottom: 8px;">EVERYONE FALSE STARTED!</p>`;
  }
  html += `<p style="font-size: 1.2rem; color: var(--color-secondary); margin-bottom: 24px;">${losers.join(', ')} drinks.</p>`;
  
  html += `<div style="text-align: left; max-width: 300px; width: 100%; margin: 0 auto 24px;" class="ladder-list">`;
  const sortedP = [...activePlayers].sort((a, b) => times[a.id] - times[b.id]);
  sortedP.forEach(p => {
    let tStr = times[p.id] === 9999 ? 'FALSE START' : `${times[p.id].toFixed(0)}ms`;
    let flIcon = times[p.id] === minTime && minTime !== 9999 ? ' <span style="color:var(--color-fl);">⏱️</span>' : '';
    html += `<div class="ladder-item" style="padding: 8px 16px;"><span>${p.name}</span> <span style="font-family:monospace; color:var(--color-text-muted);">${tStr}${flIcon}</span></div>`;
  });
  html += `</div><button id="end-minigame-btn" class="btn-3d btn-primary">CONTINUE</button>`;
  
  minigameArena.innerHTML = html;
  document.getElementById('end-minigame-btn').onclick = processRoundEnd;
}

function playMemoryFlash() {
  let currentPlayerIndex = 0;
  
  const turnLoop = () => {
    if (currentPlayerIndex >= activePlayers.length) {
      let html = `<h2 class="gp-heading">RESULTS</h2>`;
      html += `<p style="font-size: 1.5rem; color: var(--color-primary); margin-bottom: 24px;">Memory lap complete!</p>`;
      html += `<button id="end-minigame-btn" class="btn-3d btn-primary">CONTINUE</button>`;
      minigameArena.innerHTML = html;
      document.getElementById('end-minigame-btn').onclick = processRoundEnd;
      return;
    }
    
    const player = activePlayers[currentPlayerIndex];
    const packNames = Object.keys(window.PACKS);
    const randomPackName = packNames[Math.floor(Math.random() * packNames.length)];
    const pack = window.PACKS[randomPackName];
    
    let shuffledPack = [...pack].sort(() => 0.5 - Math.random());
    const selectedEmojis = shuffledPack.slice(0, 4);
    
    const targetEmoji = selectedEmojis[Math.floor(Math.random() * 4)];
    
    showPassScreen(player.name, 'Memorize the grid!', () => {
      minigameArena.innerHTML = `
        <h2 class="gp-heading">MEMORY FLASH</h2>
        <p class="gp-subtitle" id="mf-subtitle">Memorize...</p>
        <div id="mf-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:16px; margin:24px auto; max-width:300px;">
          ${selectedEmojis.map((e, i) => `
            <div class="mf-card" data-index="${i}" style="background:#1e293b; border-radius:16px; height:120px; display:flex; align-items:center; justify-content:center; padding: 12px; cursor: pointer; transition: background-color 0.2s;">
              <img src="${e}" style="max-width:100%; max-height:100%; object-fit:contain; transition: opacity 0.2s;" id="mf-img-${i}">
            </div>
          `).join('')}
        </div>
      `;
      
      const subtitle = document.getElementById('mf-subtitle');
      
      setTimeout(() => {
        for (let i = 0; i < 4; i++) {
          document.getElementById(`mf-img-${i}`).style.opacity = '0';
        }
        subtitle.innerHTML = `Where was <img src="${targetEmoji}" style="height:40px; vertical-align:middle; display:inline-block; margin: 0 8px; border-radius:8px;"> ?`;
        
        document.querySelectorAll('.mf-card').forEach(card => {
          card.onclick = (ev) => {
            const chosenIndex = parseInt(ev.currentTarget.getAttribute('data-index'));
            for (let i = 0; i < 4; i++) {
              document.getElementById(`mf-img-${i}`).style.opacity = '1';
            }
            
            if (selectedEmojis[chosenIndex] === targetEmoji) {
              ev.currentTarget.style.backgroundColor = '#22c55e';
              scores[player.id] += 1;
              subtitle.textContent = "Correct! +1 point.";
            } else {
              ev.currentTarget.style.backgroundColor = '#ef4444';
              addDrinks(player.id);
              const correctIndex = selectedEmojis.indexOf(targetEmoji);
              document.querySelector(`.mf-card[data-index="${correctIndex}"]`).style.backgroundColor = '#22c55e';
              subtitle.innerHTML = "<span style='color:#ef4444;'>Wrong! Drink.</span>";
            }
            
            setTimeout(() => {
              currentPlayerIndex++;
              turnLoop();
            }, 2500);
          };
        });
      }, 1500);
    });
  };
  turnLoop();
}

function playHighLowGamble() {
  let currentPlayerIndex = 0;
  
  const turnLoop = () => {
    if (currentPlayerIndex >= activePlayers.length) {
      minigameArena.innerHTML = `<h2 class="gp-heading">RESULTS</h2><p style="font-size: 1.5rem; color: var(--color-primary); margin-bottom: 24px;">Gamble lap complete!</p><button id="end-minigame-btn" class="btn-3d btn-primary">CONTINUE</button>`;
      document.getElementById('end-minigame-btn').onclick = processRoundEnd;
      return;
    }
    
    const player = activePlayers[currentPlayerIndex];
    let currentNum = Math.floor(Math.random() * 10) + 1;
    let turnBank = 0;
    
    const renderUI = () => {
      minigameArena.innerHTML = `
        <h2 class="gp-heading">HIGH-LOW GAMBLE</h2>
        <p class="gp-subtitle">Will the next number be higher or lower?</p>
        <div style="font-size: 6rem; font-weight: 900; color: white; margin: 24px 0;">${currentNum}</div>
        <p style="font-size: 1rem; color: var(--color-text-muted); margin-bottom: 16px;">Banked this turn: +${turnBank} pts</p>
        <div style="display:flex; justify-content:center; gap:16px;">
          <button class="btn-3d hl-btn" data-action="higher" style="background:#22c55e; padding: 12px 24px;">HIGHER</button>
          <button class="btn-3d hl-btn" data-action="lower" style="background:#ef4444; padding: 12px 24px;">LOWER</button>
        </div>
        <button class="btn-3d" id="cash-out-btn" style="margin-top:24px; padding: 12px 24px; background:#f59e0b;">CASH OUT</button>
      `;
      
      document.getElementById('cash-out-btn').onclick = () => {
        currentPlayerIndex++;
        turnLoop();
      };
      
      document.querySelectorAll('.hl-btn').forEach(btn => {
        btn.onclick = (e) => {
          const action = e.target.getAttribute('data-action');
          let nextNum = Math.floor(Math.random() * 10) + 1;
          while (nextNum === currentNum) nextNum = Math.floor(Math.random() * 10) + 1;
          
          let correct = false;
          if (action === 'higher' && nextNum > currentNum) correct = true;
          if (action === 'lower' && nextNum < currentNum) correct = true;
          
          if (correct) {
            scores[player.id] += 1;
            turnBank += 1;
            currentNum = nextNum;
            renderUI();
          } else {
            scores[player.id] -= 1;
            addDrinks(player.id);
            minigameArena.innerHTML = `
              <h2 class="gp-heading" style="color: #ef4444;">BUST!</h2>
              <p class="gp-subtitle">The number was ${nextNum}!</p>
              <p style="font-size: 1.5rem; color: #ef4444; margin: 24px 0;">You lose 1 point and DRINK!</p>
              <button class="btn-3d btn-primary" id="hl-next-btn">NEXT</button>
            `;
            document.getElementById('hl-next-btn').onclick = () => {
              currentPlayerIndex++;
              turnLoop();
            };
          }
        };
      });
    };
    
    showPassScreen(player.name, 'Step up to gamble!', renderUI);
  };
  turnLoop();
}

function playBubblePop() {
  let currentPlayerIndex = 0;
  let popCounts = {};
  
  const turnLoop = () => {
    if (currentPlayerIndex >= activePlayers.length) {
      revealBubblePop(popCounts);
      return;
    }
    
    const player = activePlayers[currentPlayerIndex];
    let count = 0;
    
    showPassScreen(player.name, 'Pop as many bubbles as you can!', () => {
      minigameArena.innerHTML = `
        <h2 class="gp-heading">BUBBLE POP</h2>
        <div id="bp-timer" style="font-size: 3rem; font-weight: 900; color: var(--color-primary);">10.0s</div>
        <p style="font-size: 1.2rem; margin-bottom: 16px;">Pops: <span id="bp-count">0</span></p>
        <div id="bp-area" style="position:relative; width:100%; height:350px; background:#1e293b; border-radius:16px; overflow:hidden;"></div>
      `;
      
      const timerEl = document.getElementById('bp-timer');
      const countEl = document.getElementById('bp-count');
      const area = document.getElementById('bp-area');
      
      let timeLeft = 10.0;
      
      const spawnBubble = () => {
        area.innerHTML = '';
        const btn = document.createElement('button');
        btn.className = 'btn-3d';
        btn.style.position = 'absolute';
        btn.style.width = '60px';
        btn.style.height = '60px';
        btn.style.borderRadius = '50%';
        btn.style.backgroundColor = '#3b82f6';
        btn.style.padding = '0';
        
        const maxX = area.clientWidth - 60;
        const maxY = area.clientHeight - 60;
        btn.style.left = (Math.random() * maxX) + 'px';
        btn.style.top = (Math.random() * maxY) + 'px';
        
        const handlePop = (e) => {
          if(e) e.preventDefault();
          if (timeLeft <= 0) return;
          count++;
          countEl.textContent = count;
          spawnBubble();
        };
        
        btn.addEventListener('mousedown', handlePop);
        btn.addEventListener('touchstart', handlePop, {passive:false});
        
        area.appendChild(btn);
      };
      
      setTimeout(spawnBubble, 50);
      
      const interval = setInterval(() => {
        timeLeft -= 0.1;
        if (timeLeft <= 0) {
          clearInterval(interval);
          timerEl.textContent = '0.0s';
          area.innerHTML = '';
          popCounts[player.id] = count;
          setTimeout(() => {
            currentPlayerIndex++;
            turnLoop();
          }, 1500);
        } else {
          timerEl.textContent = timeLeft.toFixed(1) + 's';
        }
      }, 100);
      
    });
  };
  turnLoop();
}

function revealBubblePop(counts) {
  let minPops = Infinity;
  let maxPops = -1;
  activePlayers.forEach(p => {
    if (counts[p.id] < minPops) minPops = counts[p.id];
    if (counts[p.id] > maxPops) maxPops = counts[p.id];
  });
  
  let winners = [];
  let losers = [];
  activePlayers.forEach(p => {
    if (counts[p.id] === maxPops) { winners.push(p.name); scores[p.id] += 1; }
    if (counts[p.id] === minPops) { 
        losers.push(p.name); 
        addDrinks(p.id);
    }
  });
  
  let html = `<h2 class="gp-heading">RESULTS</h2>`;
  html += `<p style="font-size: 1.5rem; color: var(--color-primary); margin-bottom: 8px;">${winners.join(', ')} won! (${maxPops})</p>`;
  html += `<p style="font-size: 1.2rem; color: var(--color-secondary); margin-bottom: 24px;">${losers.join(', ')} drinks. (${minPops})</p>`;
  
  html += `<div style="text-align: left; max-width: 300px; width: 100%; margin: 0 auto 24px;" class="ladder-list">`;
  const sortedP = [...activePlayers].sort((a, b) => counts[b.id] - counts[a.id]);
  sortedP.forEach(p => {
    html += `<div class="ladder-item" style="padding: 8px 16px;"><span>${p.name}</span> <span style="font-family:monospace; color:var(--color-text-muted);">${counts[p.id]} pops</span></div>`;
  });
  html += `</div><button id="end-minigame-btn" class="btn-3d btn-primary">CONTINUE</button>`;
  
  minigameArena.innerHTML = html;
  document.getElementById('end-minigame-btn').onclick = processRoundEnd;
}

function playThePour() {
  let waterLevel = 0;
  let maxLevel = 100 + Math.random() * 15; // 90 to 120 keeps it closer to the rim
  let currentPlayerIndex = 0;
  
  const turnLoop = () => {
    const player = activePlayers[currentPlayerIndex % activePlayers.length];
    
    showPassScreen(player.name, 'time to pour some water.', () => {

      // calculate the initial curve if water is already above the rim
      let initialCurve = 0;
      let initialRadius = '0 0 12px 12px';
      if (waterLevel > 100) {
        initialCurve = (waterLevel - 100) * 2; 
        initialRadius = `50% 50% 12px 12px / ${initialCurve}px ${initialCurve}px 12px 12px`;
      }

      minigameArena.innerHTML = `
        <style>
          @keyframes pourStream {
            0% { background-position: 0 0; }
            100% { background-position: 0 20px; }
          }
        </style>
        <h2 class="gp-heading">THE POUR</h2>
        <p class="gp-subtitle">hold to pour. don't overflow the glass!</p>
        
        <div style="position:relative; width: 150px; margin: 40px auto 32px auto;">
          <div id="glass-container" style="position:relative; width:100%; height:200px; border:4px solid #94a3b8; border-top:none; border-radius:0 0 16px 16px; background:rgba(255,255,255,0.1);">
            <div id="water-fill" style="position:absolute; bottom:0; left:0; width:100%; height:${waterLevel}%; background:#3b82f6; border-radius:${initialRadius}; transition: height 0.1s linear, border-radius 0.1s linear; z-index: 2;"></div>
            
            <div id="water-stream" style="position:absolute; top:-40px; bottom:${waterLevel}%; left:50%; transform:translateX(-50%); width:6px; border-radius: 3px; opacity:0; transition: opacity 0.15s, bottom 0.1s linear; background: repeating-linear-gradient(to bottom, #93c5fd, #93c5fd 10px, #3b82f6 10px, #3b82f6 20px); background-size: 100% 20px; animation: pourStream 0.3s linear infinite; z-index: 1;"></div>
            
            <div id="spill-left" style="position:absolute; top:0; left:-10px; width:6px; height:0; background:#3b82f6; border-radius:3px; transition: height 0.5s ease-in; z-index: 3;"></div>
            <div id="spill-right" style="position:absolute; top:0; right:-10px; width:6px; height:0; background:#3b82f6; border-radius:3px; transition: height 0.4s ease-in; z-index: 3;"></div>
          </div>
        </div>

        <button id="pour-btn" class="btn-3d btn-primary" style="user-select:none; -webkit-user-select:none; width: 250px;">HOLD TO POUR</button>
      `;
      
      const waterEl = document.getElementById('water-fill');
      const streamEl = document.getElementById('water-stream');
      const pourBtn = document.getElementById('pour-btn');
      const glass = document.getElementById('glass-container');
      
      let pourInterval = null;
      let hasPoured = false;
      let shattered = false;
      
      const startPour = (e) => {
        if(e) e.preventDefault();
        if (shattered || hasPoured) return; // one pour limit
        
        pourBtn.style.transform = 'scale(0.95)';
        streamEl.style.opacity = '1';
        
        pourInterval = setInterval(() => {
          waterLevel += 0.5;
          waterEl.style.height = `${waterLevel}%`;
          streamEl.style.bottom = `${waterLevel}%`; // Stream perfectly tracks the surface
          
          if (waterLevel > 100) {
             const curve = (waterLevel - 100) * 2; 
             waterEl.style.borderRadius = `50% 50% 12px 12px / ${curve}px ${curve}px 12px 12px`;
          }
          
          if (waterLevel >= maxLevel) {
            shattered = true;
            stopPour();
            pourBtn.style.display = 'none';
            waterLevel = 100
            
            // Trigger spill animation
            document.getElementById('spill-left').style.height = '140%';
            document.getElementById('spill-right').style.height = '110%';
            
            // Wait for spill to run down before exploding
            setTimeout(() => {
              glass.style.border = 'none';
              glass.style.background = 'transparent';
              waterEl.style.background = 'transparent';
              document.getElementById('spill-left').style.background = 'transparent';
              document.getElementById('spill-right').style.background = 'transparent';
              
              minigameArena.innerHTML += `
                <div style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; z-index:20;">
                   <h2 style="font-size:5rem; font-weight:900; color:#ef4444; text-shadow: 0 4px 10px rgba(0,0,0,0.5); transform: scale(1.5);">SPLASH!</h2>
                </div>
              `;
              
              setTimeout(() => revealThePour(player), 2000);
            }, 600);
          }
        }, 50);
      };
      
      const stopPour = (e) => {
        if(e && e.type !== 'touchend' && e.type !== 'mouseup') e.preventDefault();
        pourBtn.style.transform = 'scale(1)';
        streamEl.style.opacity = '0';
        
        if (pourInterval) clearInterval(pourInterval);
        pourInterval = null;
        
        if (!shattered && waterLevel > 0 && !hasPoured) {
          hasPoured = true;
          pourBtn.style.display = 'none';
          
          // Auto-pass to the next player after a brief pause
          setTimeout(() => {
            currentPlayerIndex++;
            turnLoop();
          }, 800);
        }
      };
      
      pourBtn.addEventListener('mousedown', startPour);
      document.addEventListener('mouseup', stopPour); 
      pourBtn.addEventListener('touchstart', startPour, {passive:false});
      document.addEventListener('touchend', stopPour);
    });
  };
  turnLoop();
}

function revealThePour(loser) {
  let survivors = activePlayers.filter(p => p.id !== loser.id);
  survivors.forEach(p => scores[p.id] += 1);
  
  let html = `<h2 class="gp-heading">RESULTS</h2>`;
  if (loser) {
    addDrinks(loser.id);
    html += `<p style="font-size: 1.5rem; color: #ef4444; margin-bottom: 24px;">The glass overflowed on ${loser.name}'s turn! Drink!</p>`;
  }
  html += `<p style="color: var(--color-primary); margin-bottom: 24px;">Survivors (+1 pt): ${survivors.map(p=>p.name).join(', ')}</p>`;
  html += `<button id="end-minigame-btn" class="btn-3d btn-primary">CONTINUE</button>`;
  
  minigameArena.innerHTML = html;
  document.getElementById('end-minigame-btn').onclick = processRoundEnd;
}

function playThePointingGame() {
  let currentPlayerIndex = 0;
  let votes = {};
  activePlayers.forEach(p => votes[p.id] = 0);
  
  const turnLoop = () => {
    if (currentPlayerIndex >= activePlayers.length) {
      revealPointingGame(votes);
      return;
    }
    
    const player = activePlayers[currentPlayerIndex];
    showPassScreen(player.name, 'Time to point a finger.', () => {
      let html = `
        <h2 class="gp-heading">THE POINTING GAME</h2>
        <p class="gp-subtitle">Secretly pick someone to point at.</p>
        <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:16px; margin: 32px 0; max-width: 300px; margin-left: auto; margin-right: auto;">
      `;
      
      activePlayers.forEach(p => {
        if (p.id !== player.id) {
           let emojiHtml = p.emoji.endsWith('.png') || p.emoji.endsWith('.gif') 
             ? `<img src="${p.emoji}" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;">` 
             : p.emoji;
             
           html += `
             <div class="pg-target avatar" data-id="${p.id}" style="width:70px; height:70px; font-size:2.5rem; display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="">
               ${emojiHtml}
             </div>
           `;
        }
      });
      
      html += `</div>`;
      minigameArena.innerHTML = html;
      
      document.querySelectorAll('.pg-target').forEach(btn => {
        btn.onclick = (e) => {
          const targetId = e.currentTarget.getAttribute('data-id');
          votes[targetId]++;
          currentPlayerIndex++;
          turnLoop();
        };
      });
    });
  };
  turnLoop();
}

function revealPointingGame(votes) {
  let maxVotes = -1;
  let minVotes = Infinity;
  for (let id in votes) {
    if (votes[id] > maxVotes) maxVotes = votes[id];
    if (votes[id] < minVotes) minVotes = votes[id];
  }
  
  let losers = [];
  let stealthers = [];
  activePlayers.forEach(p => {
    const c = votes[p.id] || 0;
    if (c === maxVotes && maxVotes > 0) {
      losers.push(p.name);
      addDrinks(p.id);
    }
    if (c === 0 && maxVotes > 0) {
      stealthers.push(p.name);
      scores[p.id] += 1;
    }
  });
  
  let html = `<h2 class="gp-heading">RESULTS</h2>`;
  if (losers.length > 0) {
    html += `<p style="font-size: 1.5rem; color: #ef4444; margin-bottom: 8px;">${losers.join(', ')} got the most fingers (${maxVotes})! DRINK!</p>`;
  }
  if (stealthers.length > 0) {
    html += `<p style="font-size: 1.2rem; color: var(--color-primary); margin-bottom: 24px;">Stealthy (+1 pt): ${stealthers.join(', ')} (${minVotes} votes)</p>`;
  }
  
  html += `<div style="text-align: left; max-width: 300px; width: 100%; margin: 0 auto 24px;" class="ladder-list">`;
  const sortedP = [...activePlayers].sort((a, b) => votes[b.id] - votes[a.id]);
  sortedP.forEach(p => {
    html += `<div class="ladder-item" style="padding: 8px 16px;"><span>${p.name}</span> <span style="font-family:monospace; color:var(--color-text-muted);">${votes[p.id]} points at</span></div>`;
  });
  html += `</div><button id="end-minigame-btn" class="btn-3d btn-primary">CONTINUE</button>`;
  
  minigameArena.innerHTML = html;
  document.getElementById('end-minigame-btn').onclick = processRoundEnd;
}

// --- MINIGAME LOGIC: TEAM --- //

function playTickingBomb() {
  const { teamA, teamB } = generateBalancedTeams();
  let holdTeam = teamA;
  let nextTeam = teamB;
  
  let explosionTimeLeft = (activePlayers.length * 5) + (Math.random() * 10);
  let timerInterval = null;
  
  const showTurn = () => {
    let teamNames = holdTeam.map(p => p.name).join(' & ');
    showPassScreen(teamNames, 'Defuse and pass the bomb!', () => {
      minigameArena.innerHTML = `
        <style>
          @keyframes fusePulse {
            0% { transform: scale(1); filter: brightness(1); }
            100% { transform: scale(1.4); filter: brightness(1.7); }
          }
        </style>
        <h2 class="gp-heading" style="color: #ef4444;">TICKING BOMB</h2>
        <p class="gp-subtitle">pass it fast—the fuse is burning!</p>
        <div style="font-size: 4rem; margin-top: -10px; margin-bottom: 20px;">
          <span id="fuse-icon" style="display:inline-block; animation: fusePulse 1s infinite alternate;">🧨</span>
        </div>
        <div style="position: relative; width: 100%; height: 300px;" id="bomb-area">
          <button id="bomb-btn" style="position: absolute; width: 80px; height: 80px; border-radius: 50%; font-size: 2rem; background: #1e293b; border: 4px solid #ef4444;">💣</button>
        </div>
        <p id="taps-left" style="font-size: 1.5rem; font-weight: 900; margin-top: 24px;">10 TAPS LEFT</p>
      `;
      
      let taps = 10;
      const bombBtn = document.getElementById('bomb-btn');
      const tapsLeftEl = document.getElementById('taps-left');
      const area = document.getElementById('bomb-area');
      
      const moveBomb = () => {
        const maxX = area.clientWidth - 80;
        const maxY = area.clientHeight - 80;
        bombBtn.style.left = Math.random() * maxX + 'px';
        bombBtn.style.top = Math.random() * maxY + 'px';
      };
      
      // Delay first movement to ensure rendering is complete
      setTimeout(moveBomb, 10);
      
      timerInterval = setInterval(() => {
        explosionTimeLeft -= 0.1;
        const fuseBtn = document.getElementById('fuse-icon');
        if (fuseBtn) {
           const speed = Math.max(0.05, (explosionTimeLeft / 15));
           fuseBtn.style.animationDuration = speed + 's';
        }
        
        if (explosionTimeLeft <= 0) {
          clearInterval(timerInterval);
          explodeBomb(holdTeam, nextTeam);
        }
      }, 100);
      
      bombBtn.addEventListener('mousedown', handleTap);
      bombBtn.addEventListener('touchstart', (e) => { e.preventDefault(); handleTap(); }, {passive: false});
      
      function handleTap() {
        if (explosionTimeLeft <= 0) return;
        taps--;
        tapsLeftEl.textContent = `${taps} TAPS LEFT`;
        if (taps <= 0) {
          clearInterval(timerInterval);
          let temp = holdTeam;
          holdTeam = nextTeam;
          nextTeam = temp;
          showTurn();
        } else {
          moveBomb();
        }
      }
    });
  };
  
  showTurn();
}

function explodeBomb(losers, winners) {
  losers.forEach(p => addDrinks(p.id));
  minigameArena.innerHTML = `
    <h2 class="gp-heading" style="color: #ef4444; font-size: 4rem;">BOOM!</h2>
    <p style="font-size: 1.5rem; color: #ef4444; margin-bottom: 24px;">${losers.map(p=>p.name).join(' & ')} blew up! Drink!</p>
    <p style="color: var(--color-primary); margin-bottom: 32px;">${winners.map(p=>p.name).join(' & ')} survived! (+1 pt)</p>
    <button id="end-minigame-btn" class="btn-3d btn-primary">CONTINUE</button>
  `;
  
  winners.forEach(p => scores[p.id] += 1);
  document.getElementById('end-minigame-btn').onclick = processRoundEnd;
}

function playSyncMash() {
  const { teamA, teamB } = generateBalancedTeams();
  let tapsA = 0;
  let tapsB = 0;
  
  const playTeam = (team, onComplete) => {
    let teamNames = team.map(p => p.name).join(' & ');
    showPassScreen(teamNames, 'Mash the button for 5 seconds!', () => {
      minigameArena.innerHTML = `
        <h2 class="gp-heading">SYNC MASH</h2>
        <p class="gp-subtitle">Mash as fast as you can. Team effort!</p>
        <div id="mash-timer" style="font-size: 4rem; font-weight: 900; margin: 24px 0; color: var(--color-primary);">5.0s</div>
        <button id="mash-btn" class="btn-3d" style="width: 200px; height: 200px; border-radius: 50%; font-size: 4rem; background: var(--color-secondary);">MASH</button>
      `;
      
      let taps = 0;
      let timeLeft = 5.0;
      const mashBtn = document.getElementById('mash-btn');
      const timerEl = document.getElementById('mash-timer');
      
      const handleTap = (e) => {
        if (e) e.preventDefault();
        taps++;
      };
      
      mashBtn.addEventListener('touchstart', handleTap, {passive: false});
      mashBtn.addEventListener('mousedown', handleTap);
      
      const interval = setInterval(() => {
        timeLeft -= 0.1;
        if (timeLeft <= 0) {
          clearInterval(interval);
          timerEl.textContent = '0.0s';
          mashBtn.style.pointerEvents = 'none';
          mashBtn.style.opacity = '0.5';
          setTimeout(() => onComplete(taps), 1000);
        } else {
          timerEl.textContent = timeLeft.toFixed(1) + 's';
        }
      }, 100);
    });
  };
  
  playTeam(teamA, (taps) => {
    tapsA = taps;
    playTeam(teamB, (taps) => {
      tapsB = taps;
      
      let winners = [];
      let losers = [];
      let winTaps = 0;
      let loseTaps = 0;
      let tie = false;
      
      if (tapsA > tapsB) { winners = teamA; losers = teamB; winTaps = tapsA; loseTaps = tapsB; }
      else if (tapsB > tapsA) { winners = teamB; losers = teamA; winTaps = tapsB; loseTaps = tapsA; }
      else { tie = true; }
      
      let html = `<h2 class="gp-heading">RESULTS</h2>`;
      if (tie) {
        html += `<p style="font-size: 1.5rem; color: var(--color-text-muted); margin-bottom: 24px;">It's a TIE! (${tapsA} taps) No points.</p>`;
      } else {
        winners.forEach(p => scores[p.id] += 1);
        losers.forEach(p => addDrinks(p.id));
        html += `<p style="font-size: 1.5rem; color: var(--color-primary); margin-bottom: 8px;">${winners.map(p=>p.name).join(' & ')} win! (${winTaps} taps)</p>`;
        html += `<p style="font-size: 1.2rem; color: var(--color-secondary); margin-bottom: 24px;">${losers.map(p=>p.name).join(' & ')} drink! (${loseTaps} taps)</p>`;
      }
      
      html += `<button id="end-minigame-btn" class="btn-3d btn-primary">CONTINUE</button>`;
      minigameArena.innerHTML = html;
      document.getElementById('end-minigame-btn').onclick = processRoundEnd;
    });
  });
}

function playSharedPulse() {
  const { teamA, teamB } = generateBalancedTeams();
  let results = [];
  
  const processTeam = (team, onTeamDone) => {
    if (team.length < 2) {
      results.push({ team, win: true });
      onTeamDone();
      return;
    }
    
    let maestro = team[0];
    let follower = team[1];
    let deltas = [];
    
    showPassScreen(maestro.name, 'You are the rhythm creator.', () => {
      let lastTap = 0;
      let tapCount = 0;
      
      minigameArena.innerHTML = `
        <h2 class="gp-heading">CREATE RHYTHM</h2>
        <p class="gp-subtitle">Tap 5 times to create a beat.</p>
        <button id="pulse-btn" class="btn-3d" style="width:200px; height:200px; border-radius:50%; font-size:4rem;">🥁</button>
      `;
      
      const btn = document.getElementById('pulse-btn');
      const handleTap = (e) => {
        if (e) e.preventDefault();
        const now = performance.now();
        if (tapCount > 0) {
          deltas.push(now - lastTap);
        }
        lastTap = now;
        tapCount++;
        btn.style.transform = 'scale(0.9)';
        setTimeout(() => btn.style.transform = 'scale(1)', 50);
        
        if (tapCount >= 5) {
          btn.removeEventListener('mousedown', handleTap);
          btn.removeEventListener('touchstart', handleTap);
          
          setTimeout(() => {
            showPassScreen(follower.name, 'Mimic the rhythm EXACTLY.', () => {
              let fLastTap = 0;
              let fTapCount = 0;
              let fDeltas = [];
              
              minigameArena.innerHTML = `
                <h2 class="gp-heading">MIMIC RHYTHM</h2>
                <p class="gp-subtitle">Tap 5 times. Match the timing!</p>
                <button id="f-pulse-btn" class="btn-3d" style="width:200px; height:200px; border-radius:50%; font-size:4rem;">🥁</button>
              `;
              
              const fBtn = document.getElementById('f-pulse-btn');
              const fHandleTap = (ev) => {
                if (ev) ev.preventDefault();
                const fNow = performance.now();
                if (fTapCount > 0) {
                  fDeltas.push(fNow - fLastTap);
                }
                fLastTap = fNow;
                fTapCount++;
                fBtn.style.transform = 'scale(0.9)';
                setTimeout(() => fBtn.style.transform = 'scale(1)', 50);
                
                if (fTapCount >= 5) {
                  fBtn.removeEventListener('mousedown', fHandleTap);
                  fBtn.removeEventListener('touchstart', fHandleTap);
                  
                  let totalDiff = 0;
                  for (let i = 0; i < 4; i++) {
                    totalDiff += Math.abs(deltas[i] - fDeltas[i]);
                  }
                  
                  const win = totalDiff < 1200; // 1.2s total forgiveness over 4 gaps
                  results.push({ team, win });
                  
                  setTimeout(() => {
                    onTeamDone();
                  }, 500);
                }
              };
              fBtn.addEventListener('mousedown', fHandleTap);
              fBtn.addEventListener('touchstart', fHandleTap, {passive:false});
            });
          }, 1000);
        }
      };
      btn.addEventListener('mousedown', handleTap);
      btn.addEventListener('touchstart', handleTap, {passive:false});
    });
  };
  
  processTeam(teamA, () => {
    processTeam(teamB, () => {
      revealSharedPulse(results);
    });
  });
}

function revealSharedPulse(results) {
  minigameArena.innerHTML = `<h2 class="gp-heading">RESULTS</h2><div id="results-container" style="width:100%; display:flex; flex-direction:column; gap:16px;"></div><button id="end-minigame-btn" class="btn-3d btn-primary" style="margin-top:24px;">CONTINUE</button>`;
  
  const container = document.getElementById('results-container');
  results.forEach(res => {
    const names = res.team.map(p => p.name).join(' & ');
    if (res.win) {
      container.innerHTML += `<div class="ladder-item"><span style="font-weight:700;">${names}</span><span style="color:var(--color-primary); font-weight:900;">SYNC'D (+1)</span></div>`;
      res.team.forEach(p => scores[p.id] += 1);
    } else {
      res.team.forEach(p => addDrinks(p.id));
      container.innerHTML += `<div class="ladder-item"><span style="font-weight:700;">${names}</span><span style="color:#ef4444; font-weight:900;">FAILED (DRINK)</span></div>`;
    }
  });
  
  document.getElementById('end-minigame-btn').onclick = processRoundEnd;
}

function showPodium() {
  document.getElementById('ladder-standings').style.display = 'none';
  minigameArena.style.display = 'none';
  podiumReveal.style.display = 'flex';
  
  const sortedP = [...activePlayers].sort((a, b) => scores[b.id] - scores[a.id]);
  
  if (!window.gpRecorded) {
    if (window.Storage && window.Storage.recordGPMatch) {
      window.Storage.recordGPMatch(sortedP, scores, totalDrinks);
    }
    window.gpRecorded = true;
  }
  
  const podiumContainer = document.getElementById('podium-container');
  const losersContainer = document.getElementById('podium-losers');
  
  podiumContainer.innerHTML = '';
  losersContainer.innerHTML = '';
  
  const top3 = sortedP.slice(0, 3);
  const rest = sortedP.slice(3);
  
  const positions = [
    { rank: 2, p: top3[1], class: 'second' },
    { rank: 1, p: top3[0], class: 'first' },
    { rank: 3, p: top3[2], class: 'third' }
  ];
  
  positions.forEach(pos => {
    if (pos.p) {
      const block = document.createElement('div');
      block.className = `podium-block ${pos.class}`;
      let emojiHtml = pos.p.emoji.endsWith('.png') || pos.p.emoji.endsWith('.gif') 
        ? `<img src="${pos.p.emoji}" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;">` 
        : pos.p.emoji;
      
      block.innerHTML = `
        <div class="podium-avatar avatar" style="width: 70px; height: 70px; font-size: 2.5rem; display:flex; align-items:center; justify-content:center; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
          ${emojiHtml}
        </div>
        <div>#${pos.rank}</div>
        <div style="font-size: 1rem; color: var(--color-text-muted); margin-top: 4px;">${scores[pos.p.id]} pts</div>
      `;
      podiumContainer.appendChild(block);
    }
  });
  
  if (rest.length > 0) {
    losersContainer.className = 'podium-losers gravel-trap';
    rest.forEach((p, index) => {
      const loser = document.createElement('div');
      loser.className = 'podium-loser';
      let emojiHtml = p.emoji.endsWith('.png') || p.emoji.endsWith('.gif') 
          ? `<img src="${p.emoji}" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;">` 
          : p.emoji;
      loser.innerHTML = `
        <div class="avatar" style="width: 50px; height: 50px; font-size: 1.5rem; display:flex; align-items:center; justify-content:center; border-color: #334155;">
          ${emojiHtml}
        </div>
        <div style="font-size: 0.9rem; font-weight: 900; color: #fff; background: #000; padding: 2px 8px; border-radius: 4px; margin-top: 4px;">P${index + 4} DNF</div>
        <div style="font-size: 0.8rem; font-weight: 700; color: #ccc;">${scores[p.id]} pts</div>
      `;
      losersContainer.appendChild(loser);
    });
  }
  
  // Champagne explosion!
  setTimeout(() => {
    for (let i = 0; i < 30; i++) {
        let f = document.createElement('div');
        f.textContent = Math.random() > 0.5 ? '🍾' : '💦';
        f.style.position = 'absolute';
        f.style.left = 40 + Math.random() * 20 + '%';
        f.style.top = '150px';
        f.style.zIndex = '100';
        f.style.fontSize = (1.5 + Math.random() * 2) + 'rem';
        f.style.pointerEvents = 'none';
        f.style.transition = 'transform 1s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 1.2s ease-out';
        f.style.transform = `translate(0, 0) scale(0)`;
        podiumReveal.appendChild(f);
        requestAnimationFrame(() => {
           f.style.transform = `translate(${(Math.random()-0.5)*300}px, -${100 + Math.random()*200}px) scale(1.5) rotate(${(Math.random()-0.5)*90}deg)`;
           f.style.opacity = '0';
        });
        setTimeout(() => f.remove(), 1500);
    }
  }, 800);
  
  document.getElementById('gp-replay-btn').onclick = () => {
    currentRound = 1;
    fastestLapId = null;
    activePlayers.forEach(p => { scores[p.id] = 0; lastScores[p.id] = 0; });
    generateQueue();
    podiumReveal.style.display = 'none';
    showStartingGrid();
  };
  
  document.getElementById('gp-lobby-btn').onclick = () => {
    window.location.href = 'index.html';
  };
}

function showPassScreen(playerName, nextActionText, callback) {
  passPlayerName.textContent = playerName;
  passActionText.textContent = nextActionText;
  
  turnPassScreen.classList.add('is-visible');
  
  passReadyBtn.onclick = () => {
    turnPassScreen.classList.remove('is-visible');
    if (callback) callback();
  };
}

// --- History & Stats Rendering ---
function renderGPHistory() {
  const container = document.getElementById('gp-history-container');
  if (!container) return;
  if (!window.Storage || !window.Storage.getGPStats) {
    container.innerHTML = ''; return;
  }
  
  const stats = window.Storage.getGPStats();
  const allPlayers = window.Storage.getPlayers();
  
  let historyPlayers = [];
  for (let pid in stats) {
    let p = allPlayers.find(pl => pl.id === pid);
    if (p && p.isActive) {
      historyPlayers.push({ ...p, ...stats[pid] });
    }
  }
  
  if (historyPlayers.length === 0) {
    container.innerHTML = `<p style="color:var(--color-text-muted); font-size:0.9rem;">No career stats yet. Race to secure your legacy!</p>`;
    return;
  }
  
  historyPlayers.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.podiums !== a.podiums) return b.podiums - a.podiums;
    return b.points - a.points;
  });
  
  const top3 = historyPlayers.slice(0, 3);
  const rest = historyPlayers; // Display ALL players
  
  let html = `<div style="text-align:center; margin-bottom: 32px;">
    <h2 style="font-size: 1rem; color:#a855f7; letter-spacing: 2px;">HALL OF FAME</h2>
  </div>`;
  
  html += `<div class="podium-container" style="margin-bottom:24px;">`;
  
  const positions = [
    { rank: 2, p: top3[1], class: 'second' },
    { rank: 1, p: top3[0], class: 'first' },
    { rank: 3, p: top3[2], class: 'third' }
  ];
  
  positions.forEach(pos => {
    if (pos.p) {
      let emojiHtml = pos.p.emoji.endsWith('.png') || pos.p.emoji.endsWith('.gif') 
        ? `<img src="${pos.p.emoji}" style="width:100%; height:100%; object-fit:cover; border-radius:inherit;">` 
        : pos.p.emoji;
        
      html += `
        <div class="podium-block ${pos.class}">
          <div class="podium-avatar avatar" style="width: 70px; height: 70px; font-size: 2.5rem; display:flex; align-items:center; justify-content:center; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
            ${emojiHtml}
          </div>
          <div>#${pos.rank}</div>
          <div style="font-size: 0.9rem; color: var(--color-text-muted); margin-top: 4px;">${pos.p.name}</div>
        </div>
      `;
    }
  });
  html += `</div>`;
  
  if (rest.length > 0) {
    html += `<div class="ladder-list" style="max-height: 200px; overflow-y:auto; padding-right:8px; margin-bottom: 24px; text-align:left;">`;
    rest.forEach(p => {
      let emojiHtml = p.emoji.endsWith('.png') || p.emoji.endsWith('.gif') 
        ? `<img src="${p.emoji}" style="width:32px; height:32px; object-fit:cover; border-radius:8px;">` 
        : `<span style="font-size:1.5rem;">${p.emoji}</span>`;
        
      html += `
        <div class="ladder-item" style="padding:12px; font-size:0.9rem;">
          <div style="display:flex; align-items:center; gap:12px;">
             ${emojiHtml}
             <div style="display:flex; flex-direction:column; align-items:flex-start;">
               <span style="font-weight:700;">${p.name}</span>
               <span style="font-size:0.7rem; color:var(--color-text-muted);">${p.races} Races</span>
             </div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:flex-end;">
            <span style="color:var(--color-primary); font-weight:700;">${p.points} pts</span>
            <span style="font-size:0.7rem; color:var(--color-secondary);">${p.wins} Wins | ${p.podiums} Pods</span>
          </div>
        </div>
      `;
    });
    html += `</div>`;
  }
  
  container.innerHTML = html;
}

window.addEventListener('DOMContentLoaded', init);
