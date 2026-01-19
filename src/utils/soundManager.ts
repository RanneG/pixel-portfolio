/**
 * Sound Manager for 8-bit sound effects
 * Uses Web Audio API to generate simple 8-bit sounds
 */

class SoundManager {
  private audioContext: AudioContext | null = null;
  private volume: number = 0.3;
  private enabled: boolean = true;
  private userInteracted: boolean = false;

  constructor() {
    // Check if user prefers reduced motion/sound
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.enabled = false;
    }

    // Listen for user interaction to enable audio
    const enableAudio = () => {
      this.userInteracted = true;
      if (this.audioContext && this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("touchstart", enableAudio);
      document.removeEventListener("keydown", enableAudio);
    };

    document.addEventListener("click", enableAudio, { once: true });
    document.addEventListener("touchstart", enableAudio, { once: true });
    document.addEventListener("keydown", enableAudio, { once: true });
  }

  init() {
    if (this.audioContext) {
      // Resume if suspended (requires user gesture)
      if (this.audioContext.state === "suspended" && this.userInteracted) {
        this.audioContext.resume();
      }
      return;
    }
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      // Resume if suspended (browser autoplay policy)
      if (this.audioContext.state === "suspended" && this.userInteracted) {
        this.audioContext.resume();
      }
    } catch {
      this.enabled = false;
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  // Generate 8-bit beep sound
  private playTone(frequency: number, duration: number, type: OscillatorType = "square") {
    if (!this.enabled || !this.audioContext) return;

    // Ensure audio context is resumed (requires user gesture)
    if (this.audioContext.state === "suspended") {
      if (this.userInteracted) {
        this.audioContext.resume().catch(() => {
          // User may have blocked audio
          this.enabled = false;
        });
      } else {
        // Don't play sounds until user interacts
        return;
      }
    }

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch {
      // Audio context not available or blocked
      this.enabled = false;
    }
  }

  // Button click sound
  click() {
    this.init();
    this.playTone(800, 0.05, "square");
  }

  // Form submission sound
  submit() {
    this.init();
    const now = this.audioContext?.currentTime || 0;
    // Play a short melody
    this.playTone(523.25, 0.1, "square"); // C
    setTimeout(() => this.playTone(659.25, 0.1, "square"), 100); // E
    setTimeout(() => this.playTone(783.99, 0.15, "square"), 200); // G
  }

  // Section transition sound
  transition() {
    this.init();
    this.playTone(600, 0.08, "sine");
  }

  // Konami code activation sound
  konami() {
    this.init();
    // Play a victory fanfare
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, C
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, "square"), i * 150);
    });
  }

  // Achievement unlock sound
  achievement() {
    this.init();
    const notes = [659.25, 783.99, 987.77]; // E, G, B
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.15, "square"), i * 100);
    });
  }

  // Error sound
  error() {
    this.init();
    this.playTone(200, 0.2, "sawtooth");
  }

  // Power-up/eat element sound (higher pitch)
  eatElement() {
    this.init();
    // Play a pleasant higher-pitched melody for eating element food
    const notes = [523.25, 659.25, 783.99]; // C, E, G
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq * 1.5, 0.1, "square"), i * 80);
    });
  }
}

export const soundManager = new SoundManager();

