import { getAudioContext } from './audioContext.js';

const SILENCE = 0.0001;

// Tiny synthesized chiptune cues: [frequency Hz, start s, duration s].
const CUES = {
  talk: { wave: 'square', volume: 0.025, notes: [[740, 0, 0.035]] },
  open: { wave: 'square', volume: 0.04, notes: [[523, 0, 0.07], [784, 0.07, 0.1]] },
  close: { wave: 'square', volume: 0.035, notes: [[784, 0, 0.06], [523, 0.06, 0.08]] },
  collect: { wave: 'triangle', volume: 0.09, notes: [[880, 0, 0.07], [1175, 0.07, 0.07], [1568, 0.14, 0.14]] },
  select: { wave: 'square', volume: 0.03, notes: [[988, 0, 0.04]] },
};

export class SoundEffects {
  constructor() {
    this.isEnabled = false;
  }

  play(name) {
    const cue = CUES[name];
    const context = this.isEnabled ? getAudioContext() : null;
    if (!cue || !context || context.state !== 'running') return;
    const now = context.currentTime;
    cue.notes.forEach(([frequency, start, duration]) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = cue.wave;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(cue.volume, now + start);
      gain.gain.exponentialRampToValueAtTime(SILENCE, now + start + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now + start);
      oscillator.stop(now + start + duration + 0.02);
    });
  }
}
