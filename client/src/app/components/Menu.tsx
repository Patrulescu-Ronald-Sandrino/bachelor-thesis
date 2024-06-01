import { PropsWithChildren, useRef, useState } from 'react';
import useEventListener from '../hooks/useEventListener.tsx';

interface Props extends PropsWithChildren {
  items: { name: string; action: () => void }[];
}

export default function Menu({ children, items }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  function toggleMenu() {
    setIsOpen(!isOpen);
  }

  function handleClickOutside(event: Event) {
    if (
      event instanceof MouseEvent &&
      menuRef.current &&
      !menuRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  }

  useEventListener('mousedown', handleClickOutside, document);

  return (
    <div className="menu-container" ref={menuRef}>
      <div className="menu-button" onClick={toggleMenu}>
        {children}
      </div>
      {isOpen && (
        <ul className="menu-list">
          {items.map(({ name, action }) => (
            <li
              key={name}
              onClick={() => {
                toggleMenu();
                action();
              }}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
