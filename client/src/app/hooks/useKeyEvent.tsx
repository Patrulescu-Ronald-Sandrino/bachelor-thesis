import { useEffect } from 'react';

interface Props {
  eventKey?: string;
  callback: () => void;
}

export default function useKeyEvent({ eventKey, callback }: Props) {
  useEffect(() => {
    if (!eventKey) return;

    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === eventKey) callback();
    }

    const eventType = 'keyup';

    window.addEventListener(eventType, handleKeyUp);

    return () => window.removeEventListener(eventType, handleKeyUp);
  }, [eventKey, callback]);
}
