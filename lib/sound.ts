'use client';

import { useAppStore } from './store';

/**
 * Tiny synthesized sound effects (Web Audio, no audio files).
 * Every effect is silent when the user has turned sound off.
 */

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!useAppStore.getState().settings.sound) return null;
    if (!ctx) {
        const Ctor =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return null;
        ctx = new Ctor();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
}

interface ToneOpts {
    at?: number;
    dur?: number;
    type?: OscillatorType;
    gain?: number;
    glideTo?: number;
}

function tone(ac: AudioContext, freq: number, { at = 0, dur = 0.15, type = 'sine', gain = 0.12, glideTo }: ToneOpts = {}) {
    const t0 = ac.currentTime + at;
    const osc = ac.createOscillator();
    const amp = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(amp).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
}

export const sfx = {
    tap() {
        const ac = audio();
        if (ac) tone(ac, 640, { dur: 0.05, type: 'triangle', gain: 0.04 });
    },
    flip() {
        const ac = audio();
        if (ac) tone(ac, 320, { dur: 0.12, type: 'sine', gain: 0.06, glideTo: 720 });
    },
    correct() {
        const ac = audio();
        if (!ac) return;
        tone(ac, 659.25, { dur: 0.14, type: 'triangle', gain: 0.13 });
        tone(ac, 987.77, { at: 0.08, dur: 0.26, type: 'triangle', gain: 0.13 });
        tone(ac, 1975.5, { at: 0.08, dur: 0.2, type: 'sine', gain: 0.025 });
    },
    wrong() {
        const ac = audio();
        if (!ac) return;
        tone(ac, 196, { dur: 0.2, type: 'triangle', gain: 0.14, glideTo: 150 });
        tone(ac, 147, { at: 0.09, dur: 0.24, type: 'triangle', gain: 0.1, glideTo: 110 });
    },
    match() {
        const ac = audio();
        if (ac) tone(ac, 880, { dur: 0.1, type: 'triangle', gain: 0.08, glideTo: 1320 });
    },
    complete() {
        const ac = audio();
        if (!ac) return;
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
        notes.forEach((f, i) => tone(ac, f, { at: i * 0.09, dur: 0.32, type: 'triangle', gain: 0.11 }));
        tone(ac, 1046.5, { at: 0.5, dur: 0.9, type: 'sine', gain: 0.08 });
        tone(ac, 1567.98, { at: 0.5, dur: 0.9, type: 'sine', gain: 0.05 });
    },
};
