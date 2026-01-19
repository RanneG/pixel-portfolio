/**
 * Sound Manager for 8-bit sound effects
 * Uses Web Audio API to generate simple 8-bit sounds
 */

class SoundManager {
  private audioContext: AudioContext | null = null;
  private volume: number = 0.3;
  private enabled: boolean = true;

  constructor() {
    // Check if user prefers reduced motion/sound
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.enabled = false;
    }
  }

  init() {
    if (this.audioContext) return;
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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
      // Audio context not available
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
}

export const soundManager = new SoundManager();

