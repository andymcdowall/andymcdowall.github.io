import React, { useState, useEffect, ReactElement } from 'react';

// --- The Roulette Component --- //

interface ComponentRouletteProps {
  /** An array of components to cycle through. */
  stillComponents: ReactElement[];
  spinningComponents: ReactElement[];
  /** Total duration of the spin animation in milliseconds. */
  spinDuration?: number;
  /** The index of the component to land on. If not provided, a random one will be chosen. */
  finalIndex?: number;
  /** Called with the stillComponents index when the spin settles. */
  onSettle?: (index: number) => void;
}

/**
 * A component that cycles through a list of child components with a "slot machine"
 * animation before settling on a final one.
 */
export const ComponentRoulette: React.FC<ComponentRouletteProps> = ({
  stillComponents,
  spinningComponents,
  spinDuration = 6000, // Default spin time: 4 seconds
  finalIndex,
  onSettle,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currSafeIndex] = useState(Math.floor(Math.random() * stillComponents.length));
  const [isSpinning, setIsSpinning] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!spinningComponents || spinningComponents.length === 0) {
      setIsSpinning(false);
      return;
    }

    setIsSpinning(true);
    const targetIndex = finalIndex !== undefined && finalIndex < spinningComponents.length
      ? finalIndex
      : Math.floor(Math.random() * spinningComponents.length);

    let spinTimeoutId: NodeJS.Timeout;
    
    const spin = (delay: number) => {
      spinTimeoutId = setTimeout(() => {
        setIsFading(true); // Start fade-out
        
        // After a short fade, switch the component and fade back in
        setTimeout(() => {
          setCurrentIndex(prevIndex => (prevIndex + 1) % spinningComponents.length);
          setIsFading(false); // Start fade-in
        }, 25); // This should match the transition duration

        const nextDelay = delay //+ (delay * 0.1) + 5;
        spin(nextDelay);

      }, delay);
    };

    spin(200);

    const stopTimeoutId = setTimeout(() => {
      clearTimeout(spinTimeoutId);
      setIsFading(true);
      // Final fade to the target component
      setTimeout(() => {
        setCurrentIndex(targetIndex);
        setIsSpinning(false);
        setIsFading(false);
        onSettle?.(currSafeIndex);
      }, 500);
    }, spinDuration);

    return () => {
      clearTimeout(spinTimeoutId);
      clearTimeout(stopTimeoutId);
    };
  }, [stillComponents, spinningComponents, spinDuration, finalIndex, currSafeIndex, onSettle]);

  if (!spinningComponents || spinningComponents.length === 0) {
    return null;
  }
  
  const transitionClasses = isFading 
    ? 'opacity-0 scale-95' 
    : 'opacity-100 scale-100';

  return (
    <div className="h-full w-full">
      <div className={`h-full w-full transition-all duration-100 ease-in-out ${transitionClasses}`}>
        {isSpinning ? spinningComponents[currentIndex] : stillComponents[currSafeIndex]}
      </div>
    </div>
  );
};
export default ComponentRoulette;
