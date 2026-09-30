/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio synthesizer engine that plays real musical compositions
// and provides fallback synthesis for demo songs, or plays real audio streams.

class WebAudioSynthEngine {
  private ctx: AudioContext | null = null;
  private isSynthesizing: boolean = false;
  private synthInterval: number | null = null;
  private masterGain: GainNode | null = null;
  private volume: number = 0.75;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  startSynthTrack(genreTone: string) {
    this.initContext();
    if (this.isSynthesizing) {
      this.stop();
    }
    this.isSynthesizing = true;

    // Define harmonic progressions based on track tone
    const chordProgressions: Record<string, number[][]> = {
      'synth-acoustic': [
        [261.63, 329.63, 392.00], // C
        [220.00, 261.63, 329.63], // Am
        [174.61, 220.00, 261.63], // F
        [196.00, 246.94, 293.66], // G
      ],
      'synth-lofi': [
        [293.66, 349.23, 440.00, 523.25], // Dm7
        [196.00, 246.94, 293.66, 392.00], // G7
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
      ],
      'synth-choir': [
        [261.63, 329.63, 392.00, 523.25], // C chord
        [174.61, 220.00, 261.63, 349.23], // F chord
        [196.00, 246.94, 293.66, 392.00], // G chord
        [220.00, 261.63, 329.63, 440.00], // Am chord
      ],
      'synth-ambient': [
        [196.00, 293.66, 392.00, 440.00],
        [220.00, 329.63, 440.00, 523.25],
        [174.61, 261.63, 349.23, 440.00],
        [196.00, 293.66, 392.00, 587.33],
      ],
      'synth-beat': [
        [130.81, 164.81, 196.00],
        [110.00, 146.83, 174.61],
        [98.00, 123.47, 146.83],
        [130.81, 164.81, 196.00],
      ]
    };

    const chords = chordProgressions[genreTone] || chordProgressions['synth-acoustic'];
    let step = 0;

    const playHarmonics = () => {
      if (!this.ctx || !this.masterGain || !this.isSynthesizing) return;
      const now = this.ctx.currentTime;
      const currentChord = chords[step % chords.length];

      // Arpeggiate chord notes with warm decay
      currentChord.forEach((freq, noteIdx) => {
        const osc = this.ctx!.createOscillator();
        const noteGain = this.ctx!.createGain();

        // Waveform selection by tone
        if (genreTone === 'synth-choir') {
          osc.type = 'sine';
        } else if (genreTone === 'synth-lofi') {
          osc.type = 'triangle';
        } else if (genreTone === 'synth-beat') {
          osc.type = 'sawtooth';
        } else {
          osc.type = 'triangle';
        }

        osc.frequency.setValueAtTime(freq, now + noteIdx * 0.18);

        // Gentle envelope
        const noteStart = now + noteIdx * 0.18;
        noteGain.gain.setValueAtTime(0.0001, noteStart);
        noteGain.gain.linearRampToValueAtTime(0.08, noteStart + 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + 1.2);

        osc.connect(noteGain);
        noteGain.connect(this.masterGain!);

        osc.start(noteStart);
        osc.stop(noteStart + 1.25);
      });

      step++;
    };

    // Trigger notes every 1.5 seconds for a soothing rhythm
    playHarmonics();
    this.synthInterval = window.setInterval(playHarmonics, 1600);
  }

  stop() {
    this.isSynthesizing = false;
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }
}

export const audioSynth = new WebAudioSynthEngine();
