import { useCallback, useEffect, useMemo, useState } from 'react'
// import './App.css'
import BarbieResume from './components/Resume/BarbieResume'
import HorrorPosterResume from './components/Resume/HorrorPosterResume'
import NeonTokyoResume from './components/Resume/NeonTokyoResume'
import { andyPersonalInfo } from './components/personalInfo'
import TypewriterResume from './components/Resume/TypewriterResume'
import Y2KResume from './components/Resume/Y2KResume'
import MacintoshResume from './components/Resume/MacintoshResume'
import CliResume from './components/Resume/CliResume'
import RetroGameResume from './components/Resume/RetroGamingResume'
import NoirResume from './components/Resume/NoirResume'
import GlassMorphismResume from './components/Resume/GlassMorphismResume'
import PostcardResume from './components/Resume/PostcardResume'
import TronResume from './components/TronTheme/TronResume'
import ComponentRoulette from './components/ComponentRoulette'
import EverythingEverywhereButton from './components/EverythingEverywhereButton'

// Index into stillComponents for the `ui` command in CliResume. 0 = TronResume.
const PREFERRED_UI_INDEX = 0;

// Names for each entry in componentsToSpin, in order.
const RESUME_NAMES = [
  "Y2K",
  "Typewriter",
  "Barbie",
  "Neon Tokyo",
  "Horror Poster",
  "Macintosh",
  "Retro Game",
  "Noir",
  "Glass Morphism",
  "Postcard",
  "Tron",
  "CLI",
];

/**
 * An example App component to demonstrate the ComponentRoulette in fullscreen.
 */
const App = () => {
  const [rouletteKey, setRouletteKey] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [showUI, setShowUI] = useState(false);
  const [directIndex, setDirectIndex] = useState<number | null>(null);

  const triggerEverything = useCallback(() => {
    setShowUI(false);
    setDirectIndex(null);
    setShowButton(true);
    setRouletteKey(prev => prev + 1);
  }, []);

  const switchToUI = useCallback(() => {
    setDirectIndex(null);
    setShowUI(true);
    setShowButton(true);
  }, []);

  const showResume = useCallback((n: number) => {
    setShowUI(false);
    setDirectIndex(n);
    setShowButton(true);
  }, []);

  const isOnTerminal = !showUI && directIndex === null && rouletteKey === 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '~' && !isOnTerminal) {
        e.preventDefault();
        setShowUI(false);
        setDirectIndex(null);
        setRouletteKey(0);
        setShowButton(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOnTerminal]);

  // stillComponents index 1 is CliResume — hide button if roulette lands there
  const handleSettle = useCallback((index: number) => setShowButton(index !== 1), []);

  const stillComponents = useMemo(() => [
    <TronResume personalInfo={andyPersonalInfo} />, // 10/10, very good
    <CliResume personalInfo={andyPersonalInfo} onEverything={triggerEverything} onSwitchToUI={switchToUI} onShowResume={showResume} resumeNames={RESUME_NAMES} />, // 5/5, amazing interactivity
  ], [triggerEverything, switchToUI, showResume]);

  const componentsToSpin = useMemo(() => [
    <Y2KResume personalInfo={andyPersonalInfo} />, // 4/5
    <TypewriterResume personalInfo={andyPersonalInfo} />, // 1/5
    <BarbieResume personalInfo={andyPersonalInfo} />, // 3/5
    <NeonTokyoResume personalInfo={andyPersonalInfo} />, // 4/5, hook error
    <HorrorPosterResume personalInfo={andyPersonalInfo} />, // 5/5, best one yet
    <MacintoshResume personalInfo={andyPersonalInfo} />, // 5/5, amazing interactivity
    <RetroGameResume personalInfo={andyPersonalInfo} />, // 3/5, mid
    <NoirResume personalInfo={andyPersonalInfo} />, // 4/5, pretty neat, neats work to be amazing
    <GlassMorphismResume personalInfo={andyPersonalInfo} />, // 4/5, pretty neat
    <PostcardResume personalInfo={andyPersonalInfo} />, // 3/5, mid
    ...stillComponents
  ], [stillComponents]);

  return (
    // Main container is now relative and takes the full screen
    <div className="relative h-screen w-screen bg-gray-900">
      {showUI ? (
        stillComponents[PREFERRED_UI_INDEX]
      ) : directIndex !== null ? (
        componentsToSpin[directIndex]
      ) : rouletteKey === 0 ? (
        <CliResume personalInfo={andyPersonalInfo} onEverything={triggerEverything} onSwitchToUI={switchToUI} onShowResume={showResume} resumeNames={RESUME_NAMES} />
      ) : (
        <ComponentRoulette
          key={rouletteKey}
          stillComponents={stillComponents}
          spinningComponents={componentsToSpin}
          spinDuration={4000}
          onSettle={handleSettle}
        />
      )}
      {showButton && (
        <EverythingEverywhereButton onClick={triggerEverything} />
      )}
    </div>
  );
};

export default App;
