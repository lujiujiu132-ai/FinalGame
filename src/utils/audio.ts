// Web Audio API Synthesizer for Immersive Sound Effects & Safe BGM Control
// Avoids 404s of remote files by synthesizing high-quality sound in real-time.

let activeSfxContext: AudioContext | null = null;

// Initialize or resume the audio context safely
function getSfxContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtx) return null;
  
  if (!activeSfxContext) {
    activeSfxContext = new AudioCtx();
  }
  
  if (activeSfxContext.state === 'suspended') {
    activeSfxContext.resume().catch((err) => console.warn('[Sound Engine] Resume failed:', err));
  }
  
  return activeSfxContext;
}

// Global BGM Mute/Volume State for robust communication
export const sfxSettings = {
  isMuted: false,
  volume: 0.12, // More audible default volume
};

/**
 * 1. Synthesizes a realistic pencil-on-paper pencil scratching/note-writing sound.
 * Multiple short scribbles of high-frequency filtered white-noise.
 */
export function playWritingSound() {
  if (sfxSettings.isMuted) return;
  const ctx = getSfxContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.08, now); // Volume limit
  masterGain.connect(ctx.destination);

  // Generate white noise buffer
  const bufferSize = ctx.sampleRate * 0.45; // 0.45 seconds total
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  // Filter white noise to mimic lead pencil on textured paper (middle/high bandpass)
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(2200, now);
  filter.Q.setValueAtTime(2.5, now);
  filter.connect(masterGain);

  // Play micro scribbles
  const playScribble = (startTime: number, duration: number, volumeFactor: number) => {
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;

    const scribbleGain = ctx.createGain();
    scribbleGain.gain.setValueAtTime(0, startTime);
    scribbleGain.gain.linearRampToValueAtTime(0.35 * volumeFactor, startTime + 0.015);
    scribbleGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    source.connect(scribbleGain);
    scribbleGain.connect(filter);
    source.start(startTime, 0, duration);
  };

  // Staggered writing pattern: Scr-scr-scratch
  playScribble(now + 0.02, 0.06, 0.85);
  playScribble(now + 0.11, 0.05, 0.70);
  playScribble(now + 0.20, 0.12, 1.00);
}

/**
 * Synthesizes a loud dramatic wood gavel tap / gavel strike ("惊堂木" / OBJECTION!)
 * with a sharp initial transient followed by a hollow wooden resonance decay,
 * and a deep low-pitch thud for an earthquake feel.
 */
export function playObjectionSound() {
  if (sfxSettings.isMuted) return;
  const ctx = getSfxContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.28, now); // Loud and powerful!
  masterGain.connect(ctx.destination);

  // 1. Ominous sub-bass earthquake swell
  const subOsc = ctx.createOscillator();
  subOsc.type = 'sine';
  subOsc.frequency.setValueAtTime(120, now);
  subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.3);

  const subGain = ctx.createGain();
  subGain.gain.setValueAtTime(0, now);
  subGain.gain.linearRampToValueAtTime(0.8, now + 0.01);
  subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

  subOsc.connect(subGain);
  subGain.connect(masterGain);
  subOsc.start(now);
  subOsc.stop(now + 0.4);

  // 2. Main wooden gavel strike 1 (Sharp knock)
  const osc1 = ctx.createOscillator();
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(320, now);
  osc1.frequency.exponentialRampToValueAtTime(140, now + 0.15);

  const gain1 = ctx.createGain();
  gain1.gain.setValueAtTime(1.0, now);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

  osc1.connect(gain1);
  gain1.connect(masterGain);
  osc1.start(now);
  osc1.stop(now + 0.2);

  // 3. Subsidiary wood rebound tap (double strike feel) at now + 0.04
  const tapDelay = 0.04;
  const osc2 = ctx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(280, now + tapDelay);
  osc2.frequency.exponentialRampToValueAtTime(110, now + tapDelay + 0.12);

  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0, now + tapDelay);
  gain2.gain.linearRampToValueAtTime(0.65, now + tapDelay + 0.005);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + tapDelay + 0.14);

  osc2.connect(gain2);
  gain2.connect(masterGain);
  osc2.start(now + tapDelay);
  osc2.stop(now + tapDelay + 0.18);

  // 4. Metallic snap clip (transient friction)
  const snapOsc = ctx.createOscillator();
  snapOsc.type = 'sawtooth';
  snapOsc.frequency.setValueAtTime(900, now);
  
  const snapFilter = ctx.createBiquadFilter();
  snapFilter.type = 'bandpass';
  snapFilter.frequency.setValueAtTime(1500, now);
  snapFilter.Q.setValueAtTime(3.0, now);

  const snapGain = ctx.createGain();
  snapGain.gain.setValueAtTime(0.35, now);
  snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

  snapOsc.connect(snapFilter);
  snapFilter.connect(snapGain);
  snapGain.connect(masterGain);
  snapOsc.start(now);
  snapOsc.stop(now + 0.04);
}

/**
 * 2. Synthesizes an elegant crystalline wind-chime minor-major harp scale.
 * Indicates successful open/initiation of suspect dialogue.
 */
export function playDialogueOpenSound() {
  if (sfxSettings.isMuted) return;
  const ctx = getSfxContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.04 * (sfxSettings.volume * 8), now);
  masterGain.connect(ctx.destination);

  // Shimmer notes: pentatonic scale
  const notes = [440.00, 554.37, 659.25, 880.00]; // A4, C#5, E5, A5

  notes.forEach((freq, index) => {
    const playTime = now + index * 0.06;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, playTime);

    // Warm third harmonic for chime/woodwind body
    const overtone = ctx.createOscillator();
    overtone.type = 'triangle';
    overtone.frequency.setValueAtTime(freq * 1.5, playTime);

    const noteGain = ctx.createGain();
    const overGain = ctx.createGain();

    noteGain.gain.setValueAtTime(0, playTime);
    noteGain.gain.linearRampToValueAtTime(0.18, playTime + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, playTime + 0.6);

    overGain.gain.setValueAtTime(0, playTime);
    overGain.gain.linearRampToValueAtTime(0.06, playTime + 0.01);
    overGain.gain.exponentialRampToValueAtTime(0.0001, playTime + 0.45);

    osc.connect(noteGain);
    noteGain.connect(masterGain);

    overtone.connect(overGain);
    overGain.connect(masterGain);

    osc.start(playTime);
    osc.stop(playTime + 0.75);

    overtone.start(playTime);
    overtone.stop(playTime + 0.75);
  });
}

/**
 * 3. Synthesizes a dramatic gothic clue-collapse or suspect psychological breakdown.
 * Produces two ominous bass thuds (heartbeat) followed by a highpass-filtered glass shatter.
 */
export function playBreakdownSound() {
  if (sfxSettings.isMuted) return;
  const ctx = getSfxContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.18, now); // Stronger presence for the shock moment
  masterGain.connect(ctx.destination);

  // A. Double Heartbeat ("Doom-Doom")
  const playHeartbeatThud = (time: number) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    // Frequency sweeps downward rapidly to create impact
    osc.frequency.setValueAtTime(85, time);
    osc.frequency.exponentialRampToValueAtTime(20, time + 0.18);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.9, time + 0.015);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 0.25);

    osc.connect(gainNode);
    gainNode.connect(masterGain);
    osc.start(time);
    osc.stop(time + 0.3);
  };

  playHeartbeatThud(now + 0.05);
  playHeartbeatThud(now + 0.42);

  // B. Resonant Glass Shatter/Fracture (Noise + high pitched resonators)
  const shatterTime = now + 0.5;

  // 1. Noise Burst for friction representation
  const noiseSize = ctx.sampleRate * 0.8; // 0.8s decay
  const noiseBuffer = ctx.createBuffer(1, noiseSize, ctx.sampleRate);
  const ndata = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseSize; i++) {
    ndata[i] = (Math.random() * 2 - 1) * (1 - i / noiseSize); // Diminishing decay inside buffer
  }

  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;

  const bpf = ctx.createBiquadFilter();
  bpf.type = 'highpass';
  bpf.frequency.setValueAtTime(4500, shatterTime);
  bpf.Q.setValueAtTime(3.0, shatterTime);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0, shatterTime);
  noiseGain.gain.linearRampToValueAtTime(0.42, shatterTime + 0.03);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, shatterTime + 0.75);

  noiseSource.connect(bpf);
  bpf.connect(noiseGain);
  noiseGain.connect(masterGain);
  noiseSource.start(shatterTime);

  // 2. High-Frequency metallic bell chimes (resonant physical glass bits crashing)
  const crackFrequencies = [2300, 3120, 4850, 6100, 7400];
  crackFrequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    // Use triangle or sawtooth for sharp glassy edges
    osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(freq, shatterTime + idx * 0.02);

    const glassGain = ctx.createGain();
    const duration = 0.3 + (idx * 0.12);

    glassGain.gain.setValueAtTime(0, shatterTime + idx * 0.02);
    glassGain.gain.linearRampToValueAtTime(0.24, shatterTime + idx * 0.02 + 0.015);
    glassGain.gain.exponentialRampToValueAtTime(0.0001, shatterTime + idx * 0.02 + duration);

    osc.connect(glassGain);
    glassGain.connect(masterGain);

    osc.start(shatterTime + idx * 0.02);
    osc.stop(shatterTime + idx * 0.02 + duration + 0.1);
  });
}

/**
 * 4. Synthesizes a realistic physical paper page sweep / paper flip sound.
 * Good for navigating notebook tabs, closing dialogue, or looking at custom clues.
 */
export function playPaperFlipSound() {
  if (sfxSettings.isMuted) return;
  const ctx = getSfxContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.06, now);
  masterGain.connect(ctx.destination);

  // Generate a buffer of white noise
  const bufferSize = ctx.sampleRate * 0.18; // Short 180ms sweep
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    // Smoothed noise
    data[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = noiseBuffer;

  // Bandpass filter to sweep downward from high to low middle range
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(1800, now);
  filter.frequency.exponentialRampToValueAtTime(700, now + 0.15);
  filter.Q.setValueAtTime(1.8, now);

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.4, now + 0.03);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(masterGain);

  source.start(now);
  source.stop(now + 0.2);
}

/**
 * 5. Synthesizes a beautiful victorious mystery resolution chime.
 * Used when players successfully point out the correct culprit in final conclusion.
 */
export function playDeductionCorrectSound() {
  if (sfxSettings.isMuted) return;
  const ctx = getSfxContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.12, now);
  masterGain.connect(ctx.destination);

  // Arpeggio of victory chords: C Major 7th extending to 9th (261.63, 329.63, 392.00, 493.88, 587.33)
  const notes = [261.63, 329.63, 392.00, 493.88, 587.33, 783.99]; 

  notes.forEach((freq, idx) => {
    const playTime = now + idx * 0.08;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, playTime);

    // High shimmer additive signal
    const shimmer = ctx.createOscillator();
    shimmer.type = 'triangle';
    shimmer.frequency.setValueAtTime(freq * 2, playTime);

    const gainNode = ctx.createGain();
    const shimmerGain = ctx.createGain();

    gainNode.gain.setValueAtTime(0, playTime);
    gainNode.gain.linearRampToValueAtTime(0.15, playTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, playTime + 1.2);

    shimmerGain.gain.setValueAtTime(0, playTime);
    shimmerGain.gain.linearRampToValueAtTime(0.05, playTime + 0.01);
    shimmerGain.gain.exponentialRampToValueAtTime(0.0001, playTime + 0.8);

    osc.connect(gainNode);
    gainNode.connect(masterGain);

    shimmer.connect(shimmerGain);
    shimmerGain.connect(masterGain);

    osc.start(playTime);
    osc.stop(playTime + 1.4);

    shimmer.start(playTime);
    shimmer.stop(playTime + 0.9);
  });
}

/**
 * 6. Synthesizes a heavy, retro minor-second dark buzz / ominous gong.
 * Used when a deduction fails or incorrect logic is provided.
 */
export function playDeductionWrongSound() {
  if (sfxSettings.isMuted) return;
  const ctx = getSfxContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.15, now);
  masterGain.connect(ctx.destination);

  // Ominous dissonant pair: Low E1 & F1 (Very low frequencies creating beat-frequency friction)
  const frequencies = [41.20, 43.65, 82.41]; 
  
  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    osc.type = idx === 2 ? 'triangle' : 'sawtooth';
    osc.frequency.setValueAtTime(freq, now);
    
    // Sweeps down slightly for power
    osc.frequency.linearRampToValueAtTime(freq * 0.9, now + 0.8);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, now);

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.4, now + 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGain);

    osc.start(now);
    osc.stop(now + 2.2);
  });
}

/**
 * 7. Synthesizes a dull wood-tap/metallic drawer click when searching rooms/clues.
 * Indicates interacting with scene elements.
 */
export function playSearchExploreSound() {
  if (sfxSettings.isMuted) return;
  const ctx = getSfxContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.07, now);
  masterGain.connect(ctx.destination);

  // Wooden hollow knock
  const osc1 = ctx.createOscillator();
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(150, now);
  osc1.frequency.exponentialRampToValueAtTime(80, now + 0.08);

  const gain1 = ctx.createGain();
  gain1.gain.setValueAtTime(0.8, now);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

  osc1.connect(gain1);
  gain1.connect(masterGain);

  // Metallic springy high-freq click
  const osc2 = ctx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(950, now);

  const gain2 = ctx.createGain();
  gain2.gain.setValueAtTime(0.2, now);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

  osc2.connect(gain2);
  gain2.connect(masterGain);

  osc1.start(now);
  osc1.stop(now + 0.15);
  osc2.start(now);
  osc2.stop(now + 0.05);
}

/**
 * 8. Synthesizes a clean cybernetic electronic chime / sweep.
 * Triggers on banner notifications/banner pops.
 */
export function playAlertSound() {
  if (sfxSettings.isMuted) return;
  const ctx = getSfxContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.08, now);
  masterGain.connect(ctx.destination);

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(523.25, now); // C5
  osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.18); // C6 sweep upward

  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

  osc.connect(gainNode);
  gainNode.connect(masterGain);

  osc.start(now);
  osc.stop(now + 0.45);
}

let activeWaterNode: any = null;
let activeWaterGain: GainNode | null = null;

/**
 * 9. Synthesizes a real-time rushing/flowing kitchen water sound.
 * Uses fractal pink/white noise, low/high-pass filter combinations, and LFO modulation
 * to represent fully opened flowing taps realistically without requiring massive external assets.
 */
export function playWaterSound() {
  if (sfxSettings.isMuted) return;
  const ctx = getSfxContext();
  if (!ctx) return;

  try {
    stopWaterSound();

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    
    // Smoothly fade in over 0.35s to prevent harsh pops
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.25, now + 0.35);
    masterGain.connect(ctx.destination);
    activeWaterGain = masterGain;

    // Create a 3-second buffer of custom pink/white noise mix
    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      
      // Pink noise filter approximation
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;

      // Add dynamic low frequency wave modulation to mimic water waves/churning
      const waveLfo = Math.sin(2 * Math.PI * 3.5 * (i / ctx.sampleRate)) * 0.12 + 0.88;
      data[i] = (pink * 0.045 + white * 0.015) * waveLfo;
    }

    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    // Lowpass filter to emulate indoor piping and acoustics
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(1200, now);

    // Highpass filter to eliminate sub-audio bass mud
    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(160, now);

    // Dynamic Bandpass filter to reproduce splashing spray/aeration
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(2600, now);
    bandpass.Q.setValueAtTime(1.2, now);

    const splashGain = ctx.createGain();
    splashGain.gain.setValueAtTime(0.4, now);

    // Connect audio processing nodes
    source.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(masterGain);

    source.connect(bandpass);
    bandpass.connect(splashGain);
    splashGain.connect(masterGain);

    // Slow frequency LFO to dynamically sweep the splash band, adding movement
    const lfoOsc = ctx.createOscillator();
    lfoOsc.frequency.setValueAtTime(0.75, now); // 0.75 Hz sweep
    
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(350, now); // Swing width of 350Hz

    lfoOsc.connect(lfoGain);
    lfoGain.connect(bandpass.frequency);

    // Start playback
    lfoOsc.start(now);
    source.start(now);

    activeWaterNode = {
      source,
      lfoOsc,
      highpass,
      lowpass,
      bandpass,
      splashGain
    };
  } catch (error) {
    console.warn('[Sound Engine] Failed to play synthesized water sound:', error);
  }
}

/**
 * 10. Smoothly stops the water flow synthesis using a clean gain ramp
 * to prevent popping or clicking sounds during transition.
 */
export function stopWaterSound() {
  try {
    if (activeWaterGain && activeSfxContext) {
      const now = activeSfxContext.currentTime;
      activeWaterGain.gain.cancelScheduledValues(now);
      activeWaterGain.gain.setValueAtTime(activeWaterGain.gain.value, now);
      activeWaterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
    }

    const node = activeWaterNode;
    if (node) {
      setTimeout(() => {
        try {
          node.source.stop();
          node.lfoOsc.stop();
        } catch (_) {}
      }, 300);
      activeWaterNode = null;
    }
  } catch (error) {
    console.warn('[Sound Engine] Failed to stop water sound:', error);
  }
}
