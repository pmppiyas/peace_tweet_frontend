// Synthesized Web Audio API sound effects for PeaceTweet
// Zero external audio files required - works offline with 0ms latency

type SoundEffectType =
  | 'tab'
  | 'post'
  | 'friendRequest'
  | 'friendAccept'
  | 'reaction'
  | 'save'
  | 'cancel'
  | 'delete';

class SoundEffectsService {
  private audioCtx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('peacetweet_sound_enabled');
      this.soundEnabled = stored !== null ? stored === 'true' : true;
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    try {
      if (!this.audioCtx) {
        const AudioContextClass =
          window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          this.audioCtx = new AudioContextClass();
        }
      }

      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume().catch(() => {});
      }

      return this.audioCtx;
    } catch {
      return null;
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('peacetweet_sound_enabled', String(this.soundEnabled));
    }
    return this.soundEnabled;
  }

  public setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('peacetweet_sound_enabled', String(enabled));
    }
  }

  /**
   * Crisp micro-tap / haptic click for tab switching and toggles
   */
  public playTab(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.02);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.02);
    } catch {}
  }

  /**
   * Satisfying post publish sound - smooth upward whoosh followed by pleasant bell chime
   */
  public playPost(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Upward whoosh tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(330, now); // E4
      osc1.frequency.exponentialRampToValueAtTime(659.25, now + 0.12); // E5

      gain1.gain.setValueAtTime(0.02, now);
      gain1.gain.linearRampToValueAtTime(0.09, now + 0.06);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.18);

      // 2. Clear harmonic chime (reward ping)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1046.5, now + 0.09); // C6

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.setValueAtTime(0.12, now + 0.09);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.09);
      osc2.stop(now + 0.38);

      // 3. Higher overtone
      const osc3 = ctx.createOscillator();
      const gain3 = ctx.createGain();
      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(1318.51, now + 0.14); // E6

      gain3.gain.setValueAtTime(0.001, now);
      gain3.gain.setValueAtTime(0.08, now + 0.14);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start(now + 0.14);
      osc3.stop(now + 0.42);
    } catch {}
  }

  /**
   * Friend request sent - brisk, affirmative ascending dual tone
   */
  public playFriendRequest(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Note 1 (C5)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now);
      gain1.gain.setValueAtTime(0.09, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.09);

      // Note 2 (G5)
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(783.99, now + 0.07);
      gain2.gain.setValueAtTime(0.09, now + 0.07);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.07);
      osc2.stop(now + 0.25);
    } catch {}
  }

  /**
   * Friend request accepted / confirmed - joyful 3-note major arpeggio
   */
  public playFriendAccept(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [
        { freq: 523.25, time: 0.0, dur: 0.12 }, // C5
        { freq: 659.25, time: 0.07, dur: 0.14 }, // E5
        { freq: 1046.5, time: 0.14, dur: 0.35 }, // C6
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.setValueAtTime(0.11, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + time);
        osc.stop(now + time + dur);
      });
    } catch {}
  }

  /**
   * Like / Reaction - soft organic bubble pop
   */
  public playReaction(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.045);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch {}
  }

  /**
   * Save / Bookmark - gentle bookmark ping
   */
  public playSave(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // Primary chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(740, now); // F#5
      gain1.gain.setValueAtTime(0.08, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.16);

      // Sweet harmonic
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1108.73, now + 0.04); // C#6
      gain2.gain.setValueAtTime(0.06, now + 0.04);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.04);
      osc2.stop(now + 0.25);
    } catch {}
  }

  /**
   * Cancel / Reject / Unfriend - soft subtle descending tick
   */
  public playCancel(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.035);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {}
  }

  /**
   * Delete sound - crisp tactile trash discard / downward drop
   */
  public playDelete(): void {
    if (!this.soundEnabled) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // 1. Descending pitch sweep (the "shwuck" drop)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(450, now);
      osc1.frequency.exponentialRampToValueAtTime(110, now + 0.12);

      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // 2. Low-frequency soft thud / impact
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(160, now + 0.02);
      osc2.frequency.exponentialRampToValueAtTime(50, now + 0.16);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.setValueAtTime(0.14, now + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.02);
      osc2.stop(now + 0.16);
    } catch {}
  }

  /**
   * Generic trigger helper
   */
  public play(effect: SoundEffectType): void {
    switch (effect) {
      case 'tab':
        this.playTab();
        break;
      case 'post':
        this.playPost();
        break;
      case 'friendRequest':
        this.playFriendRequest();
        break;
      case 'friendAccept':
        this.playFriendAccept();
        break;
      case 'reaction':
        this.playReaction();
        break;
      case 'save':
        this.playSave();
        break;
      case 'cancel':
        this.playCancel();
        break;
      case 'delete':
        this.playDelete();
        break;
    }
  }
}

export const soundEffects = new SoundEffectsService();
