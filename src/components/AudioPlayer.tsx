import { useEffect, useRef, useState } from 'react';
import { sfxSettings } from '../utils/audio';

interface AudioPlayerProps {
  emotionStates?: Record<string, any>;
  currentStage?: string;
}

export default function AudioPlayer({ emotionStates, currentStage }: AudioPlayerProps) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const synthNodesLocalRef = useRef<any[]>([]);
  const synthIntervalRef = useRef<any>(null);
  const userHasInteractedRef = useRef<boolean>(false);

  // Synchronized visual status
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.12); // Slightly higher default for noticeability

  // Monitor stress levels dynamically to shift BGM drama according to game plot
  const maxStressValue = emotionStates 
    ? Math.max(...Object.values(emotionStates).filter((v): v is number => typeof v === 'number')) 
    : 0;
  
  const isSuspenseIntense = maxStressValue >= 45 || currentStage === 'conclude';

  // Toggle master audio player
  const toggleMute = () => {
    const nextMuted = !sfxSettings.isMuted;
    sfxSettings.isMuted = nextMuted;
    
    // Propagate state to BGM node
    if (masterGainRef.current && audioContextRef.current) {
      const now = audioContextRef.current.currentTime;
      masterGainRef.current.gain.linearRampToValueAtTime(
        nextMuted ? 0 : volume, 
        now + 0.15
      );
    }

    setIsPlaying(!nextMuted);

    // Warm restart if user explicitly requests play and context is not built
    if (!nextMuted && !audioContextRef.current) {
      userHasInteractedRef.current = true;
      startAmbientSynth();
    } else if (!nextMuted && audioContextRef.current) {
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    }
  };

  // Adjust volume dynamically
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    sfxSettings.volume = newVol;
    if (masterGainRef.current && audioContextRef.current && !sfxSettings.isMuted) {
      const now = audioContextRef.current.currentTime;
      masterGainRef.current.gain.setValueAtTime(newVol, now);
    }
  };

  // Advanced Gothic Ambient Synth Engine with multi-stage tension adaptation
  const startAmbientSynth = () => {
    try {
      stopSynth();

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // Force resume context if suspended by browser security policy
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Master output node
      const masterGain = ctx.createGain();
      masterGainRef.current = masterGain;
      // Hook up to current muted setting
      masterGain.gain.setValueAtTime(sfxSettings.isMuted ? 0 : volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      synthNodesLocalRef.current.push(masterGain);

      // Lowpass Filter to create that dim, antique mansion tone
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      
      // Dynamic filter cutoff based on stage & tension
      let cutoffFreq = 300;
      if (currentStage === 'conclude') {
        cutoffFreq = 500;
      } else if (isSuspenseIntense) {
        cutoffFreq = 420;
      } else if (currentStage === 'start') {
        cutoffFreq = 650; // Brighter vintage tone for start
      }
      
      filter.frequency.setValueAtTime(cutoffFreq, ctx.currentTime);
      filter.connect(masterGain);
      synthNodesLocalRef.current.push(filter);

      // Deep atmospheric thematic chords for distinct game stages
      // 1. Start: Classical vintage mourning major/minor chord sequence
      const startChords = [
        [130.81, 164.81, 196.00, 246.94], // Cmaj7 (C3, E3, G3, B3)
        [110.00, 130.81, 164.81, 220.00]  // Am (A2, C3, E3, A3)
      ];

      // 2. Background backstory: Dark drone ambient
      const introChords = [
        [73.42, 110.00, 146.83],         // Dm/D (D2, A2, D3)
        [82.41, 123.47, 164.81]          // Em/E (E2, B2, E3)
      ];

      // 3. General investigation (relaxed but mystery-laden)
      const investigateChords = [
        [110.00, 130.81, 155.56, 196.00], // Am7b5 (A2, C3, Eb3, G3)
        [98.00, 116.54, 146.83, 174.61],  // G7 (G2, Bb2, D3, F3)
        [82.41, 110.00, 130.81, 164.81]   // Am/E (E2, A2, C3, E3)
      ];

      // 4. Final confrontation (high pulse/dissonant clash)
      const highTensionChords = [
        [110.00, 130.81, 164.81, 196.00], // Am7 (A2, C3, E3, G3)
        [87.31, 110.00, 130.81, 155.56],  // Fdim (F2, A2, C3, Eb3)
        [73.42, 92.50, 110.00, 138.59]     // Dmaj7b5 (D2, F#2, A2, C#3)
      ];

      let chordIndex = 0;
      
      const playPianoNote = (freq: number, startTime: number, duration: number, velocity: number) => {
        // Fundamental frequency string oscillation
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        // Warm second harmonic (one octave up) for soundboard wooden resonance
        const harmonic1 = ctx.createOscillator();
        harmonic1.type = 'triangle';
        harmonic1.frequency.setValueAtTime(freq * 2, startTime);

        // Third harmonic (octave and a fifth up) for crystalline, chime-like hammer strikes
        const harmonic2 = ctx.createOscillator();
        harmonic2.type = 'sine';
        harmonic2.frequency.setValueAtTime(freq * 3, startTime);

        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();
        const gain3 = ctx.createGain();

        // Standard classic piano hammer envelopes:
        // Ultra-fast linear attack peak (0.003s) to define the initial mallet smash on strings
        gain1.gain.setValueAtTime(0, startTime);
        gain1.gain.linearRampToValueAtTime(0.18 * velocity, startTime + 0.003);
        // Exponential decay into body sustain and slow release tail
        gain1.gain.exponentialRampToValueAtTime(0.04 * velocity, startTime + 0.3);
        gain1.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        // Harmonic 1 (triangle wave / warmth) decays slightly faster
        gain2.gain.setValueAtTime(0, startTime);
        gain2.gain.linearRampToValueAtTime(0.07 * velocity, startTime + 0.005);
        gain2.gain.exponentialRampToValueAtTime(0.01 * velocity, startTime + 0.22);
        gain2.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.7);

        // Harmonic 2 (high sheen sine filter) fades out almost immediately
        gain3.gain.setValueAtTime(0, startTime);
        gain3.gain.linearRampToValueAtTime(0.05 * velocity, startTime + 0.002);
        gain3.gain.exponentialRampToValueAtTime(0.002 * velocity, startTime + 0.12);
        gain3.gain.exponentialRampToValueAtTime(0.0001, startTime + duration * 0.45);

        // Subtle slow frequency modulation mimicking a dusty antique piano / tape flutter
        const vibrato = ctx.createOscillator();
        const vibratoGain = ctx.createGain();
        vibrato.frequency.value = 2.8; // 2.8 Hz nostalgic slow wobbling
        vibratoGain.gain.value = 1.2;  // subtle cents drift
        
        vibrato.connect(vibratoGain);
        vibratoGain.connect(osc.frequency);
        vibratoGain.connect(harmonic1.frequency);
        
        vibrato.start(startTime);
        vibrato.stop(startTime + duration + 0.1);

        osc.connect(gain1);
        gain1.connect(filter);

        harmonic1.connect(gain2);
        gain2.connect(filter);

        harmonic2.connect(gain3);
        gain3.connect(filter);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.1);

        harmonic1.start(startTime);
        harmonic1.stop(startTime + duration + 0.1);

        harmonic2.start(startTime);
        harmonic2.stop(startTime + duration + 0.1);

        synthNodesLocalRef.current.push(osc, harmonic1, harmonic2, vibrato);
      };

      const playChordNotes = () => {
        const now = ctx.currentTime;
        
        let currentChord = investigateChords[chordIndex % investigateChords.length];
        let tensionLevel: 'start' | 'intro' | 'normal' | 'tension' = 'normal';

        if (currentStage === 'start') {
          currentChord = startChords[chordIndex % startChords.length];
          tensionLevel = 'start';
        } else if (currentStage === 'background') {
          currentChord = introChords[chordIndex % introChords.length];
          tensionLevel = 'intro';
        } else if (isSuspenseIntense || currentStage === 'conclude') {
          currentChord = highTensionChords[chordIndex % highTensionChords.length];
          tensionLevel = 'tension';
        }

        const moduloLength = currentStage === 'start' ? startChords.length 
                           : currentStage === 'background' ? introChords.length
                           : (isSuspenseIntense || currentStage === 'conclude') ? highTensionChords.length 
                           : investigateChords.length;

        chordIndex = (chordIndex + 1) % moduloLength;

        // Clean previous oscillators safely
        synthNodesLocalRef.current = synthNodesLocalRef.current.filter(node => {
          if (node instanceof OscillatorNode) {
            try { node.stop(); node.disconnect(); } catch (e) {}
            return false;
          }
          return true;
        });

        // Trigger beautiful broken piano chord (琶音)
        currentChord.forEach((freq, idx) => {
          const delay = idx * 0.28; // Romantic flowing pace of 280ms intervals
          const noteDuration = 3.2 - (idx * 0.15); // Higher register notes fade quicker
          const velocity = 0.95 - (idx * 0.08); // Striking accent on standard tones
          playPianoNote(freq, now + delay, noteDuration, velocity);
        });

        // Overlay a delicate classical piano lead motif to tell a story
        const baseFreq = currentChord[0];
        const melodyDelay = 1.32;

        if (tensionLevel === 'start') {
          // Elegiac double notes in romantic classical key
          const highMelody1 = baseFreq > 120 ? 587.33 : 523.25; // D5 / C5
          const highMelody2 = baseFreq > 120 ? 659.25 : 587.33; // E5 / D5
          playPianoNote(highMelody1, now + melodyDelay, 2.2, 0.75);
          playPianoNote(highMelody2, now + melodyDelay + 0.65, 2.6, 0.65);
        } else if (tensionLevel === 'normal') {
          // Melancholy broken-note detective motif
          const highMelody1 = baseFreq * 4; 
          if (highMelody1 > 350 && highMelody1 < 1000) {
            playPianoNote(highMelody1, now + melodyDelay, 1.8, 0.58);
            playPianoNote(highMelody1 * 1.25, now + melodyDelay + 0.72, 2.2, 0.48);
          }
        } else if (tensionLevel === 'tension') {
          // Panicked high register clashes
          const dissonantMelody = baseFreq * 5.6; 
          playPianoNote(dissonantMelody, now + 0.6, 1.2, 0.72);
          playPianoNote(dissonantMelody * 0.94, now + 1.15, 1.0, 0.62);
        } else if (tensionLevel === 'intro') {
          // Slow narrative ambient piano line
          playPianoNote(baseFreq * 3.0, now + 1.4, 2.8, 0.52);
        }

        // HEARTBEAT DRONE TICKER
        // Ticking heartbeat cue (Rapid double beats for high tension, calm ticking for investigate)
        const beatFreq = (isSuspenseIntense || currentStage === 'conclude') ? 50 : 38;
        const beatGainAmount = (isSuspenseIntense || currentStage === 'conclude') ? 0.65 : 0.28;
        
        // No heavy tickers for start page to preserve classical calmness
        if (currentStage !== 'start') {
          const tickOsc = ctx.createOscillator();
          tickOsc.type = 'sine';
          tickOsc.frequency.setValueAtTime(beatFreq, now + 0.1);
          const tickGain = ctx.createGain();
          tickGain.gain.setValueAtTime(0, now + 0.1);
          tickGain.gain.linearRampToValueAtTime(beatGainAmount, now + 0.14);
          tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
          tickOsc.connect(tickGain);
          tickGain.connect(masterGain);
          tickOsc.start(now + 0.1);
          tickOsc.stop(now + 0.5);
          synthNodesLocalRef.current.push(tickOsc);

          // Double heartbeat pulse if intense or concluding
          if (isSuspenseIntense || currentStage === 'conclude') {
            const secondTick = ctx.createOscillator();
            secondTick.type = 'sine';
            secondTick.frequency.setValueAtTime(beatFreq - 4, now + 0.38);
            const secondGain = ctx.createGain();
            secondGain.gain.setValueAtTime(0, now + 0.38);
            secondGain.gain.linearRampToValueAtTime(beatGainAmount * 0.85, now + 0.42);
            secondGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.62);
            secondTick.connect(secondGain);
            secondGain.connect(masterGain);
            secondTick.start(now + 0.38);
            secondTick.stop(now + 0.75);
            synthNodesLocalRef.current.push(secondTick);
          }
        }
      };

      // Play first chord immediately
      playChordNotes();
      
      // Dynamic tempo rotations: fast 4.0s loop for finales, 5.0s for investigations, 6.5s for classical screens
      const intervalMs = (isSuspenseIntense || currentStage === 'conclude') ? 4000 
                       : (currentStage === 'background') ? 5500
                       : (currentStage === 'start') ? 6500 
                       : 5000;
      synthIntervalRef.current = setInterval(playChordNotes, intervalMs);

      setIsPlaying(!sfxSettings.isMuted);
    } catch (e) {
      console.warn('[Story BGM Synth] Auto-play restricted or failed setup:', e);
    }
  };

  const stopSynth = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    synthNodesLocalRef.current.forEach(node => {
      try {
        if (node instanceof OscillatorNode) {
          node.stop();
        }
        node.disconnect();
      } catch (e) {}
    });
    synthNodesLocalRef.current = [];

    if (audioContextRef.current) {
      try { audioContextRef.current.close(); } catch (e) {}
      audioContextRef.current = null;
    }
  };

  // Re-start / transform synth loops when major stages or tension levels change!
  useEffect(() => {
    if (userHasInteractedRef.current) {
      startAmbientSynth();
    }
  }, [isSuspenseIntense, currentStage]);

  useEffect(() => {
    // Sync state with default sound settings on mount
    setIsPlaying(!sfxSettings.isMuted);

    // Listen for any initial interaction on document to activate audio context smoothly
    const handleFirstUserInteraction = () => {
      if (userHasInteractedRef.current) return;
      userHasInteractedRef.current = true;
      startAmbientSynth();
      
      // Clean up document-wide trigger once sound is active
      document.removeEventListener('pointerdown', handleFirstUserInteraction);
      document.removeEventListener('click', handleFirstUserInteraction);
    };

    document.addEventListener('pointerdown', handleFirstUserInteraction);
    document.addEventListener('click', handleFirstUserInteraction);

    return () => {
      document.removeEventListener('pointerdown', handleFirstUserInteraction);
      document.removeEventListener('click', handleFirstUserInteraction);
      stopSynth();
    };
  }, []);

  // Determine track names based on current game stage
  const getStageTrackLabel = () => {
    if (!isPlaying) return '音效与音乐已关';
    switch (currentStage) {
      case 'start':
        return '【肖邦之哀·深夜古典钢琴】';
      case 'background':
        return '【幽暗公馆·叙事断章虚无钢琴】';
      case 'conclude':
        return '【大审判·真相重合沉重钢琴变奏】';
      default:
        return isSuspenseIntense ? '【危局·急促高频低音钢琴】' : '【公馆探秘·漫步独奏忧伤钢琴】';
    }
  };

  return null;
}
