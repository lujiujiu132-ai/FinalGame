import { motion } from 'motion/react';
import { Play, HelpCircle, Compass } from 'lucide-react';
import { DRIVE_IMAGES } from '../caseData';
import { Language, t } from '../utils/i18n';

interface StartScreenProps {
  onStartGame: () => void;
  onShowInstructions: () => void;
  language: Language;
}

export default function StartScreen({ onStartGame, onShowInstructions, language }: StartScreenProps) {
  return (
    <div
      id="start-screen-container"
      className="relative flex flex-col justify-center items-center min-h-screen text-slate-100 bg-cover bg-center transition-all duration-700 bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.35), rgba(15, 23, 42, 0.6)), url('${DRIVE_IMAGES.bgStart}')`,
        backgroundColor: '#1e293b'
      }}
    >
      {/* Decorative Vintage Ambient Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05),rgba(15,23,42,0.4))] pointer-events-none" />

      <motion.div
        id="title-group"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center max-w-2xl px-6"
      >
        <div className="flex items-center justify-center space-x-2 text-rose-500 font-mono tracking-widest text-sm mb-4 uppercase">
          <Compass className="w-4 h-4 animate-spin-slow" />
          <span>{t('appSubtitle', language)} · {t('appTitle', language)}</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white mb-6 font-sans">
          {t('appTitle', language)} <span className="text-rose-500 font-serif font-light">·</span> {t('appSubtitle', language)}
        </h1>
        
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-10 max-w-lg mx-auto font-sans font-light">
          {t('startDesc', language)}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <motion.button
            id="btn-play-game"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStartGame}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-rose-600 hover:bg-rose-700 text-white font-medium px-8 py-3.5 rounded-lg shadow-lg hover:shadow-rose-950/50 transition-all duration-300 border border-rose-500/30 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" />
            <span className="tracking-wider">{t('enterGame', language)}</span>
          </motion.button>

          <motion.button
            id="btn-instructions"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShowInstructions}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-medium px-6 py-3.5 rounded-lg border border-slate-700 hover:border-slate-500 transition-all duration-300 cursor-pointer"
          >
            <HelpCircle className="w-5 h-5 text-slate-400" />
            <span>{t('opGuide', language)}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Humble Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-xs text-slate-500 font-mono">
        &copy; 2026 {t('appTitle', language)} · {t('enginePowered', language)}
      </div>
    </div>
  );
}
