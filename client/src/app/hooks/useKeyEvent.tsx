import useEventListener from './useEventListener.tsx';

interface Props {
  eventKey: string;
  callback: () => void;
  disabled: boolean;
}

export default function useKeyEvent({ eventKey, callback, disabled }: Props) {
  function handleKeyUp(e: Event) {
    if (!disabled && e instanceof KeyboardEvent && e.key === eventKey)
      callback();
  }

  useEventListener('keyup', handleKeyUp, window);
}
