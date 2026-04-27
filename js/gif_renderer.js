class GifRendererEngine {
  constructor() {
    this.decoders = new Map();
    this.animationFrames = new Map();
  }

  async render(canvas, src, mode) {
    // Stop any existing animation on this canvas
    this.stop(canvas);

    if (!('ImageDecoder' in window)) {
      console.warn('ImageDecoder API not supported in this browser. Falling back to static image.');
      this.drawFallback(canvas, src);
      return false;
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
