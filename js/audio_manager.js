/**
 * audioManager — centralised sound system for Kings Gambit.
 *
 * API:
 *   window.audioManager.unlock()             — call on first user interaction
 *   window.audioManager.play(game, event)    — fire a one-shot sound
 *   window.audioManager.startAmbience(game)  — start a looping background track
 *   window.audioManager.stopAmbience()       — stop the current background track
 */
(function () {

  // ─── Sound registry ───────────────────────────────────────────────────────
  const SOUND_MAP = {
    mutiny: {
      ambience:   'mutiny/resources/ambience.mp3',
      coin_spin:  ['mutiny/resources/coin_1.mp3',       'mutiny/resources/coin_2.mp3',       'mutiny/resources/coin_3.mp3'],
      coin_event: ['mutiny/resources/coin_event_1.mp3', 'mutiny/resources/coin_event_2.mp3'],
      treasure:   'mutiny/resources/coin_event_treasure.mp3',
      plank:      ['mutiny/resources/plank_1.mp3',      'mutiny/resources/plank_2.mp3',      'mutiny/resources/plank_3.mp3'],
      wind:       ['mutiny/resources/wind_1.mp3',       'mutiny/resources/wind_2.mp3'],
      card:      ['mutiny/resources/card_1.mp3',      'mutiny/resources/card_2.mp3',      'mutiny/resources/card_3.mp3'],
      pass:       ['mutiny/resources/pass_1.mp3',       'mutiny/resources/pass_2.mp3'],
    }
  };

  // ─── Internal state ───────────────────────────────────────────────────────
  let _unlocked  = false;
  let _ambienceEl = null;          // current looping <Audio> node
  let _muted     = false;

  // Preloaded Audio nodes, keyed by path. Created lazily.
  const _cache = {};

  function _getOrCreate(path) {
    if (!_cache[path]) {
      const audio = new Audio(path);
      audio.preload = 'auto';
      _cache[path] = audio;
    }
    return _cache[path];
  }

  // Pick a random entry if the value is an array
  function _resolve(gameKey, eventKey) {
    const game = SOUND_MAP[gameKey];
    if (!game) return null;
    const entry = game[eventKey];
    if (!entry) return null;
    if (Array.isArray(entry)) {
      return entry[Math.floor(Math.random() * entry.length)];
    }
    return entry;
  }

  // ─── iOS / Android unlock ─────────────────────────────────────────────────
  // Mobile browsers block Audio until a real user gesture. Call unlock() on
  // the first meaningful tap (e.g. the Set Sail button) to silently unblock
  // the audio context for the rest of the session.
  function unlock() {
    if (_unlocked) return;
    _unlocked = true;

    // play a 1ms silent wav to unlock mobile audio
    const silent = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
    silent.play().catch(() => {});
  }

  // ─── One-shot play ────────────────────────────────────────────────────────
  // Creates a fresh clone each call so overlapping plays never cut each other
  // off (important for rapid coin spins or overlapping effects).
  function play(game, event) {
    if (_muted) return;
    const path = _resolve(game, event);
    if (!path) return;

    // Clone the preloaded node so we can play overlapping instances
    const base  = _getOrCreate(path);
    const clone = base.cloneNode();
    clone.volume = 1;
    clone.play().catch(() => {
      // Auto-play may still be blocked; attempt unlock and retry once
      if (!_unlocked) {
        unlock();
        clone.play().catch(() => {});
      }
    });
  }

  // ─── Ambience (looping background) ────────────────────────────────────────
  function startAmbience(game, event = 'ambience') {
    stopAmbience();
    if (_muted) return;
    const path = _resolve(game, event);
    if (!path) return;

    _ambienceEl = new Audio(path);
    _ambienceEl.loop   = true;
    _ambienceEl.volume = 0.35;
    _ambienceEl.play().catch(() => {});
  }

  function stopAmbience() {
    if (_ambienceEl) {
      _ambienceEl.pause();
      _ambienceEl.currentTime = 0;
      _ambienceEl = null;
    }
  }

  // ─── Mute toggle (for future settings UI) ─────────────────────────────────
  function setMuted(val) {
    _muted = !!val;
    if (_muted) stopAmbience();
  }

  function isMuted() { return _muted; }

  // ─── Expose ───────────────────────────────────────────────────────────────
  window.audioManager = { unlock, play, startAmbience, stopAmbience, setMuted, isMuted };

})();
