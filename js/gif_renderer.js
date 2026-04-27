class GifRendererEngine {
  constructor() {
    this.decoders = new Map();
    this.animationFrames = new Map();
    this.fallbackCache = new Map();
    this.pending = new Map();
    this.decodeQueue = [];
    this.isDecoding = false;
  }

  async processQueue() {
    if (this.isDecoding || this.decodeQueue.length === 0) return;
    this.isDecoding = true;

    const task = this.decodeQueue.shift();
    await task();

    this.isDecoding = false;
    this.processQueue();
  }

  async render(canvas, src, mode) {
    // Stop any existing animation on this canvas
    this.stop(canvas);

    if (!('ImageDecoder' in window)) {
      return this.renderFallback(canvas, src, mode);
    }
    const ctx = canvas.getContext('2d');
    
    try {
      let decoder = this.decoders.get(src);
      
      // If we don't have it cached, or if it's 'once' mode (we might want a fresh stream to restart reliably, but ImageDecoder handles frame index)
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

            currentFrameDuration = (result.image.duration / 1000) || 100; // fallback to 100ms if duration missing
            lastFrameTime = time;

            frameIndex++;
            if (frameIndex >= track.frameCount) {
              if (mode === 'once') {
                result.image.close();
                this.animationFrames.delete(canvas);
                return; // End animation
              }
              frameIndex = 0; // Loop
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
      console.error('Failed to init ImageDecoder:', e);
      this.drawFallback(canvas, src);
      return false;
    }
  }

  async renderFallback(canvas, src, mode) {
    // Look for the global GIF constructor exposed by the library
    if (!window.GIF) {
      console.warn('gifuct-js (window.GIF) missing, falling back to static.');
      this.drawFallback(canvas, src);
      return false;
    }

    this.drawFallback(canvas, src);

    let frames = this.fallbackCache.get(src);

    if (!frames) {
      // push the heavy lifting into the queue
      await new Promise(resolve => {
        this.decodeQueue.push(async () => {
          // check if it got cached by another canvas while waiting
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
          frames = this.fallbackCache.get(src);
          resolve();
        });
        this.processQueue();
      });
    }

    if (!frames || !frames.length) return false;

    const ctx = canvas.getContext('2d');
    
    // Set dimensions based on the first frame
    const dims = frames[0].dims;
    if (canvas.width !== dims.width || canvas.height !== dims.height) {
      canvas.width = dims.width || 80;
      canvas.height = dims.height || 80;
    }

    // setup a backing canvas to accumulate the frames properly
    const backingCanvas = document.createElement('canvas');
    backingCanvas.width = canvas.width;
    backingCanvas.height = canvas.height;
    const backingCtx = backingCanvas.getContext('2d');

    // setup a reusable patch canvas for individual frame data
    const patchCanvas = document.createElement('canvas');
    const patchCtx = patchCanvas.getContext('2d');

    let frameIndex = 0;
    let lastFrameTime = performance.now();

    const animate = (time) => {
      if (!this.animationFrames.has(canvas)) return;

      const currentFrame = frames[frameIndex];
      const currentFrameDuration = currentFrame.delay || 100;

      if (time - lastFrameTime >= currentFrameDuration) {
        const dims = currentFrame.dims;

        // resize patch canvas to match the specific frame's patch
        if (patchCanvas.width !== dims.width || patchCanvas.height !== dims.height) {
          patchCanvas.width = dims.width;
          patchCanvas.height = dims.height;
        }

        // write the raw pixel data into the patch canvas
        const patchImageData = patchCtx.createImageData(dims.width, dims.height);
        patchImageData.data.set(currentFrame.patch);
        patchCtx.putImageData(patchImageData, 0, 0);

        // handle frame disposal (clearing the previous patch if the gif requires it)
        if (frameIndex > 0) {
          const prevFrame = frames[frameIndex - 1];
          if (prevFrame.disposalType === 2) { 
            backingCtx.clearRect(prevFrame.dims.left, prevFrame.dims.top, prevFrame.dims.width, prevFrame.dims.height);
          }
        } else {
          backingCtx.clearRect(0, 0, canvas.width, canvas.height);
        }

        // draw the patch onto the backing canvas at the correct offset
        backingCtx.drawImage(patchCanvas, 0, 0, dims.width, dims.height, dims.left, dims.top, dims.width, dims.height);

        // draw the fully composited frame to the visible canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(backingCanvas, 0, 0);

        lastFrameTime = time;
        frameIndex++;

        if (frameIndex >= frames.length) {
          if (mode === 'once') {
            this.animationFrames.delete(canvas);
            return;
          }
          frameIndex = 0;
          backingCtx.clearRect(0, 0, canvas.width, canvas.height); // clear on loop
        }
      }
      
      const id = requestAnimationFrame(animate);
      this.animationFrames.set(canvas, id);
    };

    const id = requestAnimationFrame(animate);
    this.animationFrames.set(canvas, id);
    return true;
  }

  stop(canvas) {
    if (this.animationFrames.has(canvas)) {
      cancelAnimationFrame(this.animationFrames.get(canvas));
      this.animationFrames.delete(canvas);
    }
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