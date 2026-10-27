import { getAudioContext, resumeAudioContext } from './audioContext.js';

// Background track at a low, fixed volume. A gain node keeps it quiet even on
// mobile browsers where the media element volume cannot be changed.
export class MusicPlayer {
  #isRouted = false;

  constructor(audio, volume) {
    this.audio = audio;
    this.volume = volume;
    audio.volume = volume;
  }

  get isPlaying() {
    return !this.audio.paused && !this.audio.ended;
  }

  async play() {
    this.#routeThroughGain();
    await resumeAudioContext();
    if (this.audio.error) this.audio.load();
    await this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  onChange(listener) {
    ['play', 'pause', 'ended', 'error'].forEach(event => this.audio.addEventListener(event, listener));
  }

  #routeThroughGain() {
    if (this.#isRouted) return;
    this.#isRouted = true;
    const context = getAudioContext();
    if (!context) return;
    try {
      const gain = context.createGain();
      gain.gain.value = this.volume;
      context.createMediaElementSource(this.audio).connect(gain).connect(context.destination);
      this.audio.volume = 1;
    } catch {
      this.audio.volume = this.volume;
    }
  }
}
