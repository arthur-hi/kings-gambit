class EventManager {
  constructor() {
    this.turnsSinceTides = 0;
    this.turnsSincePlank = 0;
    this.turnsSinceTreasure = 0;
    
    // Tides: max 15%, slope 1.5% per turn
    this.tidesMaxP = 0.15;
    this.tidesSlope = 0.015;
    this.tidesGrace = 4;

    // Plank: max 10%, slope 0.5% per turn
    this.plankMaxP = 0.10;
    this.plankSlope = 0.005;
    this.plankGrace = 8;
    
    // Treasure: max 5%, slope 0.5% per turn
    this.treasureMaxP = 0.05;
    this.treasureSlope = 0.005;
    this.treasureGrace = 16;
  }

  evaluate(player) {
    this.turnsSinceTides++;
    this.turnsSincePlank++;
    this.turnsSinceTreasure++;

    // Use settings from localStorage
    let settings = {};
    try {
      const data = localStorage.getItem('kings-gambit-settings');
      if (data) settings = JSON.parse(data);
    } catch (e) {}

    const tidesEnabled = settings.mutinyTidesEnabled !== false;
    const plankEnabled = settings.mutinyPlankEnabled !== false;

    // Adjust parameters based on settings sliders (if present)
    const tidesFreq = settings.mutinyTidesFreq || 1; // 0.5, 1, 1.5
    const plankFreq = settings.mutinyPlankFreq || 1;
    
    // Check Treasure (Treasure is always enabled)
    let treasureChance = 0;
    if (this.turnsSinceTreasure > this.treasureGrace) {
      treasureChance = Math.min(this.treasureMaxP, (this.turnsSinceTreasure - this.treasureGrace) * this.treasureSlope);
    }
    if (Math.random() < treasureChance) {
      this.turnsSinceTreasure = 0;
      return 'TREASURE';
    }

    // Check Plank
    if (plankEnabled) {
      let plankChance = 0;
      if (this.turnsSincePlank > this.plankGrace) {
        plankChance = Math.min(this.plankMaxP * plankFreq, (this.turnsSincePlank - this.plankGrace) * (this.plankSlope * plankFreq));
      }
      
      // Secret weighting
      if (player && player.is_planked) {
        plankChance *= 4; 
      }

      if (Math.random() < plankChance) {
        this.turnsSincePlank = 0;
        return 'PLANK';
      }
    }

    // Check Tides
    if (tidesEnabled) {
      let tidesChance = 0;
      if (this.turnsSinceTides > this.tidesGrace) {
        tidesChance = Math.min(this.tidesMaxP * tidesFreq, (this.turnsSinceTides - this.tidesGrace) * (this.tidesSlope * tidesFreq));
      }

      if (Math.random() < tidesChance) {
        this.turnsSinceTides = 0;
        return 'TIDES';
      }
    }

    return null;
  }
}

window.MutinyEvents = new EventManager();
