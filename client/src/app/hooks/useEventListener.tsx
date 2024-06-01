import { useEffect } from 'react';

export default function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  element: HTMLElement | Window,
) {
  useEffect(() => {
    // Make sure the element supports addEventListener
    if (!(element && element.addEventListener)) return;

    element.addEventListener(eventName, handler);

    return () => element.removeEventListener(eventName, handler);
  }, [element, eventName, handler]);
}
