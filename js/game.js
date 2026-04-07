const rosterPreview = document.getElementById('roster-preview');
const drinkBtn = document.getElementById('drink-btn');
const resultDisplay = document.getElementById('result-display');

let activePlayers = [];

function init() {
  activePlayers = window.Storage.getActivePlayers();
  
  // Guard check
  if (activePlayers.length < 2) {
    alert("You need at least 2 players!");
    window.location.href = 'index.html';
    return;
  }

  // Populate emoji string
  const emojis = activePlayers.map(p => {
    if (p.emoji.endsWith('.png') || p.emoji.endsWith('.gif')) {
       return `<img src="${p.emoji}" style="width:2em;height:2em;display:inline-block;object-fit:cover;border-radius:var(--radius-md);vertical-align:middle;" draggable="false">`;
    }
    return p.emoji;
  }).join(' ');
  rosterPreview.innerHTML = emojis;

  drinkBtn.addEventListener('click', handleWhoDrinks);
}

function handleWhoDrinks() {
  // Hide result temporarily if already shown to re-trigger pop animation
  resultDisplay.classList.remove('is-visible');
  
  // Let the DOM update before re-adding class
  setTimeout(() => {
    // Pick random target
    const randomIndex = Math.floor(Math.random() * activePlayers.length);
    const target = activePlayers[randomIndex];

    // Show result
    const emojiDisplay = target.emoji.endsWith('.png') || target.emoji.endsWith('.gif') 
       ? `<img src="${target.emoji}" style="width:2em;height:2em;display:inline-block;object-fit:cover;border-radius:var(--radius-md);vertical-align:middle;" draggable="false">`
       : target.emoji;
       
    resultDisplay.innerHTML = `${emojiDisplay}<br>${target.name} drinks!`;
    resultDisplay.classList.add('is-visible');
    
    // Optional: visual feedback on the button to make it "pop"
    drinkBtn.textContent = 'AGAIN?';
    drinkBtn.classList.add('secondary');
  }, 10);
}

// Run init
init();
