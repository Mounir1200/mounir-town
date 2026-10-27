// One switch for music and sound effects. Every visit starts silent:
// sound only begins when the visitor turns it on.
export class SoundController {
  #isOn = false;
  #listeners = new Set();

  constructor(music, effects) {
    this.music = music;
    this.effects = effects;
    music.onChange(() => this.#notify());
  }

  get isOn() {
    return this.#isOn;
  }

  get isMusicPlaying() {
    return this.music.isPlaying;
  }

  // Resolves to false when the music could not start.
  async toggle() {
    if (this.#isOn) {
      this.turnOff();
      return true;
    }
    return this.turnOn();
  }

  async turnOn() {
    this.#isOn = true;
    this.effects.isEnabled = true;
    this.#notify();
    try {
      await this.music.play();
      return true;
    } catch {
      return false;
    } finally {
      this.#notify();
    }
  }

  turnOff() {
    this.#isOn = false;
    this.effects.isEnabled = false;
    this.music.pause();
    this.#notify();
  }

  play(cue) {
    this.effects.play(cue);
  }

  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  #notify() {
    this.#listeners.forEach(listener => listener(this));
  }
}
