'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface Ambience {
  ctx: AudioContext;
  gain: GainNode;
}

/**
 * Soft ambient wash from the home reference: four seconds of brown-ish noise,
 * low-passed at 420Hz and breathing on a 0.06Hz LFO, generated in Web Audio —
 * no audio file, no dependency.
 *
 * Off by default. It only ever starts from the visitor's own click (browsers
 * require the gesture anyway), fades in over 2.5s, fades out over 0.6s, and is
 * torn down when the component unmounts so it never follows anyone off the page.
 */
export function useAmbientSound() {
  const [on, setOn] = useState(false);
  const audio = useRef<Ambience | null>(null);

  const stop = useCallback(() => {
    const current = audio.current;
    audio.current = null;
    if (!current) return;
    try {
      const { ctx, gain } = current;
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      window.setTimeout(() => void ctx.close().catch(() => {}), 900);
    } catch {
      // Context already closed.
    }
  }, []);

  const start = useCallback(() => {
    const Ctx =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return false;
    try {
      const ctx = new Ctx();
      const length = ctx.sampleRate * 4;
      const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let last = 0;
      for (let i = 0; i < length; i += 1) {
        const white = Math.random() * 2 - 1;
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.2;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const lowpass = ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.value = 420;
      lowpass.Q.value = 0.7;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + 2.5);
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.06;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.035;
      lfo.connect(lfoGain).connect(gain.gain);
      source.connect(lowpass).connect(gain).connect(ctx.destination);
      source.start();
      lfo.start();
      audio.current = { ctx, gain };
      return true;
    } catch {
      return false;
    }
  }, []);

  const toggle = useCallback(() => {
    if (audio.current) {
      stop();
      setOn(false);
    } else {
      setOn(start());
    }
  }, [start, stop]);

  useEffect(() => stop, [stop]);

  return { on, toggle };
}
