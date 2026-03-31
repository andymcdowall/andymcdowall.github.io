import { useState } from 'react'
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
// import EverythingEverywhereButton from './components/EverythingEverywhereButton'

/**
 * An example App component to demonstrate the ComponentRoulette in fullscreen.
 */
const App = () => {
  const [rouletteKey, setRouletteKey] = useState(0);

  const triggerEverything = () => setRouletteKey(prev => prev + 1);

  const stillComponents = [
    <TronResume personalInfo={andyPersonalInfo} />, // 10/10, very good
    <CliResume personalInfo={andyPersonalInfo} onEverything={triggerEverything} />, // 5/5, amazing interactivity
  ];

  const componentsToSpin = [
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
  ];

  return (
    // Main container is now relative and takes the full screen
    <div className="relative h-screen w-screen bg-gray-900">
      {rouletteKey === 0 ? (
        <CliResume personalInfo={andyPersonalInfo} onEverything={triggerEverything} />
      ) : (
        <ComponentRoulette
          key={rouletteKey}
          stillComponents={stillComponents}
          spinningComponents={componentsToSpin}
          spinDuration={4000}
        />
      )}
    </div>
  );
};

export default App;
