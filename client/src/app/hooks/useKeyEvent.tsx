import { useEffect } from 'react';

interface Props {
  eventKey: string;
  callback: () => void;
  disabled: boolean;
}

export default function useKeyEvent({ eventKey, callback, disabled }: Props) {
  useEffect(() => {
    if (disabled) return;

    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === eventKey) callback();
    }

    const eventType = 'keyup';

    window.addEventListener(eventType, handleKeyUp);

    return () => window.removeEventListener(eventType, handleKeyUp);
  }, [eventKey, callback, disabled]);
}
