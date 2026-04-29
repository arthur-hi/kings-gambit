class GifRendererEngine {
  constructor() {
    this.decoders = new Map();
    this.animationFrames = new Map();
    
    this.fallbackCache = new Map();
    this.activeStates = new Map();
    this.srcRefCount = new Map();
    
    this.pending = new Map();
    this.decodeQueue = [];
    this.isDecoding = false;
    
    this.sharedPatchCanvas = document.createElement('canvas');
    this.sharedPatchCtx = this.sharedPatchCanvas.getContext('2d', { willReadFrequently: true });
    
    this.tick = this.tick.bind(this);
    requestAnimationFrame(this.tick);
    
    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
      rootMargin: '100px'
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      const canvas = entry.target;
      if (entry.isIntersecting) {
        if (!document.body.contains(canvas)) {
          this.observer.unobserve(canvas);
          return;
        }
        
        let state = this.activeStates.get(canvas);
        if (state) {
          clearTimeout(state.offScreenTimeout);
          state.isPlaying = true;
          
          if (!state.frames && !state.isDecoding) {
            this.requeueDecode(canvas, state.src);
          }
        } else {
          const src = canvas.dataset.gifSrc;
          const mode = canvas.dataset.gifMode;
          if (src) {
            this.renderFallback(canvas, src, mode);
            this.requeueDecode(canvas, src);
          }
        }
      } else {
        let state = this.activeStates.get(canvas);
        if (state) {
          state.isPlaying = false;
          state.offScreenTimeout = setTimeout(() => {
            this.purgeCanvas(canvas);
          }, 5000);
        }
      }
    });
  }

  incrementSrcRef(src) {
    const current = this.srcRefCount.get(src) || 0;
    this.srcRefCount.set(src, current + 1);
  }

  decrementSrcRef(src) {
    let current = this.srcRefCount.get(src) || 0;
    if (current > 0) {
      current--;
      this.srcRefCount.set(src, current);
      
      if (current === 0) {
        let frames = this.fallbackCache.get(src);
        if (frames) {
          for (let i = 0; i < frames.length; i++) {
            frames[i].patch = null;
          }
        }
        this.fallbackCache.delete(src);
      }
    }
  }

  purgeCanvas(canvas) {
    const state = this.activeStates.get(canvas);
    if (!state) return;
    
    clearTimeout(state.offScreenTimeout);
    
    if (state.backingCanvas) {
      state.backingCanvas.width = 1;
      state.backingCanvas.height = 1;
    }
    state.backingCanvas = null;
    state.backingCtx = null;
    state.frames = null;
    
    this.activeStates.delete(canvas);
    this.decrementSrcRef(state.src);
  }

  tick(time) {
    for (const [canvas, state] of this.activeStates.entries()) {
      if (!state.isPlaying) continue;
      
      if (!state.frames || state.frames.length === 0) continue;
      
      const currentFrame = state.frames[state.frameIndex];
      const currentFrameDuration = currentFrame.delay || 100;
      
      if (time - state.lastFrameTime >= currentFrameDuration) {
        this.drawFallbackFrame(canvas, state);
        
        state.lastFrameTime = time;
        state.frameIndex++;
        
        if (state.frameIndex >= state.frames.length) {
          if (state.mode === 'once') {
            state.isPlaying = false;
            continue;
          }
          state.frameIndex = 0;
          if (state.backingCtx) {
            state.backingCtx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
      }
    }
    
    requestAnimationFrame(this.tick);
  }

  drawFallbackFrame(canvas, state) {
    const currentFrame = state.frames[state.frameIndex];
    const dims = currentFrame.dims;
    const patchCanvas = this.sharedPatchCanvas;
    const patchCtx = this.sharedPatchCtx;
    
    if (patchCanvas.width !== dims.width || patchCanvas.height !== dims.height) {
      patchCanvas.width = dims.width;
      patchCanvas.height = dims.height;
    }
    
    const patchImageData = patchCtx.createImageData(dims.width, dims.height);
    patchImageData.data.set(currentFrame.patch);
    patchCtx.putImageData(patchImageData, 0, 0);
    
    const backingCtx = state.backingCtx;
    if (state.frameIndex > 0) {
      const prevFrame = state.frames[state.frameIndex - 1];
      if (prevFrame.disposalType === 2) {
        backingCtx.clearRect(prevFrame.dims.left, prevFrame.dims.top, prevFrame.dims.width, prevFrame.dims.height);
      }
    } else {
      backingCtx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    backingCtx.drawImage(patchCanvas, 0, 0, dims.width, dims.height, dims.left, dims.top, dims.width, dims.height);
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(state.backingCanvas, 0, 0);
  }

  async processQueue() {
    if (this.isDecoding || this.decodeQueue.length === 0) return;
    this.isDecoding = true;

    const task = this.decodeQueue.shift();
    
    const runTask = async () => {
      await task();
      this.isDecoding = false;
      this.processQueue();
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => runTask());
    } else {
      setTimeout(() => runTask(), 10);
    }
  }

  requeueDecode(canvas, src) {
    const state = this.activeStates.get(canvas);
    if (!state) return;
    
    if (this.fallbackCache.has(src)) {
      state.frames = this.fallbackCache.get(src);
      this.initBackingCanvas(canvas, state);
      return;
    }
    
    if (state.isDecoding) return;
    state.isDecoding = true;
    
    this.decodeQueue.push(async () => {
      if (!this.fallbackCache.has(src)) {
        try {
          const response = await fetch(src);
          const buffer = await response.arrayBuffer();
          const gif = new window.GIF(buffer);
          this.fallbackCache.set(src, gif.decompressFrames(true));
        } catch (e) {
          console.error('fallback decode error:', e);
        }
      }
      
      for (const [c, s] of this.activeStates.entries()) {
        if (s.src === src && !s.frames) {
          s.frames = this.fallbackCache.get(src);
          s.isDecoding = false;
          if (s.frames) {
            this.initBackingCanvas(c, s);
          }
        }
      }
    });
    this.processQueue();
  }

  initBackingCanvas(canvas, state) {
    if (!state.frames || !state.frames.length) return;
    const dims = state.frames[0].dims;
    if (canvas.width !== dims.width || canvas.height !== dims.height) {
      canvas.width = dims.width || 80;
      canvas.height = dims.height || 80;
    }
    const backingCanvas = document.createElement('canvas');
    backingCanvas.width = canvas.width;
    backingCanvas.height = canvas.height;
    state.backingCanvas = backingCanvas;
    state.backingCtx = backingCanvas.getContext('2d');
  }

  async render(canvas, src, mode) {
    canvas.dataset.gifSrc = src;
    canvas.dataset.gifMode = mode || 'loop';

    // Stop any existing animation on this canvas
    this.stop(canvas);

    if (!('ImageDecoder' in window)) {
      return this.renderFallback(canvas, src, mode);
    }
    const ctx = canvas.getContext('2d');
    
    try {
      let decoder = this.decoders.get(src);
      
      if (!decoder) {
        const response = await fetch(src);
        const stream = response.body;
        decoder = new ImageDecoder({ data: stream, type: 'image/gif' });
        this.decoders.set(src, decoder);
      }

      await decoder.tracks.ready;
      
      const track = decoder.tracks.selectedTrack;
      if (!track) {
        this.drawFallback(canvas, src);
        return false;
      }

      let frameIndex = 0;
      let lastFrameTime = performance.now();
      let currentFrameDuration = 0;

      const animate = async (time) => {
        if (!this.animationFrames.has(canvas)) return;

        if (time - lastFrameTime >= currentFrameDuration) {
          try {
            const result = await decoder.decode({ frameIndex });
            
            if (frameIndex === 0 && (canvas.width !== result.image.displayWidth || canvas.height !== result.image.displayHeight)) {
              canvas.width = result.image.displayWidth || 80;
              canvas.height = result.image.displayHeight || 80;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(result.image, 0, 0, canvas.width, canvas.height);

            currentFrameDuration = (result.image.duration / 1000) || 100;
            lastFrameTime = time;

            frameIndex++;
            if (frameIndex >= track.frameCount) {
              if (mode === 'once') {
                result.image.close();
                this.animationFrames.delete(canvas);
                return;
              }
              frameIndex = 0;
            }
            result.image.close();
          } catch (e) {
            console.error('GIF Decode error:', e);
            return;
          }
        }
        
        const id = requestAnimationFrame(animate);
        this.animationFrames.set(canvas, id);
      };

      const id = requestAnimationFrame(animate);
      this.animationFrames.set(canvas, id);
      return true;

    } catch (e) {
      console.error('Failed to init ImageDecoder:', src, e);
      this.drawFallback(canvas, src);
      return false;
    }
  }

  async renderFallback(canvas, src, mode) {
    if (!window.GIF) {
      console.warn('gifuct-js (window.GIF) missing, falling back to static.');
      this.drawFallback(canvas, src);
      return false;
    }

    this.drawFallback(canvas, src);
    
    this.observer.observe(canvas);
    this.incrementSrcRef(src);
    
    const state = {
      src,
      mode: mode || 'loop',
      frameIndex: 0,
      lastFrameTime: performance.now(),
      frames: null,
      backingCanvas: null,
      backingCtx: null,
      isPlaying: true,
      isDecoding: false,
      offScreenTimeout: null
    };
    
    this.activeStates.set(canvas, state);
    //this.requeueDecode(canvas, src);
    return true;
  }

  stop(canvas) {
    if (this.animationFrames.has(canvas)) {
      cancelAnimationFrame(this.animationFrames.get(canvas));
      this.animationFrames.delete(canvas);
    }
    
    if (this.activeStates.has(canvas)) {
      this.purgeCanvas(canvas);
    }
    
    this.observer.unobserve(canvas);
  }

  drawFallback(canvas, src) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const ctx = canvas.getContext('2d');
      canvas.width = img.naturalWidth || 80;
      canvas.height = img.naturalHeight || 80;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = src;
  }
}

window.GifEngine = new GifRendererEngine();